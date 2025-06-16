import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

/**
 * Standardize Frontmatter Order Script
 * 
 * This script standardizes the frontmatter order in all markdown files
 * to match the structure defined in first-post.md
 */

// Standard frontmatter field order based on first-post.md
const STANDARD_ORDER = [
  'title',
  'seoTitle', 
  'slug',
  'date',
  'lastModified',
  'author',
  'category',
  'tags',
  'featuredImage',
  'excerpt',
  'readingTime',
  'status',
  'featured',
  'priority',
  'metaRobots',
  'canonicalUrl',
  'seo',
  'contentSettings',
  // Additional fields that may exist
  'schema',
  'relatedPosts',
  'toc'
];

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/data/posts');

/**
 * Reorder frontmatter object according to standard order
 * @param {object} frontmatter - Original frontmatter object
 * @returns {object} - Reordered frontmatter object
 */
function reorderFrontmatter(frontmatter) {
  const reordered = {};
  
  // Add fields in standard order if they exist
  STANDARD_ORDER.forEach(field => {
    if (frontmatter.hasOwnProperty(field)) {
      reordered[field] = frontmatter[field];
    }
  });
  
  // Add any remaining fields that aren't in the standard order
  Object.keys(frontmatter).forEach(field => {
    if (!STANDARD_ORDER.includes(field)) {
      reordered[field] = frontmatter[field];
    }
  });
  
  return reordered;
}

/**
 * Process a single markdown file to standardize frontmatter order
 * @param {string} filePath - Path to the markdown file
 */
function standardizeFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Skip first-post.md as it's our reference
    if (path.basename(filePath) === 'first-post.md') {
      console.log(`⏭️  Skipping reference file: ${path.basename(filePath)}`);
      return;
    }
    
    // Reorder frontmatter
    const reorderedFrontmatter = reorderFrontmatter(frontmatter);
    
    // Write back to file with standardized order
    const updatedContent = matter.stringify(content, reorderedFrontmatter, {
      engines: {
        yaml: {
          stringify: (obj) => {
            return yaml.dump(obj, {
              lineWidth: -1,
              noRefs: true,
              quotingType: '"',
              forceQuotes: false,
              flowLevel: -1
            });
          }
        }
      }
    });
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Standardized: ${path.basename(filePath)}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
  }
}

/**
 * Main function to standardize all markdown files
 */
function standardizeAllFiles() {
  try {
    console.log('🚀 Starting frontmatter standardization...');
    
    const files = fs.readdirSync(POSTS_DIRECTORY)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(POSTS_DIRECTORY, file));
    
    console.log(`📁 Found ${files.length} markdown files`);
    
    files.forEach(filePath => {
      console.log(`\n📄 Processing: ${path.basename(filePath)}`);
      standardizeFile(filePath);
    });
    
    console.log('\n🎉 Frontmatter standardization completed!');
    console.log('📊 All files now follow the same frontmatter order as first-post.md');
    
  } catch (error) {
    console.error('❌ Error during standardization:', error.message);
    process.exit(1);
  }
}

// Execute the standardization
standardizeAllFiles();