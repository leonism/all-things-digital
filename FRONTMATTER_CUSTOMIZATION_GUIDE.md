# Frontmatter Customization Guide for Decap CMS

This guide explains how to integrate and customize frontmatter values in your markdown files using the enhanced Decap CMS configuration.

## Overview

The enhanced configuration provides advanced frontmatter integration with:
- Automatic slug generation
- Author dropdown selection
- Dynamic field relationships
- Content workflow management
- SEO optimization
- Advanced content settings

## Key Frontmatter Customizations

### 1. Automatic Slug Generation

**Configuration:**
```yaml
slug: '{{slug}}'
preview_path: 'blog/{{slug}}'
```

**Features:**
- Clean URL structure without date prefixes
- Auto-generation from title if left empty
- Pattern validation for URL-friendly format
- Live preview integration

**Usage:**
- Leave slug field empty for auto-generation from title
- Manual override available for custom URLs
- Validates against pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`

### 2. Author Dropdown Integration

**Configuration:**
```yaml
widget: 'relation'
collection: 'authors'
search_fields: ['name', 'slug']
value_field: 'slug'
display_fields: ['name', 'role']
```

**Features:**
- Dropdown selection from authors collection
- Search by name or slug
- Display name and role for easy identification
- Stores author slug for consistent referencing

**Benefits:**
- Consistent author data across posts
- Easy author management
- Prevents typos in author names
- Supports author profile pages

### 3. Enhanced Date Handling

**Configuration:**
```yaml
date:
  widget: 'datetime'
  default: ''
  hint: 'When this post should be published. Leave empty for current date/time.'

lastModified:
  widget: 'datetime'
  required: false
  hint: 'Automatically updated when content changes'
```

**Features:**
- Flexible publish date setting
- Automatic last modified tracking
- Timezone support
- Future post scheduling

### 4. Content Status Workflow

**Configuration:**
```yaml
status:
  widget: 'select'
  options:
    - { label: 'Draft', value: 'draft' }
    - { label: 'In Review', value: 'review' }
    - { label: 'Published', value: 'published' }
    - { label: 'Archived', value: 'archived' }
  default: 'draft'
```

**Workflow:**
1. **Draft** - Initial content creation
2. **In Review** - Ready for editorial review
3. **Published** - Live on the website
4. **Archived** - Removed from active display

### 5. Category and Tag Management

**Category Configuration:**
```yaml
category:
  widget: 'relation'
  collection: 'categories'
  search_fields: ['name']
  value_field: 'name'
  display_fields: ['name']
```

**Tag Configuration:**
```yaml
tags:
  widget: 'list'
  default: []
  hint: 'Add relevant tags for better content discovery'
```

**Features:**
- Consistent category selection
- Hierarchical category support
- Free-form tag entry
- SEO-friendly organization

### 6. Advanced Content Settings

**Configuration:**
```yaml
contentSettings:
  widget: 'object'
  collapsed: true
  fields:
    - toc: boolean (Table of Contents)
    - comments: boolean (Comments Enabled)
    - shareButtons: boolean (Share Buttons)
    - contentWarning: string (Content Warning)
```

**Features:**
- Per-post content controls
- Accessibility options
- Social media integration
- Content moderation support

### 7. SEO Optimization

**Configuration:**
```yaml
seo:
  widget: 'object'
  collapsed: true
  fields:
    - title: SEO Title
    - description: Meta Description
    - keywords: Keywords list
    - canonical: Canonical URL
    - noindex: No Index flag
```

**Features:**
- Search engine optimization
- Social media previews
- Canonical URL management
- Index control

### 8. Priority and Featured Content

**Priority Configuration:**
```yaml
priority:
  widget: 'select'
  options:
    - { label: 'Low', value: 'low' }
    - { label: 'Medium', value: 'medium' }
    - { label: 'High', value: 'high' }
  default: 'medium'
```

**Featured Configuration:**
```yaml
featured:
  widget: 'boolean'
  default: false
  hint: 'Mark as featured to highlight on homepage'
```

## Implementation Examples

### Example Frontmatter Output

```yaml
---
title: 'Advanced Web Development Techniques'
seoTitle: 'Advanced Web Development Techniques | Complete Guide 2024'
slug: 'advanced-web-development-techniques'
date: '2024-01-15T10:00:00Z'
lastModified: '2024-01-16T14:30:00Z'
status: 'published'
featured: true
priority: 'high'
author: 'john-doe'
category: 'Web Development'
tags:
  - 'javascript'
  - 'frontend'
  - 'best-practices'
