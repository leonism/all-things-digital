import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

/**
 * Blog Data Generation Script
 * 
 * This script is a critical part of the blog's build process that transforms markdown files
 * into a structured JSON dataset for the Vue.js blog application. It handles both content
 * metadata extraction and Cloudinary image URL processing for optimized image delivery.
 * 
 * CURRENT FLOW LOGIC:
 * 
 * 1. INITIALIZATION PHASE:
 *    - Sets up ES Module path resolution (__dirname equivalent)
 *    - Defines input directory (src/data/posts) and output file (src/blog-data.json)
 *    - Loads Cloudinary mapping data from src/data/cloudinary-mapping.json
 *    - Gracefully handles missing Cloudinary mapping file with warnings
 * 
 * 2. CLOUDINARY INTEGRATION:
 *    - Loads pre-generated Cloudinary mapping that contains public ID to URL mappings
 *    - Provides utility functions to convert Cloudinary public IDs to full URLs
 *    - Recursively processes all object properties to find and convert image references
 *    - Supports both direct public ID matching and filename-based fallback matching
 *    - Maintains backward compatibility with non-Cloudinary image URLs
 * 
 * 3. MARKDOWN PROCESSING PHASE:
 *    - Scans the posts directory for all .md files
 *    - For each markdown file:
 *      a) Extracts slug from filename (removes .md extension)
 *      b) Reads file content using fs.readFileSync
 *      c) Parses frontmatter (YAML metadata) using gray-matter library
 *      d) Processes all frontmatter data through Cloudinary URL conversion
 *      e) Combines slug with processed frontmatter into post object
 *      f) Normalizes date format to ISO string for consistency
 * 
 * 4. DATA PROCESSING:
 *    - Collects all post objects into an array
 *    - Sorts posts by date in descending order (newest first)
 *    - Handles missing or invalid dates gracefully in sort comparison
 * 
 * 5. OUTPUT GENERATION:
 *    - Writes processed data to src/blog-data.json as pretty-printed JSON
 *    - Used by Vue components for:
 *      * Blog post listings and pagination
 *      * Individual post metadata display
 *      * SEO meta tags and structured data
 *      * RSS feed generation
 * 
 * 6. ERROR HANDLING:
 *    - Comprehensive error handling for file operations
 *    - Graceful degradation when Cloudinary mapping is unavailable
 *    - Process exit with error codes for build pipeline integration
 * 
 * INTEGRATION WITH BUILD PROCESS:
 * - Runs during build time to generate static data
 * - Enables static site generation with dynamic content
 * - Separates content processing from runtime rendering
 * - Supports incremental builds by processing only changed files
 * 
 * CLOUDINARY WORKFLOW:
 * - Expects images to be uploaded via upload-to-cloudinary.js script
 * - Converts public IDs like 'all-things-digital/featured-blog' to full URLs
 * - Maintains mapping file for efficient URL resolution
 * - Supports both exact public ID matches and filename-based fallbacks
 * 
 * The generated JSON file serves as the single source of truth for blog metadata,
 * enabling fast page loads and efficient content management in the Vue.js application.
 */

// ES Module equivalent of __dirname for resolving paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // Corrected path resolution

// Define the directory containing markdown posts and the output JSON file path
const postsDir = path.resolve(__dirname, '../src/data/posts');
const outputDataFile = path.resolve(__dirname, '../src/blog-data.json');
const cloudinaryMappingFile = path.resolve(__dirname, '../src/data/cloudinary-mapping.json');

// Load Cloudinary mapping data
let cloudinaryMapping = {};
try {
  const mappingData = fs.readFileSync(cloudinaryMappingFile, 'utf8');
  cloudinaryMapping = JSON.parse(mappingData);
} catch (error) {
  console.warn('Warning: Could not load Cloudinary mapping file:', error.message);
}

/**
 * Converts a Cloudinary public ID to a full URL using the mapping file
 * @param {string} publicId - The Cloudinary public ID (e.g., 'all-things-digital/avatar')
 * @returns {string} - The full Cloudinary URL or the original value if not found
 */
