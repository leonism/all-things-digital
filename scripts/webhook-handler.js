#!/usr/bin/env node

/**
 * Webhook Handler for Decap CMS
 * 
 * This script provides a webhook endpoint that can be called by Decap CMS
 * to trigger blog data regeneration immediately after content is published.
 * 
 * Usage:
 *   node scripts/webhook-handler.js
 * 
 * The webhook will be available at: http://localhost:3001/webhook/regenerate
 */

import http from 'http';
import url from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const PORT = process.env.WEBHOOK_PORT || 3001;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';

/**
 * Executes the blog data regeneration process
 */
const regenerateBlogData = async () => {
  try {
    console.log('🚀 Starting blog data regeneration...');
    
    // Process frontmatter first
    console.log('📝 Processing frontmatter...');
    await execAsync('npm run process-frontmatter');
    
    // Generate blog data
    console.log('📊 Generating blog data...');
    await execAsync('npm run generate-blog-data');
    
    // Run build hooks
    console.log('🔧 Running build hooks...');
    await execAsync('npm run build-hooks');
    
    // Generate RSS and sitemap
    console.log('🌐 Generating RSS and sitemap...');
    await execAsync('npm run generate-rss');
    await execAsync('npm run generate-sitemap');
    
    console.log('✅ Blog data regeneration completed successfully!');
    return { success: true, message: 'Blog data regenerated successfully' };
    
  } catch (error) {
    console.error('❌ Error during blog data regeneration:', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Handles incoming webhook requests
 */
const handleWebhook = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health check endpoint
  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'blog-data-webhook'
    }));
    return;
  }
  
  // Webhook endpoint
  if (pathname === '/webhook/regenerate') {
    // Verify webhook secret if provided
    const providedSecret = query.secret || req.headers['x-webhook-secret'];
    if (WEBHOOK_SECRET !== 'your-webhook-secret' && providedSecret !== WEBHOOK_SECRET) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Invalid webhook secret' }));
      return;
    }
    
    if (req.method === 'POST' || req.method === 'GET') {
      console.log(`📡 Webhook triggered via ${req.method} request`);
      
      const result = await regenerateBlogData();
      
      const statusCode = result.success ? 200 : 500;
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ...result,
        timestamp: new Date().toISOString(),
        method: req.method
      }));
      return;
    }
  }
  
  // 404 for unknown endpoints
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    error: 'Not Found',
    message: 'Available endpoints: /health, /webhook/regenerate'
  }));
};

/**
 * Creates and starts the webhook server
 */
const startWebhookServer = () => {
  const server = http.createServer(handleWebhook);
  
  server.listen(PORT, () => {
    console.log(`🎣 Webhook server running on port ${PORT}`);
    console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook/regenerate`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Webhook secret: ${WEBHOOK_SECRET === 'your-webhook-secret' ? 'NOT SET (using default)' : 'SET'}`);
    console.log('\n💡 Usage examples:');
    console.log(`   curl -X POST http://localhost:${PORT}/webhook/regenerate`);
    console.log(`   curl http://localhost:${PORT}/health`);
    console.log('\n🛑 Press Ctrl+C to stop the server\n');
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down webhook server...');
    server.close(() => {
      console.log('✅ Webhook server stopped');
      process.exit(0);
    });
  });
  
  return server;
};

// Start the server if this script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startWebhookServer();
}

export { startWebhookServer, regenerateBlogData };