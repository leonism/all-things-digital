import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/data/posts');
const outputFile = path.join(process.cwd(), 'src/blog-data.json');

function generateBlogData() {
  // Get all markdown files from posts directory
  const filenames = fs.readdirSync(postsDirectory).filter(name => name.endsWith('.md'));

  const posts = filenames.map(filename => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Generate slug from filename
    const slug = filename.replace(/\.md$/, '');

    return {
      slug,
      title: data.title,
      subtitle: data.subtitle || '',
      date: data.date,
      featuredImage: data.featuredImage || null,
      category: data.category,
      tags: data.tags || [],
      author: data.author || {
        name: 'DGPond',
        image: '/assets/img/avatar.png',
        link: '/about'
      },
      excerpt: data.excerpt || '',
      description: data.description || '',
      content: content,
      published: data.published !== false
    };
  });

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filter only published posts
  const publishedPosts = posts.filter(post => post.published);

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(publishedPosts, null, 2));
  console.log(`Generated blog data with ${publishedPosts.length} posts`);
}

generateBlogData();
