# Enhanced Frontmatter System

This project includes a comprehensive frontmatter processing system that automatically enhances your Markdown files with SEO optimization, content organization, and rich metadata.

## 🚀 Quick Start

### 1. Create a New Blog Post

```bash
# Copy the template
cp templates/blog-post-template.md src/data/posts/my-new-post.md

# Edit the frontmatter and content
# Save the file

# Process frontmatter automatically
npm run process-frontmatter
```

### 2. What Gets Auto-Generated

When you create a post with minimal frontmatter:

```yaml
---
title: "My Amazing Blog Post"
author: "john-doe"
categories:
  - "web-development"
tags:
  - "javascript"
status: "published"
---
```

The system automatically generates:

- ✅ **Slug**: `my-amazing-blog-post`
- ✅ **Reading Time**: `5 minutes`
- ✅ **SEO Title**: `My Amazing Blog Post | All Things Digital`
- ✅ **Meta Description**: Generated from content
- ✅ **Keywords**: `["javascript", "web development", "blog"]`
- ✅ **Canonical URL**: `https://all-things-digital.pages.dev/blog/my-amazing-blog-post`
- ✅ **Social Media Tags**: Twitter and Facebook optimization
- ✅ **Last Modified**: Current timestamp

## 📁 File Structure

```
├── scripts/
│   ├── process-frontmatter.js    # Core processing logic
│   └── build-hooks.js            # Build integration
├── templates/
│   └── blog-post-template.md     # Template for new posts
├── examples/
│   └── example-blog-post.md      # Complete example
├── docs/
│   └── FRONTMATTER_USAGE_GUIDE.md # Detailed documentation
└── src/data/
    ├── posts/                    # Blog posts
    ├── authors/                  # Author profiles
    ├── categories/               # Category definitions
    └── navigation/               # Site navigation
```

## 🛠️ Available Scripts

### Development

```bash
# Start development with frontmatter processing
npm run dev

# Process frontmatter manually
npm run process-frontmatter

# See what would be changed (dry run)
npm run process-frontmatter:dry-run

# Validate frontmatter structure
npm run validate-frontmatter
```

### Build Process

```bash
# Full build with all processing
npm run build

# Run all build hooks
npm run build-hooks

# Generate data files only
npm run generate-data
```

## 🎯 Key Features

### 1. Automatic Slug Generation

```yaml
# Input
title: "How to Build Amazing Web Apps!"

# Generated
slug: "how-to-build-amazing-web-apps"
```

### 2. Author Dropdown Integration

In Decap CMS, authors appear as a searchable dropdown:

```yaml
# In your post
author: "john-doe"  # Select from dropdown

# Multiple authors supported
coAuthors:
  - "jane-smith"
  - "bob-wilson"
```

### 3. Smart SEO Generation

```yaml
# Auto-generated SEO fields
seo:
  title: "How to Build Amazing Web Apps! | All Things Digital"
  description: "Learn essential techniques for building modern web applications..."
  keywords: ["web apps", "development", "javascript"]
  canonical: "https://all-things-digital.pages.dev/blog/how-to-build-amazing-web-apps"
```

### 4. Reading Time Calculation

```yaml
# Automatically calculated
readingTime: "7 minutes"  # Based on 200 words/minute
```

### 5. Content Organization

```yaml
# Categories (hierarchical)
categories:
  - "web-development"
  - "frontend"

# Tags (flexible)
tags:
  - "javascript"
  - "tutorial"
  - "beginner"

# Series support
series: "React Fundamentals"
partNumber: 1
```

### 6. Rich Media Support

```yaml
# Featured image
featuredImage:
  src: "/images/blog/post.jpg"
  alt: "Descriptive alt text"
  caption: "Image caption"

# Image gallery
imageGallery:
  - src: "/images/gallery/1.jpg"
    alt: "Gallery image 1"
    caption: "Caption 1"

# Video content
video:
  url: "https://youtube.com/watch?v=example"
  thumbnail: "/images/video-thumb.jpg"
  duration: "10:30"
```

### 7. Social Media Optimization

```yaml
social:
  twitter:
    card: "summary_large_image"
    site: "@YourSite"
    creator: "@AuthorHandle"
  facebook:
    type: "article"
```

### 8. Content Settings

```yaml
contentSettings:
  toc: true              # Table of contents
  comments: true         # Enable comments
  shareButtons: true     # Social sharing
  contentWarning: null   # Optional warning
```

## 📝 Content Collections

### Authors Collection

Create author profiles in `src/data/authors/`:

```yaml
# src/data/authors/john-doe.md
---
name: "John Doe"
slug: "john-doe"
role: "Senior Developer"
email: "john@example.com"
bio: "Passionate developer with 10+ years experience"
avatar: "/images/authors/john-doe.jpg"
social:
  twitter: "johndoe"
  github: "johndoe"
  linkedin: "johndoe"
featured: true
---
```

### Categories Collection

Define categories in `src/data/categories/`:

```yaml
# src/data/categories/web-development.md
---
name: "Web Development"
slug: "web-development"
description: "Modern web development tutorials and guides"
color: "#3B82F6"
icon: "code"
featured: true
parent: null
---
```

### Navigation Collection

Manage site navigation in `src/data/navigation/`:

