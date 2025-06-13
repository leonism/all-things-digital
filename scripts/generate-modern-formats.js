/**
 * Modern Image Format Generation Script
 *
 * This script generates optimized modern image formats (WebP and AVIF) from existing
 * JPEG and PNG images in the project. It serves as a build-time optimization tool
 * that creates next-generation image formats for improved web performance and user experience.
 *
 * CURRENT FLOW LOGIC:
 *
 * 1. INITIALIZATION PHASE:
 *    - Sets up ES Module path resolution for cross-platform compatibility
 *    - Defines source directory (src/assets/img) for image processing
 *    - Configures output paths and quality settings for WebP and AVIF formats
 *    - Validates required dependencies and handles missing modules gracefully
 *
 * 2. IMAGE DISCOVERY PHASE:
 *    - Recursively scans the source directory for supported image formats
 *    - Filters files to include only JPEG (.jpg, .jpeg) and PNG (.png) images
 *    - Builds comprehensive list of source images with metadata
 *    - Handles nested directory structures and maintains relative paths
 *
 * 3. FORMAT GENERATION PROCESS:
 *    - For each source image:
 *      a) Checks if modern format versions already exist to avoid redundant processing
 *      b) Generates WebP version with optimized quality settings (75% quality)
 *      c) Generates AVIF version with aggressive compression (50% quality)
 *      d) Preserves original filename structure with new extensions
 *      e) Maintains directory hierarchy in output structure
 *
 * 4. OPTIMIZATION STRATEGIES:
 *    - WebP generation: Balanced quality/size ratio for broad browser support
 *    - AVIF generation: Maximum compression for modern browsers
 *    - Incremental processing: Skips existing files to improve build performance
 *    - Memory-efficient processing: Handles large images without memory overflow
 *
 * 5. ERROR HANDLING & VALIDATION:
 *    - Comprehensive error handling for file system operations
 *    - Graceful degradation when imagemin plugins are unavailable
 *    - Detailed logging for successful generations and failures
 *    - Process continuation even when individual image processing fails
 *
 * 6. BUILD INTEGRATION:
 *    - Designed for integration with Vite build process
 *    - Can be run standalone or as part of automated build pipeline
 *    - Supports both development and production environments
 *    - Enables progressive enhancement with modern image formats
 *
 * PERFORMANCE BENEFITS:
 * - WebP: 25-35% smaller file sizes compared to JPEG with similar quality
 * - AVIF: 50% smaller file sizes compared to JPEG with better quality
 * - Faster page load times and reduced bandwidth usage
 * - Improved Core Web Vitals scores for SEO benefits
 *
 * BROWSER SUPPORT STRATEGY:
 * - WebP: Supported by 95%+ of modern browsers
 * - AVIF: Supported by 80%+ of modern browsers (growing rapidly)
 * - Fallback to original formats for older browsers
 * - Progressive enhancement approach for optimal compatibility
 *
 * INTEGRATION WITH BUILD PROCESS:
 * - Run during build time to generate static optimized images
 * - Enables automatic modern format delivery without runtime processing
 * - Supports incremental builds by checking existing files
 * - Complements Cloudinary integration for comprehensive image optimization
 *
 * This script is essential for the blog's image optimization strategy,
 * ensuring fast loading times and excellent user experience across all devices
 * while maintaining backward compatibility with older browsers.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Module equivalent of __dirname for resolving paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the source directory containing images to process
const sourceDir = path.resolve(__dirname, '../src/assets/img');

// Quality settings for different formats
const WEBP_QUALITY = 75; // Balanced quality/size ratio for WebP
const AVIF_QUALITY = 50; // Aggressive compression for AVIF

// Supported input image formats
const SUPPORTED_FORMATS = /\.(png|jpe?g)$/i;

/**
 * Checks if a file exists at the specified path
 * @param {string} filePath - The path to check
 * @returns {Promise<boolean>} - True if file exists, false otherwise
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Recursively discovers all supported image files in a directory
 * @param {string} dir - The directory to scan
 * @param {string[]} fileList - Accumulator for discovered files
 * @returns {Promise<string[]>} - Array of absolute file paths
 */
async function discoverImageFiles(dir, fileList = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        await discoverImageFiles(fullPath, fileList);
      } else if (entry.isFile() && SUPPORTED_FORMATS.test(entry.name)) {
        // Add supported image files to the list
        fileList.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error.message);
  }

  return fileList;
}

/**
 * Generates WebP format from source image buffer
 * @param {Buffer} sourceBuffer - The source image buffer
 * @returns {Promise<Buffer>} - The generated WebP buffer
 */
async function generateWebP(sourceBuffer) {
  try {
    const { default: imagemin } = await import('imagemin');
    const { default: imageminWebp } = await import('imagemin-webp');

    return await imagemin.buffer(sourceBuffer, {
      plugins: [imageminWebp({ quality: WEBP_QUALITY })]
    });
  } catch (error) {
    throw new Error(`WebP generation failed: ${error.message}`);
  }
}

