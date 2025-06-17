# SEO Composables

This directory contains reusable composables for managing SEO across the application.

## useSEO.js

A comprehensive SEO composable that provides centralized management of meta tags, Open Graph data, and Twitter Card information.

### Features

- **Centralized SEO Management**: All SEO logic in one place
- **Multiple Page Types**: Support for website, article, and listing pages
- **Automatic Meta Tag Generation**: Generates appropriate meta tags based on page type
- **Open Graph & Twitter Cards**: Full support for social media sharing
- **Structured Data**: Helper functions for JSON-LD structured data
- **Configurable**: Easy to customize site-wide settings

### Usage

#### Website Pages (Homepage, About, etc.)

```javascript
import { useWebsiteSEO } from '@/composables/useSEO';

useWebsiteSEO({
  title: 'Page Title',
  description: 'Page description for meta tags',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  canonicalPath: '/page-path',
  image: '/images/page-image.png'
});
```

#### Article/Blog Post Pages

```javascript
import { useArticleSEO } from '@/composables/useSEO';

useArticleSEO({
  title: computed(() => post.value?.title),
  description: computed(() => post.value?.description),
  canonicalPath: computed(() => `/blog/${post.value?.slug}`),
  image: computed(() => post.value?.featuredImage),
  author: computed(() => post.value?.author),
  publishedTime: computed(() => post.value?.datePublished),
  modifiedTime: computed(() => post.value?.dateModified),
  category: computed(() => post.value?.category),
  tags: computed(() => post.value?.tags || []),
  keywords: computed(() => post.value?.keywords || [])
});
```

#### Listing Pages (Categories, Tags, Archives)

```javascript
import { useListingSEO } from '@/composables/useSEO';

useListingSEO({
  title: computed(() => `${categoryName} Articles`),
  description: computed(() => `Browse articles in ${categoryName}`),
  canonicalPath: computed(() => `/category/${categorySlug}`),
  keywords: computed(() => [categoryName, 'articles', 'blog'])
});
```

### Configuration

The composable includes default site configuration that can be customized:

```javascript
const defaultSiteConfig = {
  siteName: 'DGPond.COM',
  baseUrl: 'https://all-things-digital.pages.dev',
  defaultImage: '/images/default-og-image.png',
  twitterHandle: '@YourTwitterHandle',
  language: 'en'
};
```

### Advanced Usage

For more control, you can use the main `useSEO` composable directly:

```javascript
import { useSEO } from '@/composables/useSEO';

const { applySEO, generateArticleStructuredData } = useSEO();

// Apply SEO
applySEO('article', {
  title: 'Article Title',
  description: 'Article description',
  // ... other config
});

// Generate structured data
const structuredData = generateArticleStructuredData({
  title: 'Article Title',
  description: 'Article description',
  author: { name: 'Author Name' },
  // ... other article data
});
```

### Generated Meta Tags

The composable automatically generates:

- **Basic Meta Tags**: title, description, keywords, author
- **Open Graph**: og:title, og:description, og:type, og:url, og:image, og:site_name
- **Twitter Cards**: twitter:card, twitter:title, twitter:description, twitter:image
- **Article-specific**: article:author, article:published_time, article:modified_time, article:section, article:tag
- **Canonical URLs**: Proper canonical link tags
- **Language**: HTML lang attribute

### Benefits

1. **Consistency**: Ensures all pages follow the same SEO patterns
2. **Maintainability**: Changes to SEO structure only need to be made in one place
3. **Type Safety**: When used with TypeScript, provides better type checking
4. **Performance**: Optimized for Vue 3's reactivity system
5. **Flexibility**: Easy to extend for new page types or requirements

### Migration from useHead

If you're migrating from direct `useHead` usage:

**Before:**
```javascript
import { useHead } from '@unhead/vue';

useHead({
  title: 'Page Title',
  meta: [
    { name: 'description', content: 'Page description' },
    { property: 'og:title', content: 'Page Title' },
    // ... many more meta tags
  ],
  link: [
    { rel: 'canonical', href: 'https://example.com/page' }
  ]
});
```

**After:**
```javascript
import { useWebsiteSEO } from '@/composables/useSEO';

useWebsiteSEO({
  title: 'Page Title',
  description: 'Page description',
  canonicalPath: '/page'
});
```

This reduces boilerplate code significantly while ensuring consistency across the application.