```yaml
# src/data/navigation/main.md
---
type: "main"
items:
  - label: "Home"
    url: "/"
  - label: "Blog"
    url: "/blog"
    submenu:
      - label: "Web Development"
        url: "/blog/category/web-development"
      - label: "Tutorials"
        url: "/blog/category/tutorials"
---
```

## 🔧 Customization

### Adding Custom Fields

Extend the processing system in `scripts/process-frontmatter.js`:

```javascript
// Add custom field processing
function processCustomField(frontmatter, content) {
  if (!frontmatter.customField) {
    frontmatter.customField = generateCustomValue(content);
  }
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

### Extending the CMS Configuration

Modify `config.yml` to add new fields:

```yaml
fields:
  - label: "Custom Field"
    name: "customField"
    widget: "string"
    hint: "Enter a custom value"
    required: false
```

## 🎨 Decap CMS Integration

### Enhanced Field Types

The system provides enhanced field types in Decap CMS:

- **Author Dropdown**: Searchable author selection
- **Category Selection**: Hierarchical category picker
- **Tag Management**: Flexible tag input
- **Media Widgets**: Rich image and video handling
- **SEO Fields**: Comprehensive SEO configuration
- **Content Settings**: Toggle switches for features

### Field Hints and Validation

All fields include helpful hints:

```yaml
- label: "Slug"
  name: "slug"
  widget: "string"
  hint: "Leave empty to auto-generate from title"
  pattern: ["^[a-z0-9]+(?:-[a-z0-9]+)*$", "Must be lowercase with hyphens"]
```

## 📊 Generated Data Files

The build process creates several data files:

- `src/data/authors.json` - Author information
- `src/data/categories.json` - Category hierarchy
- `src/data/navigation.json` - Site navigation
- `src/data/blog-stats.json` - Blog statistics
- `src/data/sitemap.json` - SEO sitemap data

## 🚀 Performance Features

### Build Optimization

- **Automatic Processing**: Frontmatter processed during build
- **Data Generation**: Static data files for fast loading
- **SEO Enhancement**: Optimized meta tags and structured data
- **Image Optimization**: Automatic alt text validation
- **Sitemap Generation**: SEO-friendly sitemaps

### Development Experience

- **Hot Reloading**: Changes reflected immediately
- **Validation**: Real-time frontmatter validation
- **Auto-completion**: CMS provides field suggestions
- **Preview**: Live preview of generated content

## 📚 Documentation

- **[Frontmatter Usage Guide](docs/FRONTMATTER_USAGE_GUIDE.md)** - Comprehensive usage documentation
- **[Blog Post Template](templates/blog-post-template.md)** - Template for new posts
- **[Example Post](examples/example-blog-post.md)** - Complete example with all features

## 🛡️ Best Practices

### Content Creation

1. **Use the Template**: Always start with the blog post template
2. **Fill Required Fields**: Title, date, author, and status are mandatory
3. **Write Compelling Excerpts**: Used in previews and SEO
4. **Optimize Images**: Use descriptive alt text and appropriate sizes
5. **Organize Content**: Use categories and tags consistently

### SEO Optimization

1. **Let Auto-generation Work**: Most SEO fields work better when auto-generated
2. **Focus on Quality**: Write for humans first, SEO second
3. **Use Featured Images**: Improve social media sharing
4. **Set Appropriate Priority**: High for important posts
5. **Enable Content Features**: TOC, comments, and sharing improve engagement

### Performance

1. **Optimize Images**: Use appropriate formats and sizes
2. **Limit Gallery Images**: Too many can slow loading
3. **Use Video Thumbnails**: Don't embed large videos directly
4. **Keep Excerpts Concise**: 150-160 characters for best SEO

## 🔍 Troubleshooting

### Common Issues

**Slug Not Generated**
```yaml
# Problem: Missing title
title: ""  # Empty title

# Solution: Add a title
title: "My Blog Post"
```

**Author Not Found**
```yaml
# Problem: Invalid author
author: "nonexistent-author"

# Solution: Use valid author slug
author: "john-doe"  # Must exist in authors collection
```

**Build Errors**
```bash
# Check validation
npm run validate-frontmatter

# Run dry-run
npm run process-frontmatter:dry-run

# Check dependencies
npm install
```

### Getting Help

1. Check the [Usage Guide](docs/FRONTMATTER_USAGE_GUIDE.md)
2. Run validation: `npm run validate-frontmatter`
3. Check console output for specific errors
4. Compare with the [example post](examples/example-blog-post.md)

## 🎉 Benefits

### For Content Creators

- **Simplified Workflow**: Focus on writing, not technical details
- **Automatic SEO**: Built-in optimization
- **Rich Media Support**: Easy image and video integration
- **Content Organization**: Powerful categorization and tagging
- **Preview System**: See changes in real-time

### For Developers

- **Extensible System**: Easy to customize and extend
- **Type Safety**: Validation and error checking
- **Performance Optimized**: Efficient build process
- **Modern Tooling**: Integration with modern development workflows
- **Comprehensive Documentation**: Clear guides and examples

### For SEO

- **Automatic Optimization**: Meta tags, structured data, sitemaps
- **Social Media Ready**: Open Graph and Twitter Card support
- **Performance Focused**: Fast loading, optimized content
- **Accessibility**: Alt text validation, semantic markup
- **Analytics Ready**: Schema markup for rich snippets

---

**Ready to get started?** Copy the template, fill in your content, and let the system handle the rest! 🚀