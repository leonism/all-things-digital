/**
 * Build Hooks for Frontmatter Processing
 * 
 * This script provides build-time hooks to automatically process
 * frontmatter and integrate with the site generation process.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import matter from 'gray-matter';
import { 
  processMarkdownDirectory, 
  validateFrontmatter,
  generateSlug,
  calculateReadingTime 
} from './process-frontmatter.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Pre-build hook to process all markdown files
 */
function preBuildHook() {
  console.log('🚀 Running pre-build frontmatter processing...');
  
  const postsDir = path.join(__dirname, '../src/data/posts');
  const pagesDir = path.join(__dirname, '../src/data/pages');
  
  // Process blog posts
  if (fs.existsSync(postsDir)) {
    console.log('\n📝 Processing blog posts...');
    processMarkdownDirectory(postsDir, { updateLastModified: true });
  }
  
  // Process pages
  if (fs.existsSync(pagesDir)) {
    console.log('\n📄 Processing pages...');
    processMarkdownDirectory(pagesDir, { updateLastModified: true });
  }
  
  console.log('\n✅ Pre-build processing complete!');
}

/**
 * Generate authors data from markdown files
 */
function generateAuthorsData() {
  const authorsDir = path.join(__dirname, '../src/data/authors');
  const outputFile = path.join(__dirname, '../src/data/authors.json');
  
  if (!fs.existsSync(authorsDir)) {
    console.log('⚠️  Authors directory not found, skipping authors data generation');
    return;
  }
  
  const authors = [];
  const authorFiles = fs.readdirSync(authorsDir)
    .filter(file => file.endsWith('.md'));
  
  authorFiles.forEach(file => {
    try {
      const filePath = path.join(authorsDir, file);

      const { data: frontmatter } = matter(fs.readFileSync(filePath, 'utf8'));
      
      authors.push({
        slug: frontmatter.slug || generateSlug(frontmatter.name),
        name: frontmatter.name,
        role: frontmatter.role,
        email: frontmatter.email,
        bio: frontmatter.bio,
        avatar: frontmatter.avatar,
        social: frontmatter.social || {},
        featured: frontmatter.featured || false
      });
    } catch (error) {
      console.error(`❌ Error processing author file ${file}:`, error.message);
    }
  });
  
  // Write authors data
  fs.writeFileSync(outputFile, JSON.stringify(authors, null, 2));
  console.log(`📝 Generated authors data: ${authors.length} authors`);
}

/**
 * Generate categories data from markdown files
 */
function generateCategoriesData() {
  const categoriesDir = path.join(__dirname, '../src/data/categories');
  const outputFile = path.join(__dirname, '../src/data/categories.json');
  
  if (!fs.existsSync(categoriesDir)) {
    console.log('⚠️  Categories directory not found, skipping categories data generation');
    return;
  }
  
  const categories = [];
  const categoryFiles = fs.readdirSync(categoriesDir)
    .filter(file => file.endsWith('.md'));
  
  categoryFiles.forEach(file => {
    try {
      const filePath = path.join(categoriesDir, file);

      const { data: frontmatter, content } = matter(fs.readFileSync(filePath, 'utf8'));
      
      categories.push({
        slug: frontmatter.slug || generateSlug(frontmatter.name),
        name: frontmatter.name,
        description: frontmatter.description || content.trim(),
        color: frontmatter.color,
        icon: frontmatter.icon,
        featured: frontmatter.featured || false,
        parent: frontmatter.parent || null
      });
    } catch (error) {
      console.error(`❌ Error processing category file ${file}:`, error.message);
    }
  });
  
  // Write categories data
  fs.writeFileSync(outputFile, JSON.stringify(categories, null, 2));
  console.log(`📂 Generated categories data: ${categories.length} categories`);
}

/**
 * Generate site navigation from markdown files
 */
function generateNavigationData() {
  const navDir = path.join(__dirname, '../src/data/navigation');
  const outputFile = path.join(__dirname, '../src/data/navigation.json');
  
  if (!fs.existsSync(navDir)) {
    console.log('⚠️  Navigation directory not found, skipping navigation data generation');
    return;
  }
  
  const navigation = {
    main: [],
    footer: []
  };
  
  const navFiles = fs.readdirSync(navDir)
    .filter(file => file.endsWith('.md'));
  
  navFiles.forEach(file => {
    try {
      const filePath = path.join(navDir, file);

      const { data: frontmatter } = matter(fs.readFileSync(filePath, 'utf8'));
      
      if (frontmatter.type === 'main') {
        navigation.main = frontmatter.items || [];
      } else if (frontmatter.type === 'footer') {
        navigation.footer = frontmatter.items || [];
      }
    } catch (error) {
      console.error(`❌ Error processing navigation file ${file}:`, error.message);
    }
  });
  
  // Write navigation data
  fs.writeFileSync(outputFile, JSON.stringify(navigation, null, 2));
  console.log(`🧭 Generated navigation data`);
}

/**
 * Generate blog statistics and metadata
 */