excerpt: 'Explore advanced techniques for modern web development including performance optimization, accessibility, and cutting-edge frameworks.'
readingTime: '12 minutes'
contentSettings:
  toc: true
  comments: true
  shareButtons: true
  contentWarning: null
seo:
  title: 'Advanced Web Development Techniques | Complete Guide 2024'
  description: 'Master advanced web development with our comprehensive guide covering performance, accessibility, and modern frameworks.'
  keywords:
    - 'web development'
    - 'javascript'
    - 'performance optimization'
  canonical: 'https://all-things-digital.pages.dev/blog/advanced-web-development-techniques'
  noindex: false
---
```

## Best Practices

### 1. Slug Management
- Use descriptive, keyword-rich slugs
- Keep slugs under 60 characters
- Avoid special characters and spaces
- Consider SEO implications

### 2. Author Management
- Create author profiles before writing posts
- Use consistent author information
- Include author bios and social links
- Maintain author image consistency

### 3. Content Organization
- Use hierarchical categories
- Apply relevant tags consistently
- Set appropriate priority levels
- Maintain content status workflow

### 4. SEO Optimization
- Write unique meta descriptions
- Use targeted keywords naturally
- Set canonical URLs for duplicate content
- Optimize for social media sharing

### 5. Content Settings
- Enable TOC for long-form content
- Consider comment policies
- Use content warnings appropriately
- Optimize for accessibility

## Advanced Customizations

### Custom Field Types

You can extend the configuration with custom widgets:

```yaml
# Custom color picker for category colors
color:
  widget: 'color'
  default: '#3B82F6'

# Custom code editor for advanced users
customCSS:
  widget: 'code'
  default_language: 'css'
  required: false

# Custom relation for related posts
relatedPosts:
  widget: 'list'
  field:
    widget: 'relation'
    collection: 'blog'
    search_fields: ['title']
    value_field: 'slug'
    display_fields: ['title']
```

### Conditional Fields

Implement conditional logic for dynamic forms:

```yaml
# Show series fields only when series is selected
seriesFields:
  widget: 'object'
  condition:
    field: 'series'
    pattern: '.+'
  fields:
    - partNumber: number
    - totalParts: number
```

### Validation Rules

Add custom validation for data integrity:

```yaml
# Email validation for author contact
email:
  widget: 'string'
  pattern: ['^[^@]+@[^@]+\.[^@]+$', 'Please enter a valid email address']

# URL validation for external links
url:
  widget: 'string'
  pattern: ['^https?://.+', 'Please enter a valid URL starting with http:// or https://']
```

## Integration with Build Process

### Automatic Processing

The frontmatter values can be automatically processed during build:

1. **Slug Generation**: Auto-generate from title if empty
2. **Reading Time**: Calculate from content length
3. **Last Modified**: Update on content changes
4. **SEO Fields**: Generate from main content if empty

### Build Script Integration

```javascript
// Example build script integration
const processMarkdown = (content, frontmatter) => {
  // Auto-generate slug if empty
  if (!frontmatter.slug && frontmatter.title) {
    frontmatter.slug = generateSlug(frontmatter.title);
  }
  
  // Calculate reading time if empty
  if (!frontmatter.readingTime) {
    frontmatter.readingTime = calculateReadingTime(content);
  }
  
  // Update last modified
  frontmatter.lastModified = new Date().toISOString();
  
  return { content, frontmatter };
};
```

## Troubleshooting

### Common Issues

1. **Slug Conflicts**: Ensure unique slugs across all posts
2. **Author Not Found**: Verify author exists in authors collection
3. **Category Missing**: Create category before assigning to posts
4. **Date Format**: Use ISO 8601 format for dates
5. **Validation Errors**: Check pattern requirements for fields

### Debug Tips

- Use browser developer tools to inspect CMS forms
- Check console for validation errors
- Verify collection relationships are properly configured
- Test with minimal frontmatter first, then add complexity

## Conclusion

This enhanced frontmatter configuration provides a robust foundation for content management with Decap CMS. The combination of automatic generation, dropdown selections, and advanced customization options creates a powerful and user-friendly content creation experience.

For additional customizations, refer to the [Decap CMS documentation](https://decapcms.org/docs/) and consider your specific content workflow requirements.