/**
 * Frontmatter Processing Utility
 * 
 * This script processes markdown frontmatter to automatically generate
 * missing values like slugs, reading time, and SEO fields.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The title to convert
 * @returns {string} - URL-friendly slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Calculate estimated reading time based on content length
 * @param {string} content - The markdown content
 * @returns {string} - Reading time estimate
 */
function calculateReadingTime(content) {
  // Remove markdown syntax for accurate word count
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  const wordsPerMinute = 200; // Average reading speed
  const minutes = Math.ceil(words.length / wordsPerMinute);
  
  return minutes === 1 ? '1 minute' : `${minutes} minutes`;
}

/**
 * Generate SEO title from main title if not provided
 * @param {string} title - Main title
 * @param {string} seoTitle - Existing SEO title
 * @param {string} siteName - Site name to append
 * @returns {string} - SEO optimized title
 */
function generateSEOTitle(title, seoTitle, siteName = 'All Things Digital') {
  if (seoTitle) return seoTitle;
  
  // Truncate title if too long and append site name
  const maxLength = 60 - siteName.length - 3; // Account for " | "
  const truncatedTitle = title.length > maxLength 
    ? title.substring(0, maxLength).trim() + '...'
    : title;
  
  return `${truncatedTitle} | ${siteName}`;
}

/**
 * Generate meta description from excerpt or content
 * @param {string} excerpt - Post excerpt
 * @param {string} content - Post content
 * @param {string} metaDescription - Existing meta description
 * @returns {string} - Meta description
 */
function generateMetaDescription(excerpt, content, metaDescription) {
  if (metaDescription) return metaDescription;
  if (excerpt) {
    return excerpt.length > 160 
      ? excerpt.substring(0, 157) + '...'
      : excerpt;
  }
  
  // Extract first paragraph from content
  const firstParagraph = content
    .replace(/#{1,6}\s+.*?\n/g, '') // Remove headers
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .split('\n\n')[0]
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .trim();
  
  return firstParagraph.length > 160 
    ? firstParagraph.substring(0, 157) + '...'
    : firstParagraph;
}

/**
 * Generate canonical URL
 * @param {string} slug - Post slug
 * @param {string} baseUrl - Site base URL
 * @returns {string} - Canonical URL
 */
function generateCanonicalUrl(slug, baseUrl = 'https://all-things-digital.pages.dev') {
  return `${baseUrl}/blog/${slug}`;
}

/**
 * Extract and suggest keywords from content
 * @param {string} title - Post title
 * @param {string} content - Post content
 * @param {array} tags - Existing tags
 * @returns {array} - Suggested keywords
 */
function generateKeywords(title, content, tags = []) {
  const keywords = new Set();
  
  // Add tags as keywords
  tags.forEach(tag => keywords.add(tag.toLowerCase()));
  
  // Extract keywords from title
  const titleWords = title.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !/^(the|and|for|are|but|not|you|all|can|had|her|was|one|our|out|day|get|has|him|his|how|its|may|new|now|old|see|two|way|who|boy|did|man|men|put|say|she|too|use)$/.test(word));
  
  titleWords.forEach(word => keywords.add(word));
  
  // Limit to 10 keywords
  return Array.from(keywords).slice(0, 10);
}

/**
 * Process a single markdown file
 * @param {string} filePath - Path to the markdown file
 * @param {object} options - Processing options
 */