function generateBlogStats() {
  const postsDir = path.join(__dirname, '../src/data/posts');
  const outputFile = path.join(__dirname, '../src/data/blog-stats.json');
  
  if (!fs.existsSync(postsDir)) {
    console.log('⚠️  Posts directory not found, skipping blog stats generation');
    return;
  }
  
  const stats = {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    categories: new Set(),
    tags: new Set(),
    authors: new Set(),
    totalReadingTime: 0,
    lastUpdated: new Date().toISOString()
  };
  
  const postFiles = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'));
  
  postFiles.forEach(file => {
    try {
      const filePath = path.join(postsDir, file);

      const { data: frontmatter, content } = matter(fs.readFileSync(filePath, 'utf8'));
      
      stats.totalPosts++;
      
      if (frontmatter.status === 'published') {
        stats.publishedPosts++;
      } else {
        stats.draftPosts++;
      }
      
      // Collect categories
      if (frontmatter.categories) {
        frontmatter.categories.forEach(cat => stats.categories.add(cat));
      }
      
      // Collect tags
      if (frontmatter.tags) {
        frontmatter.tags.forEach(tag => stats.tags.add(tag));
      }
      
      // Collect authors
      if (frontmatter.author) {
        stats.authors.add(frontmatter.author);
      }
      if (frontmatter.coAuthors) {
        frontmatter.coAuthors.forEach(author => stats.authors.add(author));
      }
      
      // Calculate total reading time
      if (frontmatter.readingTime) {
        const minutes = parseInt(frontmatter.readingTime.match(/\d+/)?.[0] || '0');
        stats.totalReadingTime += minutes;
      } else {
        const readingTime = calculateReadingTime(content);
        const minutes = parseInt(readingTime.match(/\d+/)?.[0] || '0');
        stats.totalReadingTime += minutes;
      }
      
    } catch (error) {
      console.error(`❌ Error processing post file ${file}:`, error.message);
    }
  });
  
  // Convert Sets to Arrays
  const finalStats = {
    ...stats,
    categories: Array.from(stats.categories),
    tags: Array.from(stats.tags),
    authors: Array.from(stats.authors),
    averageReadingTime: Math.round(stats.totalReadingTime / stats.totalPosts) || 0
  };
  
  // Write blog stats
  fs.writeFileSync(outputFile, JSON.stringify(finalStats, null, 2));
  console.log(`📊 Generated blog stats: ${finalStats.totalPosts} total posts, ${finalStats.publishedPosts} published`);
}

/**
 * Generate sitemap data for SEO
 */
function generateSitemapData() {
  const outputFile = path.join(__dirname, '../src/data/sitemap.json');
  const baseUrl = 'https://all-things-digital.pages.dev';
  
  const sitemap = {
    urls: [],
    lastGenerated: new Date().toISOString()
  };
  
  // Add homepage
  sitemap.urls.push({
    url: baseUrl,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 1.0
  });
  
  // Add blog posts
  const postsDir = path.join(__dirname, '../src/data/posts');
  if (fs.existsSync(postsDir)) {
    const postFiles = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md'));
    
    postFiles.forEach(file => {
      try {
        const filePath = path.join(postsDir, file);
  
        const { data: frontmatter } = matter(fs.readFileSync(filePath, 'utf8'));
        
        if (frontmatter.status === 'published' && frontmatter.slug) {
          const priority = frontmatter.priority === 'high' ? 0.9 : 
                          frontmatter.priority === 'medium' ? 0.7 : 0.5;
          
          sitemap.urls.push({
            url: `${baseUrl}/blog/${frontmatter.slug}`,
            lastmod: frontmatter.lastModified || frontmatter.date,
            changefreq: 'weekly',
            priority: priority
          });
        }
      } catch (error) {
        console.error(`❌ Error processing post for sitemap ${file}:`, error.message);
      }
    });
  }
  
  // Add pages
  const pagesDir = path.join(__dirname, '../src/data/pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir)
      .filter(file => file.endsWith('.md'));
    
    pageFiles.forEach(file => {
      try {
        const filePath = path.join(pagesDir, file);
  
        const { data: frontmatter } = matter(fs.readFileSync(filePath, 'utf8'));
        
        if (frontmatter.status === 'published' && frontmatter.slug) {
          sitemap.urls.push({
            url: `${baseUrl}/${frontmatter.slug}`,
            lastmod: frontmatter.lastModified || frontmatter.date,
            changefreq: 'monthly',
            priority: 0.8
          });
        }
      } catch (error) {
        console.error(`❌ Error processing page for sitemap ${file}:`, error.message);
      }
    });
  }
  
  // Write sitemap data
  fs.writeFileSync(outputFile, JSON.stringify(sitemap, null, 2));
  console.log(`🗺️  Generated sitemap data: ${sitemap.urls.length} URLs`);
}

/**
 * Main build hook function
 */
function runBuildHooks() {
  console.log('🔧 Running build hooks...');
  
  try {
    // Pre-process all markdown files
    preBuildHook();
    
    // Generate data files
    console.log('\n📊 Generating data files...');
    generateAuthorsData();
    generateCategoriesData();
    generateNavigationData();
    generateBlogStats();
    generateSitemapData();
    
    console.log('\n🎉 All build hooks completed successfully!');
    
  } catch (error) {
    console.error('❌ Build hooks failed:', error.message);
    process.exit(1);
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'pre-build':
      preBuildHook();
      break;
      
    case 'generate-data':
      generateAuthorsData();
      generateCategoriesData();
      generateNavigationData();
      generateBlogStats();
      generateSitemapData();
      break;
      
    case 'all':
    default:
      runBuildHooks();
      break;
  }
}

export {
  preBuildHook,
  generateAuthorsData,
  generateCategoriesData,
  generateNavigationData,
  generateBlogStats,
  generateSitemapData,
  runBuildHooks
};