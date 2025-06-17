# Structured Data Composables

This module provides Vue 3 composables for generating and injecting JSON-LD structured data into your application's HTML head. The composables are designed to work seamlessly with blog posts, articles, and website metadata to improve SEO and search engine understanding.

## Features

- **JSON-LD Generation**: Automatically generates valid JSON-LD structured data
- **NewsArticle Schema**: Specialized support for blog posts using Schema.org NewsArticle format
- **Organization Schema**: Support for website/organization structured data
- **Reactive Integration**: Works with Vue's reactive system and computed properties
- **Frontmatter Mapping**: Automatically maps blog post frontmatter to structured data fields
- **Multiple Authors**: Support for single or multiple authors
- **Multiple Images**: Support for single or multiple images with different aspect ratios
- **Accessibility Features**: Includes accessibility-related structured data properties

## Available Composables

### `useStructuredData(config)`

The base composable for generating custom JSON-LD structured data.

```javascript
import { useStructuredData } from '@/composables/useStructuredData';

useStructuredData({
  headline: 'Your Article Title',
  description: 'Article description',
  image: 'https://example.com/image.jpg',
  datePublished: '2024-01-05T08:00:00+08:00',
  author: {
    name: 'John Doe',
    url: 'https://example.com/profile/johndoe'
  }
});
```

### `useBlogPostStructuredData(post, options)`

Convenience composable specifically designed for blog posts. Automatically maps frontmatter fields to structured data.

```javascript
import { useBlogPostStructuredData } from '@/composables/useStructuredData';
import { computed } from 'vue';

// In your blog post component
useBlogPostStructuredData(
  computed(() => post.value),
  {
    baseUrl: 'https://www.yoursite.com',
    defaultPublisher: {
      name: 'Your Site Name',
      logo: 'https://www.yoursite.com/logo.png',
      url: 'https://www.yoursite.com'
    }
  }
);
```

### `useWebsiteStructuredData(config)`

Generates Organization schema for your website.

```javascript
import { useWebsiteStructuredData } from '@/composables/useStructuredData';

useWebsiteStructuredData({
  name: 'Your Organization',
  description: 'Organization description',
  url: 'https://www.yoursite.com',
  logo: 'https://www.yoursite.com/logo.png',
  sameAs: [
    'https://twitter.com/yourhandle',
    'https://linkedin.com/company/yourcompany'
  ]
});
```

## Configuration Options

### Blog Post Configuration

The `useBlogPostStructuredData` composable automatically maps these frontmatter fields:

| Frontmatter Field | JSON-LD Property | Description |
|------------------|------------------|-------------|
| `title` | `headline` | Article headline |
| `seoTitle` | `headline` | Alternative headline (takes priority) |
| `excerpt` | `description` | Article description |
| `description` | `description` | Alternative description |
| `featuredImage.src` | `image` | Primary article image |
| `images` | `image` | Additional images array |
| `date` | `datePublished` | Publication date |
| `lastModified` | `dateModified` | Last modification date |
| `author` | `author` | Author information |
| `authors` | `author` | Multiple authors array |
| `category` | `articleSection` | Article category |
| `categories[0]` | `articleSection` | First category if multiple |
| `tags` | `keywords` | Article tags |
| `wordCount` | `wordCount` | Article word count |
| `language` | `inLanguage` | Content language |
| `genre` | `genre` | Article genre |

### Author Format

Authors can be specified as strings or objects:

```javascript
// String format
author: 'John Doe'

// Object format
author: {
  name: 'John Doe',
  url: 'https://example.com/profile/johndoe',
  image: 'https://example.com/avatar.jpg',
  jobTitle: 'Senior Developer',
  worksFor: 'Tech Company'
}

// Multiple authors
authors: [
  { name: 'John Doe', url: 'https://example.com/profile/johndoe' },
  { name: 'Jane Smith', url: 'https://example.com/profile/janesmith' }
]
```

### Image Format

Images support multiple formats and aspect ratios:

```javascript
// Single image
image: 'https://example.com/image.jpg'

// Multiple images with different aspect ratios
images: [
  'https://example.com/photos/1x1/photo.jpg',
  'https://example.com/photos/4x3/photo.jpg',
  'https://example.com/photos/16x9/photo.jpg'
]
```

## Generated JSON-LD Example