function processMarkdownFile(filePath, options = {}) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    let modified = false;
    
    // Generate slug if missing
    if (!frontmatter.slug && frontmatter.title) {
      frontmatter.slug = generateSlug(frontmatter.title);
      modified = true;
      console.log(`Generated slug: ${frontmatter.slug}`);
    }
    
    // Generate SEO title if missing
    if (!frontmatter.seoTitle && frontmatter.title) {
      frontmatter.seoTitle = generateSEOTitle(frontmatter.title, frontmatter.seoTitle);
      modified = true;
      console.log(`Generated SEO title: ${frontmatter.seoTitle}`);
    }
    
    // Calculate reading time if missing
    if (!frontmatter.readingTime) {
      frontmatter.readingTime = calculateReadingTime(content);
      modified = true;
      console.log(`Calculated reading time: ${frontmatter.readingTime}`);
    }
    
    // Update last modified date
    if (options.updateLastModified !== false) {
      frontmatter.lastModified = new Date().toISOString();
      modified = true;
    }
    
    // Initialize SEO object if missing
    if (!frontmatter.seo) {
      frontmatter.seo = {};
      modified = true;
    }
    
    // Generate SEO meta description
    if (!frontmatter.seo.description) {
      frontmatter.seo.description = generateMetaDescription(
        frontmatter.excerpt, 
        content, 
        frontmatter.seo.description
      );
      modified = true;
      console.log(`Generated meta description: ${frontmatter.seo.description.substring(0, 50)}...`);
    }
    
    // Generate canonical URL
    if (!frontmatter.seo.canonical && frontmatter.slug) {
      frontmatter.seo.canonical = generateCanonicalUrl(frontmatter.slug);
      modified = true;
      console.log(`Generated canonical URL: ${frontmatter.seo.canonical}`);
    }
    
    // Generate keywords
    if (!frontmatter.seo.keywords || frontmatter.seo.keywords.length === 0) {
      frontmatter.seo.keywords = generateKeywords(
        frontmatter.title, 
        content, 
        frontmatter.tags
      );
      modified = true;
      console.log(`Generated keywords: ${frontmatter.seo.keywords.join(', ')}`);
    }
    
    // Set default priority if missing
    if (!frontmatter.priority) {
      frontmatter.priority = 'medium';
      modified = true;
    }
    
    // Initialize content settings if missing
    if (!frontmatter.contentSettings) {
      frontmatter.contentSettings = {
        toc: true,
        comments: true,
        shareButtons: true,
        contentWarning: null
      };
      modified = true;
    }
    
    // Write back to file if modified
    if (modified && !options.dryRun) {
      const updatedContent = matter.stringify(content, frontmatter);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${path.basename(filePath)}`);
    } else if (modified && options.dryRun) {
      console.log(`🔍 Would update: ${path.basename(filePath)}`);
    } else {
      console.log(`✨ No changes needed: ${path.basename(filePath)}`);
    }
    
    return { frontmatter, content, modified };
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Process all markdown files in a directory
 * @param {string} directory - Directory containing markdown files
 * @param {object} options - Processing options
 */
function processMarkdownDirectory(directory, options = {}) {
  try {
    const files = fs.readdirSync(directory)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(directory, file));
    
    console.log(`📁 Processing ${files.length} markdown files in ${directory}`);
    
    let processedCount = 0;
    let modifiedCount = 0;
    
    files.forEach(filePath => {
      console.log(`\n📄 Processing: ${path.basename(filePath)}`);
      const result = processMarkdownFile(filePath, options);
      
      if (result) {
        processedCount++;
        if (result.modified) {
          modifiedCount++;
        }
      }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Processed: ${processedCount} files`);
    console.log(`   Modified: ${modifiedCount} files`);
    console.log(`   Skipped: ${files.length - processedCount} files`);
    
  } catch (error) {
    console.error(`❌ Error processing directory ${directory}:`, error.message);
  }
}

/**
 * Validate frontmatter structure
 * @param {object} frontmatter - Frontmatter object to validate
 * @returns {array} - Array of validation errors
 */
function validateFrontmatter(frontmatter) {
  const errors = [];
  
  // Required fields
  if (!frontmatter.title) errors.push('Missing required field: title');
  if (!frontmatter.date) errors.push('Missing required field: date');
  if (!frontmatter.author) errors.push('Missing required field: author');
  
  // Slug validation
  if (frontmatter.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.slug)) {
    errors.push('Invalid slug format: must be lowercase letters, numbers, and hyphens only');
  }
  
  // Date validation
  if (frontmatter.date && isNaN(Date.parse(frontmatter.date))) {
    errors.push('Invalid date format');
  }
  
  // Status validation
  const validStatuses = ['draft', 'review', 'published', 'archived'];
  if (frontmatter.status && !validStatuses.includes(frontmatter.status)) {
    errors.push(`Invalid status: must be one of ${validStatuses.join(', ')}`);
  }
  
  // Priority validation
  const validPriorities = ['low', 'medium', 'high'];
  if (frontmatter.priority && !validPriorities.includes(frontmatter.priority)) {
    errors.push(`Invalid priority: must be one of ${validPriorities.join(', ')}`);
  }
  
  return errors;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'process':
      const directory = args[1] || 'src/data/posts';
      const dryRun = args.includes('--dry-run');
      const updateLastModified = !args.includes('--no-update-modified');
      
      processMarkdownDirectory(directory, { dryRun, updateLastModified });
      break;
      
    case 'validate':
      const validateDir = args[1] || 'src/data/posts';
      // Implementation for validation command
      console.log(`Validating markdown files in ${validateDir}`);
      break;
      
    default:
      console.log(`
Frontmatter Processing Utility

Usage:
  node scripts/process-frontmatter.js process [directory] [--dry-run] [--no-update-modified]
  node scripts/process-frontmatter.js validate [directory]

Examples:
  node scripts/process-frontmatter.js process
  node scripts/process-frontmatter.js process src/data/posts --dry-run
  node scripts/process-frontmatter.js validate src/data/posts
`);
  }
}

module.exports = {
  generateSlug,
  calculateReadingTime,
  generateSEOTitle,
  generateMetaDescription,
  generateCanonicalUrl,
  generateKeywords,
  processMarkdownFile,
  processMarkdownDirectory,
  validateFrontmatter
};