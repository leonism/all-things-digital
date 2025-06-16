#!/usr/bin/env node

/**
 * Cloudinary Mapping Server for Decap CMS Integration
 * 
 * This script creates a simple HTTP server that serves the cloudinary-mapping.json
 * file to the Decap CMS admin interface, enabling the web admin to access
 * uploaded Cloudinary images.
 * 
 * Usage:
 *   node scripts/serve-cloudinary-mapping.js
 * 
 * The server will:
 * - Serve cloudinary-mapping.json at /api/cloudinary-mapping
 * - Enable CORS for admin interface access
 * - Watch for file changes and reload automatically
 * - Provide a health check endpoint
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.CLOUDINARY_MAPPING_PORT || 3002;
const MAPPING_FILE = path.join(__dirname, '../src/data/cloudinary-mapping.json');
const HOST = '0.0.0.0';

// Cache for the mapping data
let mappingData = null;
let lastModified = null;

/**
 * Load cloudinary mapping data from file
 */
function loadMappingData() {
  try {
    if (fs.existsSync(MAPPING_FILE)) {
      const stats = fs.statSync(MAPPING_FILE);
      
      // Only reload if file has been modified
      if (!lastModified || stats.mtime > lastModified) {
        const rawData = fs.readFileSync(MAPPING_FILE, 'utf8');
        mappingData = JSON.parse(rawData);
        lastModified = stats.mtime;
        
        console.log(`📁 Loaded ${Object.keys(mappingData).length} images from cloudinary-mapping.json`);
        console.log(`📅 Last modified: ${lastModified.toISOString()}`);
      }
    } else {
      console.warn('⚠️  cloudinary-mapping.json not found. Run upload script first.');
      mappingData = {};
    }
  } catch (error) {
    console.error('❌ Error loading cloudinary mapping:', error.message);
    mappingData = {};
  }
}

/**
 * Set CORS headers for cross-origin requests
 */
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
}

/**
 * Handle HTTP requests
 */
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Set CORS headers for all requests
  setCORSHeaders(res);
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Route handling
  switch (pathname) {
    case '/api/cloudinary-mapping':
    case '/cloudinary-mapping':
    case '/cloudinary-mapping.json':
      handleMappingRequest(req, res);
      break;
      
    case '/health':
    case '/api/health':
      handleHealthCheck(req, res);
      break;
      
    case '/':
      handleRootRequest(req, res);
      break;
      
    default:
      handle404(req, res);
      break;
  }
}

/**
 * Handle cloudinary mapping requests
 */
function handleMappingRequest(req, res) {
  // Reload data to get latest changes
  loadMappingData();
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  if (mappingData) {
    res.writeHead(200);
    res.end(JSON.stringify(mappingData, null, 2));
    
    console.log(`📤 Served cloudinary mapping (${Object.keys(mappingData).length} images)`);
  } else {
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Failed to load cloudinary mapping' }));
  }
}

/**
 * Handle health check requests
 */
function handleHealthCheck(req, res) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    mappingFile: {
      exists: fs.existsSync(MAPPING_FILE),
      lastModified: lastModified ? lastModified.toISOString() : null,
      imageCount: mappingData ? Object.keys(mappingData).length : 0
    },
    server: {
      port: PORT,
      uptime: process.uptime()
    }
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(health, null, 2));
}

/**
 * Handle root requests
 */
function handleRootRequest(req, res) {
  const info = {
    service: 'Cloudinary Mapping Server',
    version: '1.0.0',
    endpoints: {
      mapping: '/api/cloudinary-mapping',
      health: '/api/health'
    },
    usage: {
      description: 'Serves cloudinary-mapping.json for Decap CMS integration',
      example: `curl http://localhost:${PORT}/api/cloudinary-mapping`
    }
  };
  
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(info, null, 2));
}

/**
 * Handle 404 requests
 */
function handle404(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(404);
  res.end(JSON.stringify({ 
    error: 'Not Found',
    availableEndpoints: ['/api/cloudinary-mapping', '/api/health', '/']
  }));
}

/**
 * Start the server
 */
function startServer() {
  // Load initial data
  loadMappingData();
  
  // Create HTTP server
  const server = http.createServer(handleRequest);
  
  // Start listening
  server.listen(PORT, HOST, () => {
    console.log('🚀 Cloudinary Mapping Server started');
    console.log(`📍 Server running at http://${HOST}:${PORT}`);
    console.log(`📋 Endpoints:`);
    console.log(`   • Mapping: http://localhost:${PORT}/api/cloudinary-mapping`);
    console.log(`   • Health:  http://localhost:${PORT}/api/health`);
    console.log('');
    console.log('💡 Usage in Decap CMS:');
    console.log('   Update your cloudinary-media-extension.js to fetch from:');
    console.log(`   http://localhost:${PORT}/api/cloudinary-mapping`);
    console.log('');
  });
  
  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`);
      console.log('💡 Try a different port: CLOUDINARY_MAPPING_PORT=3003 node scripts/serve-cloudinary-mapping.js');
    } else {
      console.error('❌ Server error:', error.message);
    }
    process.exit(1);
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Cloudinary Mapping Server...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
  
  // Watch for file changes (optional)
  if (fs.existsSync(MAPPING_FILE)) {
    fs.watchFile(MAPPING_FILE, (curr, prev) => {
      console.log('📁 cloudinary-mapping.json changed, reloading...');
      loadMappingData();
    });
  }
}

// Start the server if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export {
  startServer,
  loadMappingData,
  PORT,
  MAPPING_FILE
};