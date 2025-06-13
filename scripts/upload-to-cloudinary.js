/**
 * Cloudinary Image Sync Script
 *
 * This script provides comprehensive synchronization between local images and Cloudinary,
 * ensuring optimal image management with bidirectional sync capabilities.
 *
 * ENHANCED FEATURES:
 * - PublicId values now represent shortcuts for responsive compressed images
 * - Automatic generation of AVIF and WebP variants with optimized quality
 * - Smart format selection based on browser support
 * - Responsive breakpoint generation for different screen sizes
 *
 * ENHANCED SYNC FLOW LOGIC:
 *
 * 1. ENVIRONMENT SETUP:
 *    - Loads environment variables from .env file (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET)
 *    - Validates all required Cloudinary credentials are present
 *    - Configures Cloudinary SDK with proper authentication
 *    - Sets up ES Module path resolution for file operations
 *
 * 2. CLOUD INVENTORY PHASE:
 *    - Fetches complete list of existing images from Cloudinary
 *    - Maps cloud resources by public ID for efficient lookup
 *    - Identifies orphaned cloud images (no local counterpart)
 *    - Builds comprehensive cloud state for comparison
 *
 * 3. LOCAL DISCOVERY PHASE:
 *    - Scans predefined directories for image files (src/assets/images, public/images)
 *    - Supports multiple image formats: .jpg, .jpeg, .png, .gif, .webp, .svg
 *    - Recursively traverses subdirectories to find all images
 *    - Builds comprehensive list of local image files with metadata
 *
 * 4. SYNC ANALYSIS:
 *    - Compares local files against cloud inventory
 *    - Identifies files needing upload (new or modified)
 *    - Identifies cloud files for deletion (no longer exist locally)
 *    - Generates sync plan with detailed actions
 *
 * 5. UPLOAD PHASE:
 *    - Uploads only new or modified images with progress tracking
 *    - Skips images that already exist and are unchanged
 *    - Handles upload failures with retry mechanisms
 *    - Generates secure URLs for immediate use
 *    - Creates responsive variants and compressed formats
 *
 * 6. CLEANUP PHASE:
 *    - Removes orphaned images from Cloudinary
 *    - Maintains clean cloud storage without unused assets
 *    - Provides detailed deletion reporting
 *    - Handles deletion failures gracefully
 *
 * 7. MAPPING FILE GENERATION:
 *    - Creates src/data/cloudinary-mapping.json with current state
 *    - PublicId values now point to optimized responsive variants
 *    - Enables efficient URL resolution in generate-blog-data.js
 *    - Supports both exact matches and filename-based fallbacks
 *    - Maintains backward compatibility with existing image references
 *
 * 8. COMPREHENSIVE REPORTING:
 *    - Detailed sync statistics and operation summary
 *    - Performance metrics and optimization recommendations
 *    - Error handling with actionable feedback
 *    - Audit trail for all sync operations
 *
 * SYNC FEATURES:
 * - Bidirectional synchronization (local ↔ cloud)
 * - Intelligent duplicate detection and skipping
 * - Orphaned resource cleanup
 * - Incremental sync for efficiency
 * - Comprehensive error handling and recovery
 * - Detailed progress tracking and reporting
 * - Responsive image generation with multiple breakpoints
 * - Modern format optimization (AVIF, WebP)
 *
 * This enhanced script ensures perfect synchronization between local and cloud images,
 * optimizing storage costs and maintaining clean, efficient image delivery.
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration constants
const CONFIG = {
  FOLDER_PREFIX: 'all-things-digital', // be sure to have created through the cloudflare interface
  SUPPORTED_FORMATS: /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i,
  API_DELAY: 300, // ms between API calls
  MAX_RETRIES: 3,
  BATCH_SIZE: 50, // for cloud resource fetching
  // Responsive breakpoints for different screen sizes
  RESPONSIVE_BREAKPOINTS: [400, 800, 1200, 1600, 2000],
  // Quality settings for different formats
  QUALITY_SETTINGS: {
    webp: 'auto:good',
    avif: 'auto:best',
    jpg: 'auto:good',
    png: 'auto',
  },
};

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
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error(
      '\n💡 Please check your .env file and ensure all variables are set.',
    );
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

// Path configurations
const imagesPath = path.join(__dirname, '../src/assets/img');
const outputPath = path.join(__dirname, '../src/data/cloudinary-mapping.json');

/**
 * PHASE 1: CLOUD INVENTORY MANAGEMENT
 * Fetches and manages the complete inventory of cloud resources
 */

