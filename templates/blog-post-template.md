---
# Basic Information
title: "Your Blog Post Title Here"
slug: "" # Leave empty for auto-generation from title
date: "2024-01-01T00:00:00.000Z"
lastModified: "" # Auto-updated during build
status: "draft" # Options: draft, review, published, archived
featured: false
priority: "medium" # Options: low, medium, high (affects SEO priority)

# Author Information
author: "" # Select from authors collection
coAuthors: [] # Optional: additional authors

# Content Organization
categories:
  - "" # Select from categories collection
tags:
  - "" # Add relevant tags
series: "" # Optional: if part of a series
partNumber: 1 # Optional: part number in series

# Content Preview
excerpt: "A compelling summary of your blog post that will appear in previews and social media shares."
readingTime: "" # Leave empty for auto-calculation

# Media
featuredImage:
  src: "/images/blog/your-image.jpg"
  alt: "Descriptive alt text for your featured image"
  caption: "Optional caption for the image"

# Image Gallery (Optional)
imageGallery:
  - src: "/images/blog/gallery-1.jpg"
    alt: "Description of gallery image 1"
    caption: "Caption for gallery image 1"
  - src: "/images/blog/gallery-2.jpg"
    alt: "Description of gallery image 2"
    caption: "Caption for gallery image 2"

# Video Content (Optional)
video:
  url: "https://youtube.com/watch?v=example"
  thumbnail: "/images/blog/video-thumbnail.jpg"
  duration: "10:30"
  transcript: "/transcripts/video-transcript.txt"

# Related Content
relatedPosts:
  - "slug-of-related-post-1"
  - "slug-of-related-post-2"

# SEO Configuration
seo:
  title: "" # Leave empty for auto-generation
  description: "" # Leave empty for auto-generation from excerpt
  keywords: [] # Leave empty for auto-generation
  canonical: "" # Leave empty for auto-generation
  noindex: false # Set to true to exclude from search engines

# Social Media
social:
  twitter:
    card: "summary_large_image"
    site: "@YourTwitterHandle"
    creator: "@AuthorTwitterHandle"
    title: "" # Leave empty to use SEO title
    description: "" # Leave empty to use SEO description
    image: "" # Leave empty to use featured image
  facebook:
    title: "" # Leave empty to use SEO title
    description: "" # Leave empty to use SEO description
    image: "" # Leave empty to use featured image
    type: "article"

# Content Settings
contentSettings:
  toc: true # Show table of contents
  comments: true # Enable comments
  shareButtons: true # Show social share buttons
  contentWarning: null # Optional: content warning message

# Advanced Options
advanced:
  customCSS: "" # Optional: custom CSS for this post
  customJS: "" # Optional: custom JavaScript for this post
  schemaMarkup: {} # Optional: custom schema.org markup
  amp: false # Enable AMP version
  newsletter: true # Include in newsletter
  rss: true # Include in RSS feed
---

# Your Blog Post Title Here

Start writing your blog post content here. This template includes all the enhanced frontmatter fields that will be automatically processed during the build.

## Key Features of This Template

### Automatic Processing
- **Slug Generation**: If you leave the slug empty, it will be automatically generated from your title
- **Reading Time**: Leave empty and it will be calculated based on your content
- **SEO Fields**: Many SEO fields will be auto-generated if left empty
- **Last Modified**: Automatically updated during builds

### Content Organization
- Use categories and tags to organize your content
- Link to authors from the authors collection
- Create series of related posts

### Rich Media Support
- Featured images with alt text and captions
- Image galleries for visual content
- Video embeds with metadata

### SEO Optimization
- Comprehensive meta tags
- Social media optimization
- Schema markup support
- Sitemap integration

## Writing Tips

1. **Compelling Excerpt**: Write a clear, engaging excerpt that summarizes your post
2. **Descriptive Alt Text**: Always include descriptive alt text for images
3. **Relevant Tags**: Use specific, relevant tags to help readers find your content
4. **Clear Structure**: Use headings to create a clear content hierarchy

## Content Guidelines

- Keep paragraphs concise and readable
- Use bullet points and numbered lists for clarity
- Include relevant internal and external links
- Add code examples with proper syntax highlighting
- Include images to break up text and illustrate points

```javascript
// Example code block
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

## Conclusion

This template provides a comprehensive foundation for creating rich, SEO-optimized blog posts with automatic frontmatter processing. The build system will handle many of the technical details, allowing you to focus on creating great content.

---

**Note**: This template includes all available frontmatter fields. You can remove any fields you don't need for a specific post. Required fields are: `title`, `date`, `author`, and `status`.