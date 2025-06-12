import { Feed } from 'feed';
import fs from 'fs';
import path from 'path';

/**
 * This script generates an RSS feed (rss.xml) for the blog posts.
 * It reads the processed blog data from 'src/blog-data.json',
 * creates a new RSS feed using the 'feed' library, and populates
 * it with data from each published blog post.
 *
 * The generated RSS feed allows users to subscribe to blog updates
 * using RSS readers.
 *
 * The script performs the following steps:
 * 1. Defines configuration variables for the site (domain, name, email, etc.).
 * 2. Reads the blog post data from 'src/blog-data.json'.
 * 3. Initializes a new Feed object with site-wide information.
 * 4. Filters and sorts the posts to include only published posts, newest first.
 * 5. Iterates through the sorted posts and adds each one as an item to the feed.
 *    - Extracts relevant data for each post (title, slug, date, content, etc.).
 *    - Ensures URLs (post link, image) are absolute.
 * 6. Generates the RSS 2.0 XML content.
 * 7. Writes the generated XML content to 'public/rss.xml'.
 * 8. Includes basic error handling.
 *
 * IMPORTANT: Remember to update the configuration variables at the top
 * with your actual site details before running this script.
 */

// --- Configuration (User should update these) ---
const YOUR_DOMAIN = 'https://all-things-digital.pages.dev'; // <<<--- IMPORTANT: Replace with your actual domain, and don't include the trailing slash
const YOUR_NAME = 'All Things Digital'; // <<<--- IMPORTANT: Replace with your name
const YOUR_EMAIL = 'me@allthingsdigital.com'; // <<<--- IMPORTANT: Replace with your email
const SITE_TITLE = 'All Things Digital Blog'; // <<<--- Optional: Update site title
const SITE_DESCRIPTION = 'Latest articles and insights from All Things Digital'; // <<<--- Optional: Update site description
// -------------------------------------------------

/**
 * Reads and parses JSON data from a given file path.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Array<any>} The parsed JSON data.
 * @throws {Error} If the file cannot be read or parsed.
 */
const readJsonData = (filePath) => {
  try {
    // Resolve the absolute path to the JSON file
    const absolutePath = path.resolve(process.cwd(), filePath);
    // Read the file content as a UTF-8 string
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    // Parse the JSON content
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(
      `❌ Error reading or parsing JSON file at ${filePath}:`,
      error,
    );
    // Exit the process with a non-zero code to indicate failure
    process.exit(1);
  }
};

/**
 * Generates the RSS feed XML file.
 */
const generateRssFeed = () => {
  // Read blog data from the generated JSON file
  const postsData = readJsonData('src/blog-data.json');

  // Define the output directory and file path for the RSS feed
  const distDir = path.join(process.cwd(), 'dist');
  const feedPath = path.join(distDir, 'rss.xml');

  // Create the dist directory if it doesn't exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Initialize a new Feed object with site details
  const feed = new Feed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    id: YOUR_DOMAIN,
    link: YOUR_DOMAIN,
    language: 'en', // Optional: update language
    image: `${YOUR_DOMAIN}/images/default-og-image.png`, // Optional: update default image path
    favicon: `${YOUR_DOMAIN}/favicon.ico`, // Optional: update favicon path
    copyright: `All rights reserved ${new Date().getFullYear()}, ${YOUR_NAME}`,
    updated: new Date(), // Use the latest post date ideally
    generator: 'Javascript - RSS Generator ', // Identifier for the generator
    feedLinks: {
      rss2: `${YOUR_DOMAIN}/rss.xml`, // Link to the RSS feed itself
    },
    author: {
      name: YOUR_NAME,
      email: YOUR_EMAIL,
      link: YOUR_DOMAIN,
    },
  });

  // Filter and sort posts: include only published posts and sort by date (newest first)
  const publishedPosts = postsData
    .filter((post) => !post.status || post.status === 'published') // Filter for published posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending

  // Add each published post as an item to the feed
  publishedPosts.forEach((post) => {
    // Construct the absolute URL for the post
    const postUrl = `${YOUR_DOMAIN}/blog/${post.slug}`;

    // Ensure image URLs are absolute if they are relative and properly escape XML entities
    let imageUrl = post.featuredImage?.src;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${YOUR_DOMAIN}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    // Escape XML entities in image URLs (especially ampersands)
    if (imageUrl) {
      imageUrl = imageUrl.replace(/&/g, '&amp;');
    }

    feed.addItem({
      title: post.title,
      id: postUrl, // Unique identifier for the post
      link: postUrl, // Link to the full post
      description: post.excerpt || post.description, // Use excerpt or description for summary
      content: post.contentHtml, // Use the generated HTML content for the full article
      author: [
        {
          name: post.author?.name || YOUR_NAME,
          email: post.author?.email || YOUR_EMAIL,
          link: post.author?.link || YOUR_DOMAIN,
        },
      ],
      date: new Date(post.date), // Publication date of the post
      image: imageUrl, // Featured image for the post
      category: post.categories?.map((cat) => ({ name: cat })) || [], // Categories as feed categories
    });
  });

  // Generate the RSS 2.0 feed XML content
  const rssContent = feed.rss2();
  // Write the generated XML content to the output file
  fs.writeFileSync(feedPath, rssContent);

  console.log(`✅ RSS feed generated successfully at ${feedPath}`);
};

// Execute the main function to generate the RSS feed
try {
  generateRssFeed();
} catch (error) {
  console.error('❌ Error generating RSS feed:', error);
  // Exit the process with a non-zero code to indicate failure
  process.exit(1);
}