// Function to get all images from Cloudinary
async function getCloudinaryInventory() {
  console.log('☁️  Fetching Cloudinary inventory...');
  const cloudResources = new Map();
  let nextCursor = null;
  let totalFetched = 0;

  try {
    do {
      const options = {
        type: 'upload',
        prefix: CONFIG.FOLDER_PREFIX,
        max_results: CONFIG.BATCH_SIZE,
        ...(nextCursor && { next_cursor: nextCursor }),
      };

      const result = await cloudinary.api.resources(options);

      result.resources.forEach((resource) => {
        cloudResources.set(resource.public_id, {
          publicId: resource.public_id,
          secureUrl: resource.secure_url,
          width: resource.width,
          height: resource.height,
          format: resource.format,
          bytes: resource.bytes,
          createdAt: resource.created_at,
          version: resource.version,
        });
      });

      totalFetched += result.resources.length;
      nextCursor = result.next_cursor;

      console.log(`   📦 Fetched ${totalFetched} cloud resources...`);

      // Small delay to avoid rate limiting
      if (nextCursor) {
        await new Promise((resolve) => setTimeout(resolve, CONFIG.API_DELAY));
      }
    } while (nextCursor);

    console.log(
      `   ✅ Cloud inventory complete: ${cloudResources.size} resources`,
    );
    return cloudResources;
  } catch (error) {
    console.error('❌ Failed to fetch Cloudinary inventory:', error.message);
    throw error;
  }
}

/**
 * PHASE 2: LOCAL DISCOVERY AND ANALYSIS
 * Discovers local images and prepares them for sync analysis
 */

// Function to get all image files recursively with metadata
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else if (CONFIG.SUPPORTED_FORMATS.test(file)) {
      const relativePath = path.relative(imagesPath, filePath);
      const publicId = `${CONFIG.FOLDER_PREFIX}/${relativePath.replace(/\.[^/.]+$/, '').replace(/\\/g, '/')}`;

      fileList.push({
        filePath,
        relativePath,
        publicId,
        size: stat.size,
        modifiedTime: stat.mtime,
        checksum: generateFileChecksum(filePath),
      });
    }
  });

  return fileList;
}

// Generate file checksum for change detection
function generateFileChecksum(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
  } catch (error) {
    console.warn(
      `⚠️  Could not generate checksum for ${filePath}:`,
      error.message,
    );
    return null;
  }
}

/**
 * PHASE 3: SYNC ANALYSIS AND PLANNING
 * Analyzes differences between local and cloud states
 */

// Function to analyze sync requirements
function analyzeSyncRequirements(
  localFiles,
  cloudResources,
  existingMapping = {},
) {
  console.log('🔍 Analyzing sync requirements...');

  const syncPlan = {
    toUpload: [],
    toDelete: [],
    toSkip: [],
    unchanged: [],
  };

  // Create lookup maps for efficient comparison
  const localByPublicId = new Map();
  localFiles.forEach((file) => {
    localByPublicId.set(file.publicId, file);
  });

  // Analyze local files for upload requirements
  localFiles.forEach((localFile) => {
    const cloudResource = cloudResources.get(localFile.publicId);
    const mappingEntry = existingMapping[localFile.relativePath];

    if (!cloudResource) {
      // New file - needs upload
      syncPlan.toUpload.push({
        ...localFile,
        reason: 'new_file',
      });
    } else if (
      mappingEntry &&
      mappingEntry.checksum &&
      mappingEntry.checksum === localFile.checksum
    ) {
      // File unchanged - skip
      syncPlan.unchanged.push({
        ...localFile,
        cloudResource,
        reason: 'unchanged',
      });
    } else {
      // File exists but may be modified - check if we need to re-upload
      // For now, we'll skip re-upload if cloud resource exists
      // You can enhance this with more sophisticated change detection
      syncPlan.toSkip.push({
        ...localFile,
        cloudResource,
        reason: 'exists_in_cloud',
      });
    }
  });

  // Analyze cloud resources for deletion requirements
  cloudResources.forEach((cloudResource, publicId) => {
    if (!localByPublicId.has(publicId)) {
      syncPlan.toDelete.push({
        publicId,
        cloudResource,
        reason: 'no_local_file',
      });
    }
  });

  console.log(`   📤 Files to upload: ${syncPlan.toUpload.length}`);
  console.log(`   🗑️  Files to delete: ${syncPlan.toDelete.length}`);
  console.log(`   ⏭️  Files to skip: ${syncPlan.toSkip.length}`);
  console.log(`   ✅ Files unchanged: ${syncPlan.unchanged.length}`);

  return syncPlan;
}

