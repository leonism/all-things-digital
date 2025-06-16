import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

/**
 * Standardize All Posts Script
 *
 * This script standardizes the frontmatter order and renames date fields
 * in all markdown files within the 'src/data/posts' directory.
 * It uses 'ai-creative-industries-opportunities-challenges.md' as the reference for the field order.
 */

// Standard frontmatter field order based on ai-creative-industries-opportunities-challenges.md
const STANDARD_ORDER = [
  'title',
  'seoTitle',
  'slug',
  'datePublished',
  'dateModified',
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
  'toc',
  'relatedPosts',
  'schema',
];

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/data/posts');
const REFERENCE_FILE_NAME = 'ai-creative-industries-opportunities-challenges.md';

/**
 * Renames date fields and reorders frontmatter object according to standard order.
 * @param {object} frontmatter - Original frontmatter object.
 * @returns {object} - Processed frontmatter object.
 */
function processFrontmatter(frontmatter, filename) {
  const processed = { ...frontmatter };

  // Rename date fields if necessary
  if (processed.hasOwnProperty('date') && !processed.hasOwnProperty('datePublished')) {
    processed.datePublished = processed.date;
    delete processed.date;
  }
  if (processed.hasOwnProperty('lastModified') && !processed.hasOwnProperty('dateModified')) {
    processed.dateModified = processed.lastModified;
    delete processed.lastModified;
  }

  // Explicitly delete original date/lastModified fields if they still exist after potential renaming
  // This ensures they are not carried over if they were not in STANDARD_ORDER or if renaming failed
  if (processed.hasOwnProperty('date')) {
    delete processed.date;
  }
  if (processed.hasOwnProperty('lastModified')) {
    delete processed.lastModified;
  }

  // Standardize date formats to ISO 8601
  ['datePublished', 'dateModified'].forEach(field => {
    if (processed.hasOwnProperty(field) && processed[field]) {
      try {
        const dateValue = new Date(processed[field]);
        // Check if the date is valid before formatting
        if (!isNaN(dateValue.getTime())) {
          processed[field] = dateValue.toISOString();
        } else if (typeof processed[field] === 'string' && processed[field].match(/^\d{4}-\d{2}-\d{2}$/)) {
          // If it's already YYYY-MM-DD, append a default time and Z to make it valid ISO
          // This handles cases where only date is provided, assuming UTC midnight
          processed[field] = `${processed[field]}T00:00:00.000Z`;
        } else {
          console.warn(`⚠️  Could not parse date for ${field}: '${processed[field]}' in ${filename}. Keeping original.`);
        }
      } catch (e) {
        console.warn(`⚠️  Error parsing date for ${field}: '${processed[field]}' in ${filename}. Keeping original. Error: ${e.message}`);
      }
    }
  });

  // Handle 'toc' field: ensure it's a boolean, prefer true if duplicated, remove if false.
  // Also, remove toc from contentSettings if it exists, as it's now a top-level field.
  if (processed.contentSettings && processed.contentSettings.hasOwnProperty('toc')) {
    if (processed.contentSettings.toc === true && !processed.hasOwnProperty('toc')) {
      processed.toc = true; // Promote toc from contentSettings if not already a top-level field
    }
    delete processed.contentSettings.toc;
    // If contentSettings becomes empty after removing toc, delete contentSettings itself
    if (Object.keys(processed.contentSettings).length === 0) {
      delete processed.contentSettings;
    }
  }

  if (processed.hasOwnProperty('toc')) {
    if (Array.isArray(processed.toc)) {
      processed.toc = processed.toc.includes(true);
    } else if (typeof processed.toc !== 'boolean') {
      processed.toc = String(processed.toc).toLowerCase() === 'true';
    }
    if (processed.toc === false) {
      delete processed.toc; // Remove top-level toc if it's false
    }
  }

  const reordered = {};

  // Add fields in standard order if they exist in the processed frontmatter
  STANDARD_ORDER.forEach(field => {
    if (processed.hasOwnProperty(field)) {
      reordered[field] = processed[field];
    }
  });

  // Add any remaining fields from the processed frontmatter that aren't in the standard order
  // This preserves custom fields not defined in STANDARD_ORDER
  Object.keys(processed).forEach(field => {
    if (!reordered.hasOwnProperty(field)) {
      reordered[field] = processed[field];
    }
  });

  return reordered;
}

/**
 * Processes a single markdown file to standardize its frontmatter.
 * @param {string} filePath - Path to the markdown file.
 */
function standardizeFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    // Skip the reference file itself from being processed by this logic
    if (path.basename(filePath) === REFERENCE_FILE_NAME) {
      console.log(`⏭️  Skipping reference file: ${path.basename(filePath)} (used as template)`);
      return;
    }

    const processedFrontmatter = processFrontmatter(frontmatter, path.basename(filePath));

    const updatedContent = matter.stringify(content, processedFrontmatter, {
      engines: {
        yaml: {
          stringify: (obj) => yaml.dump(obj, {
            lineWidth: -1,
            noRefs: true,
            quotingType: '"',
            forceQuotes: false,
            flowLevel: -1
          })
        }
      },
      sortKeys: false // Important: disable gray-matter's own sorting to use our order
    });

    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Standardized: ${path.basename(filePath)}`);

  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message, error.stack);
  }
}

/**
 * Main function to standardize all markdown files in the posts directory.
 */
function standardizeAllMdFiles() {
  try {
    console.log('🚀 Starting frontmatter standardization...');
    console.log(`📋 Using '${REFERENCE_FILE_NAME}' as the reference for field order.`);

    const files = fs.readdirSync(POSTS_DIRECTORY)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(POSTS_DIRECTORY, file));

    if (files.length === 0) {
      console.log('🤷 No markdown files found in the posts directory.');
      return;
    }
    console.log(`📁 Found ${files.length} markdown files to process.`);

    files.forEach(filePath => {
      standardizeFile(filePath);
    });

    console.log('\n🎉 Frontmatter standardization completed!');
    console.log(`📊 All processed files should now follow the frontmatter order of '${REFERENCE_FILE_NAME}' and have 'datePublished'/'dateModified' fields.`);

  } catch (error) {
    console.error('❌ Error during standardization process:', error.message, error.stack);
    process.exit(1);
  }
}

// Execute the standardization process
standardizeAllMdFiles();
