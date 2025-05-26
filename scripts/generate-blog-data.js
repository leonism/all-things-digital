import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const postsDir = path.resolve(__dirname, '../src/content/posts');
const outputDataFile = path.resolve(__dirname, '../src/blog-data.json');
const md = new MarkdownIt();

function getPostsData() {
  const fileNames = fs.readdirSync(postsDir);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md')) // Only process markdown files
    .map(fileName => {
      // Remove ".md" from file name to get id (slug)
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Use markdown-it to convert markdown into HTML string
      const contentHtml = md.render(matterResult.content);
      console.log(`Generated HTML for ${slug}:`, contentHtml); // Add this line for debugging

      // Combine the data with the slug and contentHtml
      // Ensure date is serialized correctly if it's a Date object
      const postData = {
        slug,
        contentHtml,
        ...matterResult.data,
      };
      if (postData.date instanceof Date) {
        postData.date = postData.date.toISOString(); // Serialize date
      }

      return postData;
    });

  // Sort posts by date (descending - newest first)
  allPostsData.sort((a, b) => {
    if (!a.date || !b.date) return 0; // Handle cases where date might be missing
    return new Date(b.date) - new Date(a.date);
  });

  return allPostsData;
}

function generateBlogData() {
  try {
    const postsData = getPostsData();
    fs.writeFileSync(outputDataFile, JSON.stringify(postsData, null, 2));
    console.log(`Successfully generated blog data to ${outputDataFile}`);
  } catch (error) {
    console.error('Error generating blog data:', error);
    process.exit(1); // Exit with error code
  }
}

generateBlogData();