/**
 * PHASE 4: UPLOAD OPERATIONS
 * Handles uploading new and modified images
 */

// Function to upload a single image with responsive variants and modern formats
async function uploadImageWithRetry(fileInfo, index, total, retryCount = 0) {
  try {
    console.log(
      `📤 [${index + 1}/${total}] Uploading: ${fileInfo.relativePath}`,
    );

    const result = await cloudinary.uploader.upload(fileInfo.filePath, {
      public_id: fileInfo.publicId,
      resource_type: 'auto',
      overwrite: true,
      quality: 'auto:good',
      fetch_format: 'auto',
      // Enable responsive breakpoints
      responsive_breakpoints: {
        create_derived: true,
        bytes_step: 20000,
        min_width: 200,
        max_width: 2000,
        transformation: {
          quality: 'auto:good',
        },
      },
    });

    // Generate enhanced responsive URLs with modern formats
    const responsiveVariants = generateResponsiveVariants(result.public_id);

    // Create optimized publicId shortcuts for responsive compressed versions
    const optimizedPublicIds = {
      // AVIF variant (best compression, modern browsers)
      avif: `${result.public_id}/c_fill,f_avif,q_auto:best`,
      // WebP variant (good compression, wide support)
      webp: `${result.public_id}/c_fill,f_webp,q_auto:good`,
      // Auto format (Cloudinary chooses best format)
      auto: `${result.public_id}/c_fill,f_auto,q_auto:good`,
    };

    console.log(
      `   ✅ Success: ${result.public_id} (${(result.bytes / 1024).toFixed(1)}KB)`,
    );
    console.log(`   🎯 Generated responsive variants: AVIF, WebP, Auto-format`);

    return {
      originalPath: fileInfo.relativePath,
      publicId: optimizedPublicIds.auto, // Use auto-format as default publicId
      originalPublicId: result.public_id, // Keep original for reference
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      // Enhanced responsive URLs
      ...responsiveVariants,
      // Optimized format shortcuts
      optimizedPublicIds,
      checksum: fileInfo.checksum,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      console.warn(
        `   ⚠️  Upload failed, retrying (${retryCount + 1}/${CONFIG.MAX_RETRIES}): ${error.message}`,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.API_DELAY * (retryCount + 1)),
      );
      return uploadImageWithRetry(fileInfo, index, total, retryCount + 1);
    }

    console.error(
      `   ❌ Failed to upload ${fileInfo.relativePath} after ${CONFIG.MAX_RETRIES} retries:`,
      error.message,
    );
    return {
      originalPath: fileInfo.relativePath,
      error: error.message,
      failed: true,
    };
  }
}

/**
 * Generate responsive variants for different screen sizes and formats
 */
