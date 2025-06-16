# Frontmatter Usage Guide

This guide explains how to use the enhanced frontmatter system in your Markdown files, including automatic processing, field customization, and best practices.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Field Reference](#field-reference)
3. [Automatic Processing](#automatic-processing)
4. [Author Management](#author-management)
5. [Category and Tag System](#category-and-tag-system)
6. [SEO Optimization](#seo-optimization)
7. [Content Settings](#content-settings)
8. [Build Integration](#build-integration)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Quick Start

### Creating a New Blog Post

1. Copy the template:
   ```bash
   cp templates/blog-post-template.md src/data/posts/my-new-post.md
   ```

2. Edit the frontmatter fields:
   ```yaml
   ---
   title: "My Amazing Blog Post"
   author: "john-doe"  # Use author slug from authors collection
   categories:
     - "web-development"
   tags:
     - "javascript"
     - "tutorial"
   status: "published"
   ---
   ```

3. Write your content and save the file

4. Run the processing script:
   ```bash
   npm run process-frontmatter
   ```

### What Gets Auto-Generated

When you save a post with minimal frontmatter, the system automatically generates:

- **Slug**: `my-amazing-blog-post` (from title)
- **Reading Time**: `5 minutes` (calculated from content)
- **SEO Title**: `My Amazing Blog Post | All Things Digital`
- **Meta Description**: Generated from excerpt or first paragraph
- **Keywords**: Extracted from title, tags, and content
- **Canonical URL**: `https://all-things-digital.pages.dev/blog/my-amazing-blog-post`
- **Last Modified**: Current timestamp

## Field Reference

### Required Fields

```yaml
title: "Your Post Title"        # Post title (required)
date: "2024-01-01T00:00:00.000Z" # Publication date (required)
author: "author-slug"            # Author from authors collection (required)
status: "published"              # Content status (required)
```

### Content Organization

```yaml
# Automatic slug generation
slug: ""                         # Leave empty for auto-generation

# Categorization
categories:                      # Select from categories collection
  - "web-development"
  - "tutorials"

tags:                           # Flexible tagging system
  - "javascript"
  - "react"
  - "frontend"

# Series support
series: "React Fundamentals"     # Group related posts
partNumber: 1                   # Order within series

# Content priority
priority: "high"                # Options: low, medium, high
featured: true                  # Highlight important posts
```

### Content Preview

```yaml
excerpt: "Brief description"    # Used in previews and SEO
readingTime: ""                 # Auto-calculated if empty

# Featured image
featuredImage:
  src: "/images/blog/post.jpg"
  alt: "Descriptive alt text"
  caption: "Optional caption"
```

### Advanced Media

```yaml
# Image gallery
imageGallery:
  - src: "/images/gallery/1.jpg"
    alt: "Gallery image 1"
    caption: "Caption for image 1"
  - src: "/images/gallery/2.jpg"
    alt: "Gallery image 2"
    caption: "Caption for image 2"

# Video content
video:
  url: "https://youtube.com/watch?v=example"
  thumbnail: "/images/video-thumb.jpg"
  duration: "10:30"
  transcript: "/transcripts/video.txt"
```

### SEO Configuration

```yaml
seo:
  title: ""                     # Auto-generated if empty
  description: ""               # Auto-generated if empty
  keywords: []                  # Auto-generated if empty
  canonical: ""                 # Auto-generated if empty
  noindex: false                # Exclude from search engines
```

### Social Media

```yaml
social:
  twitter:
    card: "summary_large_image"
    site: "@YourSite"
    creator: "@AuthorHandle"
    title: ""                   # Uses SEO title if empty
    description: ""             # Uses SEO description if empty
    image: ""                   # Uses featured image if empty
  facebook:
    title: ""
    description: ""
    image: ""
    type: "article"
```

### Content Settings

```yaml
contentSettings:
  toc: true                     # Show table of contents
  comments: true                # Enable comments
  shareButtons: true             # Show social share buttons
  contentWarning: null          # Optional warning message
```

## Automatic Processing

### Slug Generation

The system automatically generates URL-friendly slugs:

```yaml
# Input
title: "How to Build Amazing Web Apps!"

# Generated
slug: "how-to-build-amazing-web-apps"
```

**Rules:**
- Converts to lowercase
- Removes special characters
- Replaces spaces with hyphens
- Removes multiple consecutive hyphens

### Reading Time Calculation

```yaml
# Automatically calculated based on:
# - Word count (excluding code blocks)
# - Average reading speed (200 words/minute)
# - Rounded up to nearest minute

readingTime: "7 minutes"  # Auto-generated
```

### SEO Field Generation

```yaml
# Auto-generated SEO fields
seo:
  title: "How to Build Amazing Web Apps! | All Things Digital"
  description: "Learn the essential techniques for building modern web applications with this comprehensive guide covering best practices, tools, and frameworks."
  keywords: ["web apps", "development", "javascript", "tutorial"]
  canonical: "https://all-things-digital.pages.dev/blog/how-to-build-amazing-web-apps"
```

## Author Management

### Using the Author Dropdown

In Decap CMS, the author field appears as a dropdown populated from the authors collection:

```yaml
# In your blog post
author: "john-doe"  # Select from dropdown

# Multiple authors
coAuthors:
  - "jane-smith"
  - "bob-wilson"
```

### Creating New Authors

1. Create a new file in `src/data/authors/`:
   ```yaml
   # src/data/authors/john-doe.md
   ---
   name: "John Doe"
   slug: "john-doe"
   role: "Senior Developer"
   email: "john@example.com"
   bio: "John is a passionate developer..."
   avatar: "/images/authors/john-doe.jpg"
   social:
     twitter: "johndoe"
     github: "johndoe"
     linkedin: "johndoe"
   featured: true
   ---
   ```

2. The author will automatically appear in the dropdown

## Category and Tag System

### Categories

Categories are hierarchical and managed through the categories collection:

```yaml
# In your blog post
categories:
  - "web-development"      # Parent category
  - "frontend"             # Child category
```

### Tags

Tags are flexible and can be added freely:

```yaml
tags:
  - "javascript"           # Technology
  - "tutorial"             # Content type
  - "beginner"             # Skill level
  - "2024"                 # Year
```

### Best Practices

- **Categories**: Use 1-3 broad categories
- **Tags**: Use 3-8 specific tags
- **Consistency**: Maintain consistent naming conventions
- **Hierarchy**: Use parent/child relationships for categories

## SEO Optimization

### Automatic SEO Enhancement

The system automatically optimizes your content for search engines:

```yaml
# What you write
title: "JavaScript Tips"
excerpt: "Learn useful JavaScript techniques"

# What gets generated
seo:
  title: "JavaScript Tips | All Things Digital"
  description: "Learn useful JavaScript techniques for modern web development. Discover best practices, performance tips, and advanced patterns."
  keywords: ["javascript", "tips", "web development", "programming"]
  canonical: "https://all-things-digital.pages.dev/blog/javascript-tips"
```

### Manual SEO Override

```yaml
seo:
  title: "Custom SEO Title for Search Results"
  description: "Custom meta description that will appear in search results"
  keywords: ["custom", "keywords", "for", "this", "post"]
  noindex: false  # Set to true to exclude from search engines
```

### Social Media Optimization

```yaml
social:
  twitter:
    card: "summary_large_image"  # Large image card
    title: "Custom Twitter Title"
    description: "Custom Twitter description"
    image: "/images/social/twitter-card.jpg"
  facebook:
    title: "Custom Facebook Title"
    description: "Custom Facebook description"
    image: "/images/social/facebook-card.jpg"
```

## Content Settings

### Table of Contents

```yaml
contentSettings:
  toc: true  # Automatically generate TOC from headings
```

### Comments and Sharing

```yaml
contentSettings:
  comments: true        # Enable comment system
  shareButtons: true    # Show social share buttons
```

### Content Warnings

```yaml
contentSettings:
  contentWarning: "This post contains technical content that may be challenging for beginners."
```

## Build Integration

### Development Workflow

```bash
# Start development with frontmatter processing
npm run dev

# Process frontmatter manually
npm run process-frontmatter

# Dry run to see what would be changed
npm run process-frontmatter:dry-run

# Validate frontmatter structure
npm run validate-frontmatter
```

### Build Process

```bash
# Full build with all processing
npm run build

# This runs:
# 1. npm run build-hooks (processes frontmatter)
# 2. vite build (builds the site)
# 3. npm run generate-modern-formats
# 4. npm run generate-rss
# 5. npm run generate-sitemap
# 6. npm run generate-blog-data
```

### Generated Data Files

The build process creates several data files:

- `src/data/authors.json` - Author information
- `src/data/categories.json` - Category hierarchy
- `src/data/navigation.json` - Site navigation
- `src/data/blog-stats.json` - Blog statistics
- `src/data/sitemap.json` - SEO sitemap data

## Best Practices

### Content Creation

1. **Start with the template**: Always use the blog post template
2. **Fill required fields**: Title, date, author, and status are mandatory
3. **Write compelling excerpts**: Used in previews and SEO
4. **Use descriptive alt text**: Important for accessibility and SEO
5. **Choose relevant categories**: Help users find related content
6. **Add specific tags**: Improve content discoverability

### SEO Best Practices

1. **Let auto-generation work**: Most SEO fields work better when auto-generated
2. **Write for humans first**: Focus on quality content over keyword stuffing
3. **Use featured images**: Improve social media sharing
4. **Set appropriate priority**: High for important posts, medium for regular content
5. **Enable all content settings**: TOC, comments, and sharing improve engagement

### Performance Optimization

1. **Optimize images**: Use appropriate formats and sizes
2. **Limit gallery images**: Too many images can slow page loading
3. **Use video thumbnails**: Don't embed large videos directly
4. **Keep excerpts concise**: 150-160 characters for best SEO results

### Content Organization

1. **Use series for related content**: Group tutorials and guides
2. **Maintain category hierarchy**: Keep categories organized
3. **Tag consistently**: Use the same tags for similar content
4. **Link related posts**: Help users discover more content

## Troubleshooting

### Common Issues

#### Slug Not Generated
```yaml
# Problem: Empty slug field
slug: ""
title: ""  # Missing title

# Solution: Add a title
title: "My Blog Post"
slug: ""  # Will auto-generate
```

#### Author Not Found
```yaml
# Problem: Invalid author reference
author: "nonexistent-author"

# Solution: Use valid author slug
author: "john-doe"  # Must exist in authors collection
```

#### SEO Fields Not Generated
```yaml
# Problem: Missing required fields
title: ""     # Empty title
excerpt: ""   # Empty excerpt

# Solution: Provide content for generation
title: "My Post Title"
excerpt: "Brief description of the post"
```

#### Build Errors

```bash
# Check frontmatter validation
npm run validate-frontmatter

# Run dry-run to see potential issues
npm run process-frontmatter:dry-run

# Check for missing dependencies
npm install
```

### Validation Errors

The system validates frontmatter and reports errors:

```bash
❌ Error processing my-post.md:
- Missing required field: title
- Invalid slug format: must be lowercase letters, numbers, and hyphens only
- Invalid status: must be one of draft, review, published, archived
```

### Getting Help

1. **Check the template**: Compare your frontmatter with the template
2. **Run validation**: Use `npm run validate-frontmatter`
3. **Check console output**: Look for specific error messages
4. **Review this guide**: Most issues are covered in the troubleshooting section

## Advanced Usage

### Custom Field Processing

You can extend the processing system by modifying `scripts/process-frontmatter.js`:

```javascript
// Add custom field processing
function processCustomField(frontmatter, content) {
  if (!frontmatter.customField) {
    frontmatter.customField = generateCustomValue(content);
  }
}
```

### Integration with External APIs

```javascript
// Example: Fetch author data from external API
function enrichAuthorData(authorSlug) {
  // Fetch additional author information
  // Update author collection
}
```

### Custom Validation Rules

```javascript
// Add custom validation
function validateCustomFields(frontmatter) {
  const errors = [];
  
  if (frontmatter.customField && !isValidCustomField(frontmatter.customField)) {
    errors.push('Invalid custom field format');
  }
  
  return errors;
}
```

This comprehensive system provides powerful frontmatter processing while maintaining simplicity for content creators. The automatic processing handles technical details, allowing you to focus on creating great content.