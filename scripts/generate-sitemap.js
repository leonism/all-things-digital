import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

/**
 * This script generates a sitemap (sitemap.xml) for the website,
 * including static pages, blog posts, categories, and tags.
 * It reads the processed blog data from 'src/blog-data.json'
 * to dynamically generate links for blog-related content.
 *
 * The generated sitemap helps search engines crawl and index the
 * website's pages more effectively.
 *
 * The script performs the following steps:
 * 1. Defines configuration variables for the site (domain, title).
 * 2. Reads the blog post data from 'src/blog-data.json'.
 * 3. Defines an array of static links (e.g., home, about, contact).
 * 4. Generates dynamic links for published blog posts, including
 *    last modification date and featured image information.
 * 5. Extracts unique categories and tags from the blog data and
 *    generates links for category and tag archive pages.
 * 6. Combines all static and dynamic links into a single array.
 * 7. Creates a readable stream from the array of links.
 * 8. Pipes the stream through a SitemapStream to generate the XML content.
 * 9. Writes the generated XML content to 'public/sitemap.xml'.
 * 10. Includes basic error handling.
 *
 * IMPORTANT: Remember to update the configuration variables at the top
 * with your actual site details and add/modify static links as needed.
 */

// --- Configuration (User should update these) ---
const YOUR_DOMAIN = "https://yourdomain.com"; // <<<--- IMPORTANT: Replace with your actual domain
const SITE_TITLE = "All Things Digital Blog"; // <<<--- Optional: Update site title
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
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    // Parse the JSON content
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`❌ Error reading or parsing JSON file at ${filePath}:`, error);
    // Exit the process with a non-zero code to indicate failure
    process.exit(1);
  }
};

/**
 * Generates the sitemap XML file.
 */
const generateSitemap = async () => {
  // Read blog data from the generated JSON file
  const postsData = readJsonData("src/blog-data.json");

  // Define the output directory and file path for the sitemap
  const publicDir = path.join(process.cwd(), "public");
  const sitemapPath = path.join(publicDir, "sitemap.xml");

  // Create the public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Define static routes for the sitemap (add more as needed)
  const staticLinks = [
    { url: "/", changefreq: "daily", priority: 1.0 }, // Homepage
    { url: "/blog", changefreq: "daily", priority: 0.8 }, // Blog index page
    { url: "/about", changefreq: "monthly", priority: 0.7 }, // About page
    { url: "/contact", changefreq: "monthly", priority: 0.7 }, // Contact page
    { url: "/credits", changefreq: "monthly", priority: 0.7 }, // Credits page
  ];

  // Generate dynamic links for published blog posts
  const postLinks = postsData
    .filter(post => !post.status || post.status === "published") // Include only published posts
    .map(post => ({
      url: `/blog/${post.slug}`, // URL for the individual blog post
      changefreq: "weekly", // Suggestion for how frequently the page changes
      priority: 0.9, // Priority relative to other URLs on the site
      lastmod: post.lastModified || post.date, // Last modification date (or publication date)
      img: post.featuredImage ? [ // Include featured image information for sitemap
          {
              url: `${YOUR_DOMAIN}${post.featuredImage.src.startsWith("/") ? "" : "/"}${post.featuredImage.src}`, // Absolute URL of the image
              caption: post.featuredImage.alt || post.title, // Image caption (alt text or title)
              title: post.title // Image title
          }
      ] : undefined // No image information if no featured image
    }));

  // Extract unique categories and generate links for category archive pages
  const categories = [...new Set(postsData.flatMap(post => post.categories || []))];
  const categoryLinks = categories.map(category => ({
    url: `/blog/category/${encodeURIComponent(category)}`, // URL for the category archive page
    changefreq: "weekly",
    priority: 0.7,
  }));

  // Extract unique tags and generate links for tag archive pages
  const tags = [...new Set(postsData.flatMap(post => post.tags || []))];
  const tagLinks = tags.map(tag => ({
    url: `/blog/tag/${encodeURIComponent(tag)}`, // URL for the tag archive page
    changefreq: "weekly",
    priority: 0.6,
  }));

  // Combine all static and dynamic links
  const allLinks = [...staticLinks, ...postLinks, ...categoryLinks, ...tagLinks];

  // Create a readable stream from the array of links
  const readableStream = Readable.from(allLinks);

  // Create a SitemapStream instance with the site's hostname
  const sitemapStream = new SitemapStream({ hostname: YOUR_DOMAIN });

  // Pipe the readable stream through the sitemap stream and convert to a promise
  const sitemapContent = await streamToPromise(readableStream.pipe(sitemapStream)).then((data) =>
    data.toString() // Convert the resulting buffer to a string
  );

  // Write the generated sitemap XML content to the output file
  fs.writeFileSync(sitemapPath, sitemapContent);

  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
};

// Execute the main function to generate the sitemap
try {
  generateSitemap();
} catch (error) {
  console.error("❌ Error generating sitemap:", error);
  // Exit the process with a non-zero code to indicate failure
  process.exit(1);
}