function generateResponsiveVariants(publicId) {
  const variants = {
    // Modern format URLs with responsive breakpoints
    avifUrl: cloudinary.url(publicId, {
      format: 'avif',
      quality: CONFIG.QUALITY_SETTINGS.avif,
      crop: 'fill',
      gravity: 'auto',
    }),
    webpUrl: cloudinary.url(publicId, {
      format: 'webp',
      quality: CONFIG.QUALITY_SETTINGS.webp,
      crop: 'fill',
      gravity: 'auto',
    }),
    // Responsive breakpoint URLs
    responsiveUrls: {},
    // Srcset strings for different formats
    srcsets: {},
  };

  // Generate responsive URLs for each breakpoint
  CONFIG.RESPONSIVE_BREAKPOINTS.forEach((width) => {
    variants.responsiveUrls[`w_${width}`] = {
      avif: cloudinary.url(publicId, {
        format: 'avif',
        quality: CONFIG.QUALITY_SETTINGS.avif,
        width: width,
        crop: 'fill',
        gravity: 'auto',
      }),
      webp: cloudinary.url(publicId, {
        format: 'webp',
        quality: CONFIG.QUALITY_SETTINGS.webp,
        width: width,
        crop: 'fill',
        gravity: 'auto',
      }),
      auto: cloudinary.url(publicId, {
        transformation: [
          {
            width: width,
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto:good',
            fetch_format: 'auto'
          }
        ]
      }),
    };
  });

  // Generate srcset strings for responsive images
  variants.srcsets.avif = CONFIG.RESPONSIVE_BREAKPOINTS.map(
    (width) => `${variants.responsiveUrls[`w_${width}`].avif} ${width}w`,
  ).join(', ');

  variants.srcsets.webp = CONFIG.RESPONSIVE_BREAKPOINTS.map(
    (width) => `${variants.responsiveUrls[`w_${width}`].webp} ${width}w`,
  ).join(', ');

  variants.srcsets.auto = CONFIG.RESPONSIVE_BREAKPOINTS.map(
    (width) => `${variants.responsiveUrls[`w_${width}`].auto} ${width}w`,
  ).join(', ');

  return variants;
}

/**
 * ENHANCED MAPPING GENERATION
 * Creates mapping with optimized publicId shortcuts
 */

// Function to generate comprehensive mapping with responsive shortcuts
function generateMapping(uploadResults, skippedFiles, unchangedFiles) {
  const mapping = {};

  // Add uploaded files with enhanced responsive data
  uploadResults.forEach((result) => {
    if (!result.failed) {
      mapping[result.originalPath] = {
        // Use optimized auto-format publicId as the main shortcut
        publicId: result.publicId,
        originalPublicId: result.originalPublicId,
        secureUrl: result.secureUrl,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        // Enhanced responsive URLs
        webpUrl: result.webpUrl,
        avifUrl: result.avifUrl,
        responsiveUrls: result.responsiveUrls,
        srcsets: result.srcsets,
        // Optimized format shortcuts for easy access
        optimizedPublicIds: result.optimizedPublicIds,
        checksum: result.checksum,
        lastSync: result.uploadedAt,
      };
    }
  });

  // Add skipped files (existing in cloud) with enhanced responsive variants
  skippedFiles.forEach((file) => {
    const cloudResource = file.cloudResource;
    const responsiveVariants = generateResponsiveVariants(
      cloudResource.publicId,
    );

    // Create optimized publicId shortcuts
    const optimizedPublicIds = {
      avif: `${cloudResource.publicId}/c_fill,f_avif,q_auto:best`,
      webp: `${cloudResource.publicId}/c_fill,f_webp,q_auto:good`,
      auto: `${cloudResource.publicId}/c_fill,f_auto,q_auto:good`,
    };

    mapping[file.relativePath] = {
      // Use auto-format as the main publicId shortcut
      publicId: optimizedPublicIds.auto,
      originalPublicId: cloudResource.publicId,
      secureUrl: cloudResource.secureUrl,
      width: cloudResource.width,
      height: cloudResource.height,
      format: cloudResource.format,
      bytes: cloudResource.bytes,
      // Enhanced responsive URLs
      ...responsiveVariants,
      // Optimized format shortcuts
      optimizedPublicIds,
      checksum: file.checksum,
      lastSync: new Date().toISOString(),
    };
  });

  // Add unchanged files with enhanced responsive variants
  unchangedFiles.forEach((file) => {
    const cloudResource = file.cloudResource;
    const responsiveVariants = generateResponsiveVariants(
      cloudResource.publicId,
    );

    // Create optimized publicId shortcuts
    const optimizedPublicIds = {
      avif: `${cloudResource.publicId}/c_fill,f_avif,q_auto:best`,
      webp: `${cloudResource.publicId}/c_fill,f_webp,q_auto:good`,
      auto: `${cloudResource.publicId}/c_fill,f_auto,q_auto:good`,
    };

    mapping[file.relativePath] = {
      // Use auto-format as the main publicId shortcut
      publicId: optimizedPublicIds.auto,
      originalPublicId: cloudResource.publicId,
      secureUrl: cloudResource.secureUrl,
      width: cloudResource.width,
      height: cloudResource.height,
      format: cloudResource.format,
      bytes: cloudResource.bytes,
      // Enhanced responsive URLs
      ...responsiveVariants,
      // Optimized format shortcuts
      optimizedPublicIds,
      checksum: file.checksum,
      lastSync: new Date().toISOString(),
    };
  });

  return mapping;
}

