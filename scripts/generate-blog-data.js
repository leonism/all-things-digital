import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * This script generates blog data (blog-data.json) for the website
 * by processing Markdown files from the posts directory.
 * It reads all Markdown files, extracts frontmatter and content,
 * and creates a structured JSON file for the blog system.
 *
 * The generated blog data is used by Vue components to display
 * blog posts, categories, tags, and other blog-related content.
 *
 * The script performs the following steps:
 * 1. Defines configuration variables for input and output paths.
 * 2. Reads all Markdown files from the posts directory.
 * 3. Processes each file to extract frontmatter and content using gray-matter.
 * 4. Generates slug from filename and structures post data.
 * 5. Applies default values for missing author information.
 * 6. Sorts posts by date (newest first).
 * 7. Filters only published posts.
 * 8. Writes the processed data to 'src/blog-data.json'.
 * 9. Includes comprehensive error handling and success messaging.
 *
 * IMPORTANT: Ensure the posts directory exists and contains valid
 * Markdown files with proper frontmatter before running this script.
 */

// --- Configuration (User should update these) ---
const POSTS_DIRECTORY = path.join(process.cwd(), 'src/data/posts'); // <<<--- Directory containing Markdown files
const OUTPUT_FILE = path.join(process.cwd(), 'src/blog-data.json'); // <<<--- Output JSON file path
const DEFAULT_AUTHOR = {
  name: 'DGPond',
  image: '/assets/img/avatar.png',
  link: '/about'
}; // <<<--- Default author information
// -------------------------------------------------

/**
 * Reads and validates a directory path.
 * @param {string} dirPath - The path to the directory.
 * @returns {string[]} Array of filenames in the directory.
 * @throws {Error} If the directory cannot be read or doesn't exist.
 */
const readDirectory = (dirPath) => {
  try {
    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Directory does not exist: ${dirPath}`);
    }

    // Read directory contents and filter for Markdown files
    const filenames = fs.readdirSync(dirPath).filter(name => name.endsWith('.md'));

    if (filenames.length === 0) {
      console.warn(`⚠️  No Markdown files found in ${dirPath}`);
    }

    return filenames;
  } catch (error) {
    console.error(
      `❌ Error reading directory at ${dirPath}:`,
      error.message,
    );
    // Exit the process with a non-zero code to indicate failure
    process.exit(1);
  }
};

/**
 * Processes a single Markdown file and extracts post data.
 * @param {string} filename - The name of the Markdown file.
 * @param {string} postsDir - The directory containing the posts.
 * @returns {Object} The processed post data.
 * @throws {Error} If the file cannot be read or processed.
 */
const processMarkdownFile = (filename, postsDir) => {
  try {
    // Construct full file path
    const filePath = path.join(postsDir, filename);

    // Read file contents
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter and content using gray-matter
    const { data, content } = matter(fileContents);

    // Generate slug from frontmatter if available, otherwise use filename (remove .md extension)
    const slug = data.slug || filename.replace(/\.md$/, '');



    // Structure the post data with proper defaults
    return {
      slug,
      title: data.title || 'Untitled Post', // Provide default title
      subtitle: data.subtitle || '',
      date: data.date || new Date().toISOString().split('T')[0], // Default to today's date
      featuredImage: data.featuredImage || null,
      category: data.category || 'Uncategorized', // Provide default category
      tags: data.tags || [],
      author: data.author || DEFAULT_AUTHOR, // Use default author if not specified
      excerpt: data.excerpt || '',
      description: data.description || '',
      content: content,
      status: data.status || (data.published !== false ? 'published' : 'draft') // Use status field consistently
    };
  } catch (error) {
    console.error(
      `❌ Error processing file ${filename}:`,
      error.message,
    );
    // Exit the process with a non-zero code to indicate failure
    process.exit(1);
  }
};

/**
 * Writes processed blog data to JSON file.
 * @param {string} outputPath - The path where the JSON file should be written.
 * @param {Array} data - The blog data to write.
 * @throws {Error} If the file cannot be written.
 */
const writeBlogData = (outputPath, data) => {
  try {
    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the JSON data with proper formatting
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(
      `❌ Error writing blog data to ${outputPath}:`,
      error.message,
    );
    // Exit the process with a non-zero code to indicate failure
    process.exit(1);
  }
};

/**
 * Generates the blog data JSON file from Markdown posts.
 */
const generateBlogData = () => {
  try {
    console.log('🚀 Starting blog data generation...');

    // Read all Markdown files from the posts directory
    const filenames = readDirectory(POSTS_DIRECTORY);

    if (filenames.length === 0) {
      console.log('📝 No posts to process. Blog data file will contain an empty array.');
      writeBlogData(OUTPUT_FILE, []);
      return;
    }

    console.log(`📖 Processing ${filenames.length} Markdown file(s)...`);

    // Process each Markdown file to extract post data
    const posts = filenames.map(filename =>
      processMarkdownFile(filename, POSTS_DIRECTORY)
    );

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Filter only published posts
    const publishedPosts = posts.filter(post => post.status === 'published');
    const draftPosts = posts.filter(post => post.status === 'draft');

    // Write the processed blog data to JSON file
    writeBlogData(OUTPUT_FILE, publishedPosts);

    // Log success message with statistics
    console.log(`✅ blog-data.json generated successfully at ${OUTPUT_FILE}`);
    console.log(`📊 Statistics:`);
    console.log(`   • Total posts processed: ${posts.length}`);
    console.log(`   • Published posts: ${publishedPosts.length}`);
    console.log(`   • Draft posts: ${draftPosts.length}`);

    if (draftPosts.length > 0) {
      console.log(`📝 Draft posts (not included in output):`);
      draftPosts.forEach(post => {
        console.log(`   • ${post.title} (${post.slug})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error during blog data generation:', error.message);
    // Exit the process with a non-zero code to indicate failure
    process.exit(1);
  }
};

// Execute the main function to generate blog data
try {
  generateBlogData();
} catch (error) {
  console.error('❌ Error generating blog data:', error.message);
  // Exit the process with a non-zero code to indicate failure
  process.exit(1);
}