The composables generate JSON-LD markup like this:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Your Article Title",
  "description": "Article description",
  "image": [
    "https://example.com/photos/1x1/photo.jpg",
    "https://example.com/photos/4x3/photo.jpg",
    "https://example.com/photos/16x9/photo.jpg"
  ],
  "datePublished": "2024-01-05T08:00:00+08:00",
  "dateModified": "2024-02-05T09:20:00+08:00",
  "author": [
    {
      "@type": "Person",
      "name": "Jane Doe",
      "url": "https://example.com/profile/janedoe123"
    },
    {
      "@type": "Person",
      "name": "John Doe",
      "url": "https://example.com/profile/johndoe123"
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Your Site Name",
    "logo": "https://www.yoursite.com/logo.png",
    "url": "https://www.yoursite.com"
  },
  "url": "https://www.yoursite.com/blog/article-slug",
  "mainEntityOfPage": "https://www.yoursite.com/blog/article-slug",
  "articleSection": "Technology",
  "keywords": "javascript, vue, structured data",
  "wordCount": 1500,
  "inLanguage": "en",
  "genre": "Technology"
}
</script>
```

## Integration Examples

### Blog Post Component

```vue
<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <div v-html="post.content"></div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useBlogPostStructuredData } from '@/composables/useStructuredData';
import { useArticleSEO } from '@/composables/useSEO';

const props = defineProps(['post']);

// SEO Meta Tags
useArticleSEO({
  title: computed(() => props.post?.title),
  description: computed(() => props.post?.excerpt),
  // ... other SEO options
});

// JSON-LD Structured Data
useBlogPostStructuredData(
  computed(() => props.post),
  {
    baseUrl: 'https://www.yoursite.com',
    defaultPublisher: {
      name: 'Your Site Name',
      logo: 'https://www.yoursite.com/logo.png',
      url: 'https://www.yoursite.com'
    }
  }
);
</script>
```

### Home Page with Organization Data

```vue
<script setup>
import { useWebsiteStructuredData } from '@/composables/useStructuredData';

useWebsiteStructuredData({
  name: 'Your Company',
  description: 'We create amazing web experiences',
  url: 'https://www.yoursite.com',
  logo: 'https://www.yoursite.com/logo.png',
  sameAs: [
    'https://twitter.com/yourhandle',
    'https://linkedin.com/company/yourcompany',
    'https://github.com/yourorganization'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    'telephone': '+1-555-123-4567',
    'contactType': 'Customer Service'
  }
});
</script>
```

## Advanced Features

### Accessibility Support

The composables support accessibility-related structured data:

```javascript
useStructuredData({
  // ... other properties
  accessibilityFeature: ['alternativeText', 'readingOrder'],
  accessibilityHazard: 'none',
  accessibilitySummary: 'This article is fully accessible with screen readers'
});
```

### Custom Overrides

You can override any automatically mapped field:

```javascript
useBlogPostStructuredData(
  computed(() => post.value),
  {
    baseUrl: 'https://www.yoursite.com',
    // Override the genre for all posts
    genre: 'Technical Tutorial',
    // Override the publisher
    publisher: {
      name: 'Custom Publisher',
      logo: 'https://custom.com/logo.png'
    }
  }
);
```

## Benefits

1. **SEO Enhancement**: Improves search engine understanding of your content
2. **Rich Snippets**: Enables rich search results with enhanced information
3. **Social Media**: Better content representation when shared on social platforms
4. **Voice Search**: Optimizes content for voice search queries
5. **Knowledge Graph**: Helps search engines build knowledge graphs
6. **Automated**: Reduces manual work by automatically mapping frontmatter data
7. **Type Safety**: Works with TypeScript for better development experience
8. **Reactive**: Automatically updates when post data changes

## Schema.org Compliance

All generated structured data follows Schema.org standards and is validated against the official schemas. The composables use the NewsArticle type for blog posts, which is recommended by Google for article content.

## Migration from Manual JSON-LD

If you're currently using manual JSON-LD scripts, you can easily migrate:

**Before:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "{{ post.title }}",
  // ... manual mapping
}
</script>
```

**After:**
```javascript
import { useBlogPostStructuredData } from '@/composables/useStructuredData';

useBlogPostStructuredData(computed(() => post.value));
```

The composable handles all the mapping automatically and ensures consistency across your site.