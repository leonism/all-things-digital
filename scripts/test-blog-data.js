#!/usr/bin/env node

/**
 * Test Blog Data Generation
 * 
 * This script tests the blog data generation process and provides
 * detailed feedback about the current state of the blog data.
 * 
 * Usage:
 *   node scripts/test-blog-data.js
 *   npm run test-blog-data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const POSTS_DIR = path.join(projectRoot, 'src', 'data', 'posts');
const BLOG_DATA_FILE = path.join(projectRoot, 'src', 'data', 'blog-data.json');
const AUTHORS_DIR = path.join(projectRoot, 'src', 'data', 'authors');
const CATEGORIES_DIR = path.join(projectRoot, 'src', 'data', 'categories');

/**
 * Analyzes the current state of blog data
 */
const analyzeBlogData = () => {
  console.log('📊 Analyzing current blog data state...');
  
  // Check if blog-data.json exists
  if (!fs.existsSync(BLOG_DATA_FILE)) {
    console.log('❌ blog-data.json does not exist');
    return null;
  }
  
  try {
    const blogData = JSON.parse(fs.readFileSync(BLOG_DATA_FILE, 'utf8'));
    console.log(`✅ blog-data.json exists with ${blogData.length} posts`);
    
    // Analyze posts
    const publishedPosts = blogData.filter(post => post.status === 'published');
    const draftPosts = blogData.filter(post => post.status === 'draft');
    
    console.log(`   • Published posts: ${publishedPosts.length}`);
    console.log(`   • Draft posts: ${draftPosts.length}`);
    
    // Check for recent posts
    const recentPosts = blogData
      .filter(post => {
        const postDate = new Date(post.date);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return postDate > weekAgo;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (recentPosts.length > 0) {
      console.log(`   • Recent posts (last 7 days): ${recentPosts.length}`);
      recentPosts.slice(0, 3).forEach(post => {
        console.log(`     - ${post.title} (${post.date})`);
      });
    }
    
    return blogData;
  } catch (error) {
    console.log(`❌ Error reading blog-data.json: ${error.message}`);
    return null;
  }
};

/**
 * Analyzes Markdown files in the posts directory
 */
const analyzeMarkdownFiles = () => {
  console.log('\n📝 Analyzing Markdown files...');
  
  if (!fs.existsSync(POSTS_DIR)) {
    console.log(`❌ Posts directory does not exist: ${POSTS_DIR}`);
    return [];
  }
  
  const files = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(POSTS_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        modified: stats.mtime,
        size: stats.size
      };
    })
    .sort((a, b) => b.modified - a.modified);
  
  console.log(`✅ Found ${files.length} Markdown files`);
  
  if (files.length > 0) {
    console.log('   Recent files:');
    files.slice(0, 5).forEach(file => {
      const timeAgo = Math.round((Date.now() - file.modified.getTime()) / (1000 * 60 * 60));
      console.log(`     - ${file.name} (${timeAgo}h ago, ${Math.round(file.size / 1024)}KB)`);
    });
  }
  
  return files;
};

/**
 * Checks the status of supporting directories
 */
const checkSupportingDirectories = () => {
  console.log('\n📁 Checking supporting directories...');
  
  const directories = [
    { name: 'Authors', path: AUTHORS_DIR },
    { name: 'Categories', path: CATEGORIES_DIR }
  ];
  
  directories.forEach(dir => {
    if (fs.existsSync(dir.path)) {
      const files = fs.readdirSync(dir.path).filter(f => f.endsWith('.md'));
      console.log(`✅ ${dir.name}: ${files.length} files`);
    } else {
      console.log(`❌ ${dir.name}: Directory not found`);
    }
  });
};

/**
 * Tests the blog data generation process
 */
const testGeneration = async () => {
  console.log('\n🧪 Testing blog data generation...');
  
  try {
    // Backup existing blog-data.json if it exists
    const backupFile = `${BLOG_DATA_FILE}.backup.${Date.now()}`;
    if (fs.existsSync(BLOG_DATA_FILE)) {
      fs.copyFileSync(BLOG_DATA_FILE, backupFile);
      console.log(`📋 Backed up existing blog-data.json to ${path.basename(backupFile)}`);
    }
    
    // Run the generation process
    console.log('🔄 Running blog data generation...');
    const { stdout, stderr } = await execAsync('npm run generate-blog-data');
    
    if (stderr) {
      console.log('⚠️  Warnings during generation:');
      console.log(stderr);
    }
    
    console.log('✅ Generation completed successfully');
    console.log('📄 Generation output:');
    console.log(stdout);
    
    // Analyze the new blog data
    const newBlogData = analyzeBlogData();
    
    return { success: true, data: newBlogData };
    
  } catch (error) {
    console.log(`❌ Error during generation: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Compares blog data before and after generation
 */
const compareResults = (before, after) => {
  if (!before || !after) {
    console.log('\n📊 Comparison skipped (missing data)');
    return;
  }
  
  console.log('\n📊 Comparing results...');
  
  const beforeCount = before.length;
  const afterCount = after.length;
  
  if (afterCount > beforeCount) {
    console.log(`✅ Added ${afterCount - beforeCount} new post(s)`);
  } else if (afterCount < beforeCount) {
    console.log(`⚠️  Removed ${beforeCount - afterCount} post(s)`);
  } else {
    console.log(`ℹ️  Post count unchanged (${afterCount} posts)`);
  }
  
  // Check for new posts
  const beforeSlugs = new Set(before.map(p => p.slug));
  const newPosts = after.filter(p => !beforeSlugs.has(p.slug));
  
  if (newPosts.length > 0) {
    console.log(`🆕 New posts detected:`);
    newPosts.forEach(post => {
      console.log(`   - ${post.title} (${post.slug})`);
    });
  }
};

/**
 * Main test function
 */
const runTest = async () => {
  console.log('🧪 Blog Data Generation Test');
  console.log('=' .repeat(50));
  
  // Initial analysis
  const initialBlogData = analyzeBlogData();
  analyzeMarkdownFiles();
  checkSupportingDirectories();
  
  // Test generation
  const result = await testGeneration();
  
  if (result.success) {
    compareResults(initialBlogData, result.data);
    
    console.log('\n✅ Test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Check the generated blog-data.json file');
    console.log('   2. Test your Vue.js application');
    console.log('   3. Verify new posts appear correctly');
  } else {
    console.log('\n❌ Test failed!');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check for syntax errors in Markdown files');
    console.log('   2. Verify all dependencies are installed');
    console.log('   3. Check file permissions');
    console.log('   4. Review the error message above');
  }
  
  console.log('\n' + '=' .repeat(50));
};

// Run the test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTest().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

export { runTest, analyzeBlogData, analyzeMarkdownFiles };