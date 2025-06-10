import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

/**
 * This script reads all markdown files from the 'src/data/posts' directory,
 * extracts their frontmatter (metadata), and compiles all post data into a single JSON file.
 *
 * The generated JSON file ('src/blog-data.json') is used by the blog
 * components to display post listings and individual post metadata.
 * The actual Markdown content rendering is handled by `unplugin-vue-markdown`
 * directly in Vue components.
 *
 * The script performs the following steps:
 * 1. Reads all files in the posts directory.
 * 2. Filters for files ending with '.md'.
 * 3. For each markdown file:
 *    - Extracts the slug from the filename.
 *    - Reads the file content.
 *    - Parses the frontmatter (YAML header) using gray-matter.
 *    - Combines the slug and frontmatter data into a post object.
 *    - Ensures the date is correctly formatted (ISO string).
 * 4. Sorts the resulting array of post objects by date in descending order (newest first).
 * 5. Writes the sorted post data array to 'src/blog-data.json' as a pretty-printed JSON string.
 * 6. Includes basic error handling.
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