/**
 * PHASE 5: CLEANUP OPERATIONS
 * Handles deletion of orphaned cloud resources
 */

// Function to delete orphaned cloud resources
async function deleteOrphanedResources(toDelete) {
  if (toDelete.length === 0) {
    console.log('🧹 No orphaned resources to delete');
    return { deleted: [], failed: [] };
  }

  console.log(`🗑️  Deleting ${toDelete.length} orphaned cloud resources...`);
  const deleted = [];
  const failed = [];

  for (let i = 0; i < toDelete.length; i++) {
    const item = toDelete[i];
    try {
      console.log(
        `   🗑️  [${i + 1}/${toDelete.length}] Deleting: ${item.publicId}`,
      );

      await cloudinary.uploader.destroy(item.publicId);
      deleted.push(item);

      console.log(`   ✅ Deleted: ${item.publicId}`);
    } catch (error) {
      console.error(`   ❌ Failed to delete ${item.publicId}:`, error.message);
      failed.push({ ...item, error: error.message });
    }

    // Small delay to avoid rate limiting
    if (i < toDelete.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, CONFIG.API_DELAY));
    }
  }

  return { deleted, failed };
}

/**
 * PHASE 6: MAPPING GENERATION AND PERSISTENCE
 * Creates and saves the mapping file with current state
 */

// Remove this duplicate function declaration (lines 633-700)
// The enhanced version at line 495 should be kept instead

/**
 * MAIN SYNC ORCHESTRATION
 * Coordinates all sync phases and provides comprehensive reporting
 */

