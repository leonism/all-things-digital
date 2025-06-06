import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'; // Import highlight.js

/**
 * This script reads all markdown files from the 'src/data/posts' directory,
 * extracts their frontmatter (metadata) and content, converts the markdown
 * content to HTML with syntax highlighting, and compiles all post data into a single JSON file.
 *
 * The generated JSON file ('src/blog-data.json') is used by the blog
 * components to display post listings and individual post content.
 *
 * The script performs the following steps:
 * 1. Reads all files in the posts directory.
 * 2. Filters for files ending with '.md'.
 * 3. For each markdown file:
 *    - Extracts the slug from the filename.
 *    - Reads the file content.
 *    - Parses the frontmatter (YAML header) using gray-matter.
 *    - Converts the markdown content (after frontmatter) to HTML using markdown-it,
 *      applying syntax highlighting with highlight.js.
 *    - Combines the slug, HTML content, and frontmatter data into a post object.
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

// Initialize MarkdownIt with options for syntax highlighting
const md = new MarkdownIt({
  html: true, // Enable HTML tags in source
  xhtmlOut: false, // Use '/' to close single tags (<br/>).
  breaks: false, // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be useful for external highlighters.
  linkify: true, // Autoconvert URL-like text to links

  // Enable syntax highlighting and configure highlight.js
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default highlighter or do nothing
  },
});

/**
 * Reads, parses, and processes all markdown post files.
 * @returns {Array<{ slug: string; contentHtml: string; date?: string | Date; [key: string]: any }>} An array of post data objects, sorted by date.
 */
function getPostsData() {
  // Read all filenames in the posts directory
  const fileNames = fs.readdirSync(postsDir);

  /**
   * Process each markdown file to extract data.
   * @type {Array<{ slug: string; contentHtml: string; date?: string | Date; [key: string]: any }>}
   */
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md')) // Only process markdown files
    .map((fileName) => {
      // Remove ".md" from file name to get the slug (unique identifier for the post)
      const slug = fileName.replace(/\.md$/, '');

      // Read the full markdown file content as a string
      const fullPath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata (frontmatter) and content
      const matterResult = matter(fileContents);

      // Use markdown-it to convert the markdown content (after frontmatter) into an HTML string
      // Syntax highlighting is applied here via the 'highlight' option configured above
      const contentHtml = md.render(matterResult.content);

      // Combine the extracted data with the slug and generated contentHtml
      /**
       * @type {{ slug: string; contentHtml: string; date?: string | Date; [key: string]: any }}
       */
      const postData = {
        slug,
        contentHtml,
        ...matterResult.data, // Include all frontmatter data (title, date, etc.)
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
