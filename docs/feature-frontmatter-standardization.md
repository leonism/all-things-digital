# Frontmatter Standardization Guide

This guide explains how to standardize frontmatter field order across all markdown files in your blog to ensure consistency and maintainability.

## Overview

The frontmatter standardization system ensures all blog posts follow the same field order structure, making the codebase more maintainable and easier to work with.

## 🚀 Quick Start

### Standardize All Files

```bash
# Standardize all frontmatter to match first-post.md structure
node scripts/standardize-frontmatter.js
```

### What It Does

- **Reorders frontmatter fields** to match the standard sequence
- **Uses `first-post.md`** as the reference template
- **Preserves all existing data** while improving consistency
- **Maintains proper YAML formatting** without `>-` characters
- **Skips the reference file** (`first-post.md`) during processing

## 📋 Standard Field Order

The standardization follows this field sequence:

### Core Fields (Required)
1. `title` - Post title
2. `seoTitle` - SEO optimized title
3. `slug` - URL slug
4. `date` - Publication date
5. `lastModified` - Last modification timestamp
6. `author` - Author information
7. `category` - Post category
8. `tags` - Post tags array
9. `featuredImage` - Featured image object
10. `excerpt` - Post excerpt
11. `readingTime` - Estimated reading time
12. `status` - Publication status
13. `featured` - Featured post flag
14. `priority` - Content priority
15. `metaRobots` - SEO robots directive
16. `canonicalUrl` - Canonical URL
17. `seo` - SEO metadata object
18. `contentSettings` - Content configuration

### Additional Fields (Optional)
19. `schema` - Structured data
20. `relatedPosts` - Related posts array
21. `toc` - Table of contents flag
22. Any other custom fields

## 🔧 How It Works

### Processing Logic

1. **Reads all markdown files** in `src/data/posts/`
2. **Parses frontmatter** using `gray-matter`
3. **Reorders fields** according to standard sequence
4. **Preserves custom fields** not in the standard order
5. **Writes back** with consistent YAML formatting
6. **Skips reference file** (`first-post.md`)

### YAML Configuration

The script uses `js-yaml` with specific options to prevent formatting issues:

```javascript
yaml.dump(obj, {
  lineWidth: -1,        // No line wrapping
  noRefs: true,         // No references
  quotingType: '"',     // Double quotes
  forceQuotes: false,   // Only quote when necessary
  flowLevel: -1         // Block style formatting
});
```

## 📊 Example Output

### Before Standardization
```yaml
---
schema:
  "@type": Article
title: "My Blog Post"
status: published
date: "2025-01-01"
author:
  name: John Doe
---
```

### After Standardization
```yaml
---
title: "My Blog Post"
date: "2025-01-01"
author:
  name: John Doe
status: published
schema:
  "@type": Article
---
```

## 🛠️ Script Details

### File Location
```
scripts/standardize-frontmatter.js
```

### Dependencies
- `gray-matter` - YAML frontmatter parsing
- `js-yaml` - YAML stringification
- `fs` - File system operations
- `path` - Path utilities

### Error Handling
- **File read errors** are logged with specific file names
- **Processing errors** don't stop the entire operation
- **Success/failure status** is clearly reported

## 🔍 Verification

### Check Results
After running the standardization:

```bash
# Verify build still works
npm run build

# Check a specific file
head -30 src/data/posts/your-post.md

# Process frontmatter to ensure compatibility
npm run process-frontmatter
```

### Expected Output
```
🚀 Starting frontmatter standardization...
📁 Found 11 markdown files

📄 Processing: ai-creative-industries-opportunities-challenges.md
✅ Standardized: ai-creative-industries-opportunities-challenges.md

📄 Processing: first-post.md
⏭️  Skipping reference file: first-post.md

🎉 Frontmatter standardization completed!
📊 All files now follow the same frontmatter order as first-post.md
```

## 🚨 Important Notes

### When to Use
- **After adding new posts** with inconsistent field order
- **During codebase cleanup** or maintenance
- **Before major releases** to ensure consistency
- **When onboarding new team members**

### Safety Considerations
- **Always commit changes** before running standardization
- **Test the build process** after standardization
- **Review changes** in version control
- **The script preserves all data** - only reorders fields

### Integration with Other Scripts
The standardization works seamlessly with:
- `process-frontmatter.js` - Frontmatter processing
- `generate-blog-data.js` - Blog data generation
- `build-hooks.js` - Build automation

## 📝 Best Practices

1. **Run standardization** before major releases
2. **Use `first-post.md`** as your template for new posts
3. **Commit changes** immediately after standardization
4. **Test thoroughly** after running the script
5. **Document any custom fields** you add to the standard order

## 🔗 Related Documentation

- [Frontmatter Processing Guide](feature-frontmatter.md)
- [Blog Automation Setup](feature-blog-automation.md)
- [Frontmatter Customization](feature-frontmatter-customization-guide.md)