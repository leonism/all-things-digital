import { Feed } from "feed";
import fs from "fs";
import path from "path";

// --- Configuration (User should update these) ---
const YOUR_DOMAIN = "https://yourdomain.com"; // <<<--- IMPORTANT: Replace with your actual domain
const YOUR_NAME = "Your Name"; // <<<--- IMPORTANT: Replace with your name
const YOUR_EMAIL = "your.email@example.com"; // <<<--- IMPORTANT: Replace with your email
const SITE_TITLE = "All Things Digital Blog"; // <<<--- Optional: Update site title
const SITE_DESCRIPTION = "Latest articles and insights from All Things Digital"; // <<<--- Optional: Update site description
// -------------------------------------------------

// Function to read and parse JSON data
const readJsonData = (filePath) => {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`❌ Error reading or parsing JSON file at ${filePath}:`, error);
    process.exit(1);
  }
};

const generateRssFeed = () => {
  // Read blog data using fs
  const postsData = readJsonData("src/data/blog-data.json");

  const publicDir = path.join(process.cwd(), "public");
  const feedPath = path.join(publicDir, "rss.xml");

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const feed = new Feed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    id: YOUR_DOMAIN,
    link: YOUR_DOMAIN,
    language: "en", // Optional: update language
    image: `${YOUR_DOMAIN}/images/default-og-image.png`, // Optional: update default image path
    favicon: `${YOUR_DOMAIN}/favicon.ico`, // Optional: update favicon path
    copyright: `All rights reserved ${new Date().getFullYear()}, ${YOUR_NAME}`,
    updated: new Date(), // Use the latest post date ideally
    generator: "Manus AI Feed Generator",
    feedLinks: {
      rss2: `${YOUR_DOMAIN}/rss.xml`,
    },
    author: {
      name: YOUR_NAME,
      email: YOUR_EMAIL,
      link: YOUR_DOMAIN,
    },
  });

  // Filter and sort posts (newest first)
  const publishedPosts = postsData
    .filter(post => !post.status || post.status === "published")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  publishedPosts.forEach((post) => {
    const postUrl = `${YOUR_DOMAIN}/blog/${post.slug}`;
    // Ensure image URLs are absolute if they are relative
    let imageUrl = post.featuredImage?.src;
    if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${YOUR_DOMAIN}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }

    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description: post.excerpt || post.description,
      content: post.contentHtml, // Use the generated HTML content
      author: [
        {
          name: post.author?.name || YOUR_NAME,
          email: post.author?.email || YOUR_EMAIL,
          link: post.author?.link || YOUR_DOMAIN,
        },
      ],
      date: new Date(post.date),
      image: imageUrl,
      category: post.categories?.map(cat => ({ name: cat })) || [],
    });
  });

  // Generate RSS 2.0 feed
  const rssContent = feed.rss2();
  fs.writeFileSync(feedPath, rssContent);

  console.log(`✅ RSS feed generated successfully at ${feedPath}`);

};

try {
  generateRssFeed();
} catch (error) {
  console.error("❌ Error generating RSS feed:", error);
  process.exit(1);
}
