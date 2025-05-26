import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

// --- Configuration (User should update these) ---
const YOUR_DOMAIN = "https://yourdomain.com"; // <<<--- IMPORTANT: Replace with your actual domain
const SITE_TITLE = "All Things Digital Blog"; // <<<--- Optional: Update site title
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

const generateSitemap = async () => {
  // Read blog data
  const postsData = readJsonData("src/blog-data.json");

  const publicDir = path.join(process.cwd(), "public");
  const sitemapPath = path.join(publicDir, "sitemap.xml");

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Define static routes (add more as needed)
  const staticLinks = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/blog", changefreq: "daily", priority: 0.8 },
    { url: "/about", changefreq: "monthly", priority: 0.7 },
    { url: "/contact", changefreq: "monthly", priority: 0.7 },
    { url: "/credits", changefreq: "monthly", priority: 0.7 },
  ];

  // Generate links for blog posts
  const postLinks = postsData
    .filter(post => !post.status || post.status === "published")
    .map(post => ({
      url: `/blog/${post.slug}`,
      changefreq: "weekly", // Or based on update frequency
      priority: 0.9,
      lastmod: post.lastModified || post.date, // Use last modified date if available
      img: post.featuredImage ? [
          {
              url: `${YOUR_DOMAIN}${post.featuredImage.src.startsWith("/") ? "" : "/"}${post.featuredImage.src}`,
              caption: post.featuredImage.alt || post.title,
              title: post.title
          }
      ] : undefined
    }));

  // Generate links for categories
  const categories = [...new Set(postsData.flatMap(post => post.categories || []))];
  const categoryLinks = categories.map(category => ({
    url: `/blog/category/${encodeURIComponent(category)}`,
    changefreq: "weekly",
    priority: 0.7,
  }));

  // Generate links for tags
  const tags = [...new Set(postsData.flatMap(post => post.tags || []))];
  const tagLinks = tags.map(tag => ({
    url: `/blog/tag/${encodeURIComponent(tag)}`,
    changefreq: "weekly",
    priority: 0.6,
  }));

  // Combine all links
  const allLinks = [...staticLinks, ...postLinks, ...categoryLinks, ...tagLinks];

  // Create a stream to write to
  const stream = new SitemapStream({ hostname: YOUR_DOMAIN });

  // Pipe the links to the stream
  const sitemapContent = await streamToPromise(Readable.from(allLinks).pipe(stream)).then((data) =>
    data.toString()
  );

  // Write the sitemap file
  fs.writeFileSync(sitemapPath, sitemapContent);

  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
};

try {
  generateSitemap();
} catch (error) {
  console.error("❌ Error generating sitemap:", error);
  process.exit(1);
}
