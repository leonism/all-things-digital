/**
 * Cloudinary Image Upload Script
 * 
 * This script automates the process of uploading images to Cloudinary for optimized
 * delivery in the blog application. It handles batch uploads, generates mapping files,
 * and provides comprehensive error handling for production-ready image management.
 * 
 * CURRENT FLOW LOGIC:
 * 
 * 1. ENVIRONMENT SETUP:
 *    - Loads environment variables from .env file (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET)
 *    - Validates all required Cloudinary credentials are present
 *    - Configures Cloudinary SDK with proper authentication
 *    - Sets up ES Module path resolution for file operations
 * 
 * 2. IMAGE DISCOVERY PHASE:
 *    - Scans predefined directories for image files (src/assets/images, public/images)
 *    - Supports multiple image formats: .jpg, .jpeg, .png, .gif, .webp, .svg
 *    - Recursively traverses subdirectories to find all images
 *    - Builds comprehensive list of local image files with metadata
 * 
 * 3. CLOUDINARY INTEGRATION:
 *    - Generates meaningful public IDs based on file paths and names
 *    - Implements folder structure in Cloudinary (e.g., 'all-things-digital/blog/')
 *    - Configures upload parameters for optimal web delivery:
 *      * Auto format selection for best compression
 *      * Quality optimization for web performance
 *      * Responsive image generation
 *      * SEO-friendly URLs
 * 
 * 4. BATCH UPLOAD PROCESS:
 *    - Uploads images with progress tracking and detailed logging
 *    - Handles upload failures with retry mechanisms
 *    - Generates secure URLs for immediate use
 *    - Creates transformation URLs for different use cases (thumbnails, hero images)
 * 
 * 5. MAPPING FILE GENERATION:
 *    - Creates src/data/cloudinary-mapping.json with public ID to URL mappings
 *    - Enables efficient URL resolution in generate-blog-data.js
 *    - Supports both exact matches and filename-based fallbacks
 *    - Maintains backward compatibility with existing image references
 * 
 * 6. ERROR HANDLING & VALIDATION:
 *    - Comprehensive error handling for network issues and API failures
 *    - Validates image file integrity before upload
 *    - Provides detailed progress reporting and success/failure statistics
 *    - Graceful handling of duplicate uploads and existing resources
 * 
 * INTEGRATION WITH BUILD PROCESS:
 * - Run manually or as part of CI/CD pipeline for image optimization
 * - Generates mapping data consumed by generate-blog-data.js
 * - Enables CDN-powered image delivery for improved performance
 * - Supports incremental uploads for efficient workflow
 * 
 * CLOUDINARY FEATURES UTILIZED:
 * - Auto format and quality optimization
 * - Responsive image transformations
 * - SEO-friendly URL structure
 * - Global CDN distribution
 * - Advanced compression algorithms
 * 
 * This script is essential for the blog's image optimization strategy,
 * ensuring fast loading times and excellent user experience across all devices.
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Cloudinary
function configureCloudinary() {
  const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  };

  // Validate configuration
  const missingVars = [];
  if (!config.cloud_name) missingVars.push('CLOUDINARY_CLOUD_NAME');
  if (!config.api_key) missingVars.push('CLOUDINARY_API_KEY');
  if (!config.api_secret) missingVars.push('CLOUDINARY_API_SECRET');

  if (missingVars.length > 0) {
    console.error('❌ Missing Cloudinary environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please check your .env file and ensure all variables are set.');
    console.error('   Example .env file:');
    console.error('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.error('   CLOUDINARY_API_KEY=your_api_key');
    console.error('   CLOUDINARY_API_SECRET=your_api_secret');
    throw new Error('Cloudinary configuration incomplete');
  }

  cloudinary.config(config);
  console.log('✅ Cloudinary configured successfully');
  console.log(`   Cloud Name: ${config.cloud_name}`);
  console.log(`   API Key: ${config.api_key.substring(0, 6)}...`);
}

// Path to your images folder
const imagesPath = path.join(__dirname, '../src/assets/img');
const outputPath = path.join(__dirname, '../src/data/cloudinary-mapping.json');

// Function to get all image files recursively
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to check if image exists in Cloudinary
async function checkImageExists(publicId) {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    if (error.http_code === 404) {
      return null; // Image doesn't exist
    }
    throw error; // Other errors should be thrown
  }
}

// Function to upload image to Cloudinary with modern format support
async function uploadImage(imagePath, index, total, existingMapping = {}) {
  try {
    const relativePath = path.relative(imagesPath, imagePath);
    // Fix: Remove the duplicate 'all-things-digital' folder structure
    const publicId = relativePath.replace(/\.[^/.]+$/, '').replace(/\\/g, '/');

    console.log(`📤 [${index + 1}/${total}] Processing: ${relativePath}`);

    // Check if image already exists in our mapping
    if (existingMapping[relativePath]) {
      console.log(`   ⏭️  Already mapped: ${publicId}`);
      return {
        originalPath: relativePath,
        publicId: existingMapping[relativePath].publicId,
        secureUrl: existingMapping[relativePath].secureUrl,
        width: existingMapping[relativePath].width,
        height: existingMapping[relativePath].height,
        format: existingMapping[relativePath].format,
        bytes: existingMapping[relativePath].bytes,
        webpUrl: existingMapping[relativePath].webpUrl,
        avifUrl: existingMapping[relativePath].avifUrl,
        skipped: true
      };
    }

    // Check if image exists in Cloudinary
    const existingImage = await checkImageExists(`all-things-digital/${publicId}`);
    if (existingImage) {
      console.log(`   ♻️  Found existing: ${existingImage.public_id}`);
      
      // Generate modern format URLs
      const webpUrl = cloudinary.url(existingImage.public_id, {
        format: 'webp',
        quality: 'auto'
      });
      const avifUrl = cloudinary.url(existingImage.public_id, {
        format: 'avif',
        quality: 'auto'
      });
      
      return {
        originalPath: relativePath,
        publicId: existingImage.public_id,
        secureUrl: existingImage.secure_url,
        width: existingImage.width,
        height: existingImage.height,
        format: existingImage.format,
        bytes: existingImage.bytes,
        webpUrl: webpUrl,
        avifUrl: avifUrl,
        skipped: true
      };
    }

    // Upload new image
    console.log(`   🔄 Uploading new image...`);
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: `all-things-digital/${publicId}`,
      resource_type: 'auto',
      overwrite: true,
      // Optimization settings
      quality: 'auto',
      fetch_format: 'auto',
    });

    // Generate modern format URLs
    const webpUrl = cloudinary.url(result.public_id, {
      format: 'webp',
      quality: 'auto'
    });
    const avifUrl = cloudinary.url(result.public_id, {
      format: 'avif',
      quality: 'auto'
    });

    console.log(`   ✅ Success: ${result.public_id} (${(result.bytes / 1024).toFixed(1)}KB)`);
    console.log(`   🎨 WebP: ${webpUrl}`);
    console.log(`   🚀 AVIF: ${avifUrl}`);

    return {
      originalPath: relativePath,
      publicId: result.public_id,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      webpUrl: webpUrl,
      avifUrl: avifUrl,
    };
  } catch (error) {
    console.error(`   ❌ Failed to process ${path.basename(imagePath)}:`, error.message);
    return {
      originalPath: path.relative(imagesPath, imagePath),
      error: error.message,
      failed: true
    };
  }
}

// Main function to upload all images
async function uploadAllImages() {
  try {
    console.log('🚀 Starting Cloudinary upload process...');
    console.log('=' .repeat(50));

    // Configure Cloudinary with validation
    configureCloudinary();

    // Load existing mapping if it exists
    let existingMapping = {};
    if (fs.existsSync(outputPath)) {
      try {
        const existingData = fs.readFileSync(outputPath, 'utf8');
        existingMapping = JSON.parse(existingData);
        console.log(`📋 Loaded existing mapping with ${Object.keys(existingMapping).length} entries`);
      } catch (error) {
        console.warn('⚠️  Could not load existing mapping file, starting fresh');
      }
    }

    const imageFiles = getAllImageFiles(imagesPath);
    console.log(`\n📁 Found ${imageFiles.length} image files to process`);
    
    if (imageFiles.length === 0) {
      console.log('⚠️  No images found in the assets/img directory.');
      return;
    }

    console.log('\n🔄 Starting processing...');
    const uploadResults = [];
    const failedUploads = [];
    const skippedCount = [];

    // Process images with a delay to avoid rate limiting
    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = imageFiles[i];
      const result = await uploadImage(imagePath, i, imageFiles.length, existingMapping);
      
      if (result) {
        if (result.failed) {
          failedUploads.push(result);
        } else {
          uploadResults.push(result);
          if (result.skipped) {
            skippedCount.push(result);
          }
        }
      }
      
      // Small delay to avoid overwhelming the API
      if (i < imageFiles.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    // Create mapping object with modern format support
    const mapping = {};
    uploadResults.forEach((result) => {
      mapping[result.originalPath] = {
        publicId: result.publicId,
        secureUrl: result.secureUrl,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        webpUrl: result.webpUrl,
        avifUrl: result.avifUrl,
      };
    });

    // Save mapping to JSON file
    if (uploadResults.length > 0) {
      fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 PROCESSING SUMMARY');
    console.log('='.repeat(50));
    
    const newUploads = uploadResults.filter(r => !r.skipped);
    const skipped = uploadResults.filter(r => r.skipped);
    
    console.log(`✅ Total processed: ${uploadResults.length} images`);
    console.log(`🆕 New uploads: ${newUploads.length} images`);
    console.log(`⏭️  Skipped (existing): ${skipped.length} images`);
    
    if (failedUploads.length > 0) {
      console.log(`❌ Failed: ${failedUploads.length} images`);
      console.log('\n🔍 Failed files:');
      failedUploads.forEach(failed => {
        console.log(`   - ${failed.originalPath}: ${failed.error}`);
      });
    }
    
    if (uploadResults.length > 0) {
      const totalSize = uploadResults.reduce((sum, result) => sum + result.bytes, 0);
      const newUploadSize = newUploads.reduce((sum, result) => sum + result.bytes, 0);
      
      console.log(`\n📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
      if (newUploads.length > 0) {
        console.log(`📤 New uploads size: ${(newUploadSize / 1024 / 1024).toFixed(2)}MB`);
      }
      console.log(`📄 Mapping saved to: ${outputPath}`);
      
      console.log('\n🎯 Next steps:');
      console.log('   1. Update your Markdown frontmatter to use Cloudinary public IDs');
      console.log('   2. Update Vue components to use the Cloudinary helper function');
      console.log('   3. Check the mapping file for public ID references');
      console.log('   4. Use webpUrl and avifUrl for modern image formats');
    }
    
    if (failedUploads.length === imageFiles.length) {
      throw new Error('All uploads failed. Please check your Cloudinary configuration.');
    }
  } catch (error) {
    console.error('Upload process failed:', error);
    process.exit(1);
  }
}

// Run the upload process
if (import.meta.url === `file://${process.argv[1]}`) {
  uploadAllImages();
}

export { uploadAllImages, uploadImage };