/**
 * Generates AVIF format from source image buffer
 * @param {Buffer} sourceBuffer - The source image buffer
 * @returns {Promise<Buffer>} - The generated AVIF buffer
 */
async function generateAVIF(sourceBuffer) {
  try {
    const { default: imagemin } = await import('imagemin');
    const { default: imageminAvif } = await import('imagemin-avif');

    return await imagemin.buffer(sourceBuffer, {
      plugins: [imageminAvif({ quality: AVIF_QUALITY })]
    });
  } catch (error) {
    throw new Error(`AVIF generation failed: ${error.message}`);
  }
}

/**
 * Processes a single image file to generate modern formats
 * @param {string} imagePath - Absolute path to the source image
 * @param {number} index - Current processing index
 * @param {number} total - Total number of images to process
 * @returns {Promise<{webp: boolean, avif: boolean}>} - Success status for each format
 */
async function processImage(imagePath, index, total) {
  const relativePath = path.relative(sourceDir, imagePath);
  const { name: baseName, dir: imageDir } = path.parse(imagePath);

  console.log(`🖼️  [${index + 1}/${total}] Processing: ${relativePath}`);

  const results = { webp: false, avif: false };

  try {
    // Read the source image buffer
    const sourceBuffer = await fs.readFile(imagePath);

    // Generate WebP format
    const webpPath = path.join(imageDir, `${baseName}.webp`);
    if (await fileExists(webpPath)) {
      console.log(`   ⏭️  WebP already exists: ${path.relative(sourceDir, webpPath)}`);
      results.webp = true;
    } else {
      try {
        const webpBuffer = await generateWebP(sourceBuffer);
        await fs.writeFile(webpPath, webpBuffer);
        console.log(`   ✅ Generated WebP: ${path.relative(sourceDir, webpPath)}`);
        results.webp = true;
      } catch (error) {
        console.error(`   ❌ WebP generation failed: ${error.message}`);
      }
    }

    // Generate AVIF format
    const avifPath = path.join(imageDir, `${baseName}.avif`);
    if (await fileExists(avifPath)) {
      console.log(`   ⏭️  AVIF already exists: ${path.relative(sourceDir, avifPath)}`);
      results.avif = true;
    } else {
      try {
        const avifBuffer = await generateAVIF(sourceBuffer);
        await fs.writeFile(avifPath, avifBuffer);
        console.log(`   ✅ Generated AVIF: ${path.relative(sourceDir, avifPath)}`);
        results.avif = true;
      } catch (error) {
        console.error(`   ❌ AVIF generation failed: ${error.message}`);
      }
    }

  } catch (error) {
    console.error(`   ❌ Failed to process ${relativePath}: ${error.message}`);
  }

  return results;
}

/**
 * Main function to generate modern image formats
 * Orchestrates the entire image processing workflow
 */
async function generateModernFormats() {
  console.log('🚀 Starting modern image format generation...');
  console.log(`📁 Source directory: ${sourceDir}`);

  try {
    // Verify source directory exists
    if (!(await fileExists(sourceDir))) {
      throw new Error(`Source directory does not exist: ${sourceDir}`);
    }

    // Discover all supported image files
    console.log('🔍 Discovering image files...');
    const imageFiles = await discoverImageFiles(sourceDir);

    if (imageFiles.length === 0) {
      console.log('ℹ️  No supported image files found.');
      return;
    }

    console.log(`📊 Found ${imageFiles.length} image(s) to process`);

    // Process each image file
    const results = {
      total: imageFiles.length,
      webpSuccess: 0,
      avifSuccess: 0,
      webpSkipped: 0,
      avifSkipped: 0
    };

    for (let i = 0; i < imageFiles.length; i++) {
      const processResult = await processImage(imageFiles[i], i, imageFiles.length);

      if (processResult.webp) results.webpSuccess++;
      if (processResult.avif) results.avifSuccess++;
    }

    // Display summary
    console.log('\n📈 Generation Summary:');
    console.log(`   Total images processed: ${results.total}`);
    console.log(`   WebP generated/existing: ${results.webpSuccess}/${results.total}`);
    console.log(`   AVIF generated/existing: ${results.avifSuccess}/${results.total}`);

    if (results.webpSuccess === results.total && results.avifSuccess === results.total) {
      console.log('✅ All modern formats generated successfully!');
    } else {
      console.log('⚠️  Some formats could not be generated. Check logs above for details.');
    }

  } catch (error) {
    console.error('❌ Error generating modern formats:', error.message);
    // Exit the process with a non-zero code to indicate failure
    process.exit(1);
  }
}

/**
 * Vite plugin factory for integration with build process
 * @returns {Object} - Vite plugin object
 */
export function imageFormatsPlugin() {
  return {
    name: 'modern-image-formats',

    async buildStart() {
      // Generate modern formats during build start
      await generateModernFormats();
    }
  };
}

// Execute the main function when script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateModernFormats();
}