function getCloudinaryUrl(publicId) {
  if (!publicId || typeof publicId !== 'string') {
    return publicId;
  }

  // Try to find the mapping by public ID
  for (const [key, value] of Object.entries(cloudinaryMapping)) {
    if (value.publicId === publicId) {
      return value.secureUrl;
    }
  }

  // If not found, try to find by key (filename)
  const filename = publicId.split('/').pop();
  for (const [key, value] of Object.entries(cloudinaryMapping)) {
    if (key.includes(filename) || value.publicId.endsWith(filename)) {
      return value.secureUrl;
    }
  }

  // If still not found, return the original value
  console.warn(`Warning: No Cloudinary mapping found for: ${publicId}`);
  return publicId;
}

/**
 * Recursively processes an object to convert Cloudinary public IDs to full URLs
 * @param {any} obj - The object to process
 * @returns {any} - The processed object with converted URLs
 */
function processCloudinaryUrls(obj) {
  if (typeof obj === 'string') {
    // Check if this looks like a Cloudinary public ID
    if (obj.startsWith('all-things-digital/') || obj === 'all-things-digital/avatar') {
      return getCloudinaryUrl(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(processCloudinaryUrls);
  }

  if (obj && typeof obj === 'object') {
    const processed = {};
    for (const [key, value] of Object.entries(obj)) {
      // Process image-related fields
      if (key === 'src' || key === 'image' || key.toLowerCase().includes('image')) {
        processed[key] = processCloudinaryUrls(value);
      } else {
        processed[key] = processCloudinaryUrls(value);
      }
    }
    return processed;
  }

  return obj;
}

/**
 * Reads, parses, and processes all markdown post files.
 * @returns {Array<{ slug: string; date?: string | Date; [key: string]: any }>} An array of post data objects, sorted by date.
 */
function getPostsData() {
  // Read all filenames in the posts directory
  const fileNames = fs.readdirSync(postsDir);

  /**
   * Process each markdown file to extract data.
   * @type {Array<{ slug: string; date?: string | Date; [key: string]: any }>}
   */
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md')) // Only process markdown files
    .map((fileName) => {
      // Remove ".md" from file name to get the slug (unique identifier for the post)
      const slug = fileName.replace(/\.md$/, '');

      // Read the full markdown file content as a string
      const fullPath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata (frontmatter)
      const matterResult = matter(fileContents);

      // Combine the extracted data with the slug
      /**
       * @type {{ slug: string; date?: string | Date; [key: string]: any }}
       */
      const postData = {
        slug,
        ...processCloudinaryUrls(matterResult.data), // Include all frontmatter data with processed Cloudinary URLs
      };

      // Ensure the date is serialized correctly if it's a Date object
      // This is important for consistent JSON output
      if (postData.date && postData.date instanceof Date) {
        postData.date = postData.date.toISOString(); // Convert Date object to ISO string
      }

      return postData;
    });

  // Sort posts by date in descending order (newest posts first)
  /**
   * Comparator function for sorting post data by date.
   * @param {{ date?: string | Date }} a
   * @param {{ date?: string | Date }} b
   */
  allPostsData.sort((a, b) => {
    // Convert dates to Date objects for comparison, handling potential missing or invalid dates
    const dateA =
      typeof a.date === 'string' || a.date instanceof Date
        ? new Date(a.date)
        : null;
    const dateB =
      typeof b.date === 'string' || b.date instanceof Date
        ? new Date(b.date)
        : null;

    // Handle cases where one or both dates are missing or invalid
    if (!dateA && !dateB) return 0; // Both missing, maintain original order
    if (!dateA) return 1; // a is missing, b comes first
    if (!dateB) return -1; // b is missing, a comes first

    // Compare valid dates (newest first)
    return dateB.getTime() - dateA.getTime();
  });

  return allPostsData;
}

/**
 * Generates the blog data JSON file.
 */
function generateBlogData() {
  try {
    // Get the processed post data
    const postsData = getPostsData();

    // Write the post data to the output JSON file
    // JSON.stringify with null and 2 provides pretty-printing
    fs.writeFileSync(outputDataFile, JSON.stringify(postsData, null, 2));

    console.log(`✅ Successfully generated blog data to ${outputDataFile}`);
  } catch (error) {
    console.error('Error generating blog data:', error);
    // Exit the process with a non-zero code to indicate failure
    process.exit(1);
  }
}

// Execute the main function to generate the blog data
generateBlogData();