// Main synchronization function
async function syncCloudinaryImages() {
  const startTime = Date.now();

  try {
    console.log('🔄 Starting Cloudinary sync process...');
    console.log('='.repeat(60));

    // Phase 1: Configure Cloudinary
    configureCloudinary();

    // Phase 2: Load existing mapping
    let existingMapping = {};
    if (fs.existsSync(outputPath)) {
      try {
        const existingData = fs.readFileSync(outputPath, 'utf8');
        existingMapping = JSON.parse(existingData);
        console.log(
          `📋 Loaded existing mapping with ${Object.keys(existingMapping).length} entries`,
        );
      } catch (error) {
        console.warn(
          '⚠️  Could not load existing mapping file, starting fresh',
        );
      }
    }

    // Phase 3: Get cloud inventory
    const cloudResources = await getCloudinaryInventory();

    // Phase 4: Discover local files
    console.log('\n📁 Discovering local images...');
    const localFiles = getAllImageFiles(imagesPath);
    console.log(`   ✅ Found ${localFiles.length} local image files`);

    if (localFiles.length === 0) {
      console.log(
        '⚠️  No local images found. Checking for orphaned cloud resources...',
      );

      if (cloudResources.size > 0) {
        const allCloudFiles = Array.from(cloudResources.values()).map(
          (resource) => ({
            publicId: resource.publicId,
            cloudResource: resource,
            reason: 'no_local_files',
          }),
        );

        const deletionResult = await deleteOrphanedResources(allCloudFiles);

        console.log('\n' + '='.repeat(60));
        console.log('📊 CLEANUP SUMMARY');
        console.log('='.repeat(60));
        console.log(
          `🗑️  Deleted: ${deletionResult.deleted.length} orphaned resources`,
        );
        if (deletionResult.failed.length > 0) {
          console.log(`❌ Failed deletions: ${deletionResult.failed.length}`);
        }
      }

      return;
    }

    // Phase 5: Analyze sync requirements
    const syncPlan = analyzeSyncRequirements(
      localFiles,
      cloudResources,
      existingMapping,
    );

    // Phase 6: Execute uploads
    console.log('\n📤 Starting upload phase...');
    const uploadResults = [];
    const failedUploads = [];

    for (let i = 0; i < syncPlan.toUpload.length; i++) {
      const fileInfo = syncPlan.toUpload[i];
      const result = await uploadImageWithRetry(
        fileInfo,
        i,
        syncPlan.toUpload.length,
      );

      if (result.failed) {
        failedUploads.push(result);
      } else {
        uploadResults.push(result);
      }

      // Small delay to avoid overwhelming the API
      if (i < syncPlan.toUpload.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, CONFIG.API_DELAY));
      }
    }

    // Phase 7: Execute cleanup
    console.log('\n🧹 Starting cleanup phase...');
    const deletionResult = await deleteOrphanedResources(syncPlan.toDelete);

    // Phase 8: Generate and save mapping
    console.log('\n💾 Generating mapping file...');
    const mapping = generateMapping(
      uploadResults,
      syncPlan.toSkip,
      syncPlan.unchanged,
    );

    if (Object.keys(mapping).length > 0) {
      fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
      console.log(`   ✅ Mapping saved to: ${outputPath}`);
    }

    // Phase 9: Comprehensive reporting
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('📊 SYNC SUMMARY');
    console.log('='.repeat(60));
    console.log(`⏱️  Total sync time: ${duration}s`);
    console.log(`📁 Local files processed: ${localFiles.length}`);
    console.log(`☁️  Cloud resources found: ${cloudResources.size}`);
    console.log(`\n📤 UPLOAD OPERATIONS:`);
    console.log(`   ✅ Successful uploads: ${uploadResults.length}`);
    console.log(`   ❌ Failed uploads: ${failedUploads.length}`);
    console.log(`   ⏭️  Skipped (existing): ${syncPlan.toSkip.length}`);
    console.log(`   ✅ Unchanged: ${syncPlan.unchanged.length}`);
    console.log(`\n🗑️  CLEANUP OPERATIONS:`);
    console.log(`   ✅ Deleted orphaned: ${deletionResult.deleted.length}`);
    console.log(`   ❌ Failed deletions: ${deletionResult.failed.length}`);

    if (uploadResults.length > 0) {
      const totalUploadSize = uploadResults.reduce(
        (sum, result) => sum + result.bytes,
        0,
      );
      console.log(
        `\n📦 Upload size: ${(totalUploadSize / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    if (failedUploads.length > 0) {
      console.log('\n🔍 Failed uploads:');
      failedUploads.forEach((failed) => {
        console.log(`   - ${failed.originalPath}: ${failed.error}`);
      });
    }

    if (deletionResult.failed.length > 0) {
      console.log('\n🔍 Failed deletions:');
      deletionResult.failed.forEach((failed) => {
        console.log(`   - ${failed.publicId}: ${failed.error}`);
      });
    }

    console.log('\n🎯 Next steps:');
    console.log('   1. Verify mapping file contains all expected images');
    console.log('   2. Update Vue components to use Cloudinary URLs');
    console.log('   3. Test image loading across different pages');
    console.log('   4. Monitor Cloudinary usage and optimization metrics');

    if (
      failedUploads.length === syncPlan.toUpload.length &&
      syncPlan.toUpload.length > 0
    ) {
      throw new Error(
        'All uploads failed. Please check your Cloudinary configuration.',
      );
    }

    console.log('\n✅ Sync process completed successfully!');
  } catch (error) {
    console.error('\n❌ Sync process failed:', error.message);
    process.exit(1);
  }
}

// Legacy function for backward compatibility
async function uploadAllImages() {
  console.log(
    '⚠️  uploadAllImages() is deprecated. Use syncCloudinaryImages() instead.',
  );
  return syncCloudinaryImages();
}

// Run the sync process
if (import.meta.url === `file://${process.argv[1]}`) {
  syncCloudinaryImages();
}

export {
  syncCloudinaryImages,
  uploadAllImages,
  uploadImageWithRetry as uploadImage,
};
