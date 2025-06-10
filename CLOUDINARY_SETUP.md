# Cloudinary Integration Setup Guide

This guide explains how to set up and use the Cloudinary integration for optimized image delivery in your blog.

## Prerequisites

1. **Cloudinary Account**: Sign up for a free account at [cloudinary.com](https://cloudinary.com)
2. **Node.js**: Ensure you have Node.js installed for running the upload script

## Setup Steps

### 1. Install Dependencies

The Cloudinary SDK has already been added to the project:

```bash
npm install cloudinary
```

### 2. Configure Environment Variables

Create a `.env` file in your project root and add your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**To find these credentials:**
1. Log into your Cloudinary dashboard
2. Go to the "Dashboard" tab
3. Copy the Cloud Name, API Key, and API Secret

### 3. Upload Images to Cloudinary

Run the upload script to migrate your existing images:

```bash
node scripts/upload-to-cloudinary.js
```

This script will:
- Upload all images from `src/assets/img/` to Cloudinary
- Generate optimized public IDs based on file paths
- Create a mapping file at `src/data/cloudinary-mapping.json`
- Organize images in folders (e.g., `blog/`, `icons/`)

### 4. Update Markdown Frontmatter

After uploading, update your Markdown files to use Cloudinary public IDs instead of file paths.

**Before:**
```yaml
---
title: "My Blog Post"
featuredImage:
  src: "/assets/img/featured-blog.jpg"
  alt: "Featured image"
author:
  image: "/assets/img/avatar.png"
---
```

**After:**
```yaml
---
title: "My Blog Post"
featuredImage:
  src: "blog/featured-blog"
  alt: "Featured image"
author:
  image: "blog/avatar"
---
```

### 5. Update blog-data.json

Similarly, update the `blog-data.json` file to use Cloudinary public IDs:

**Before:**
```json
{
  "featuredImage": {
    "src": "/assets/img/featured-blog.jpg"
  }
}
```

**After:**
```json
{
  "featuredImage": {
    "src": "blog/featured-blog"
  }
}
```

## How It Works

### Cloudinary Utilities

The integration includes several utility functions in `src/utils/cloudinary.js`:

- `getOptimizedImageUrl()`: Basic optimization with auto format/quality
- `getResponsiveImageUrl()`: Responsive images with specific dimensions
- `getThumbnailUrl()`: Small thumbnails for avatars
- `getHeroImageUrl()`: Large hero images for headers
- `generateSrcSet()`: Multiple sizes for responsive images

### Vue Composables

The `useCloudinary` composable in `src/composables/useCloudinary.js` provides:

- Reactive image optimization
- Automatic fallback for non-Cloudinary URLs
- Easy integration with Vue components

### Component Integration

Components automatically use Cloudinary when you provide public IDs:

```vue
<template>
  <img :src="optimizedImageUrl" alt="Optimized image" />
</template>

<script setup>
import { useCloudinary } from '@/composables/useCloudinary'

const props = defineProps(['imageSrc'])
const imageCloudinary = useCloudinary(computed(() => props.imageSrc))

const optimizedImageUrl = computed(() => {
  return imageCloudinary.responsive(800, 600, {
    c: 'fill',
    g: 'auto'
  })
})
</script>
```

## Image Optimization Features

### Automatic Optimizations
- **Format**: Auto-converts to WebP/AVIF when supported
- **Quality**: Intelligent quality adjustment
- **Compression**: Lossless optimization
- **Responsive**: Multiple sizes for different devices

### Transformation Options
- **Cropping**: Smart cropping with face detection
- **Resizing**: Maintain aspect ratio or fill dimensions
- **Effects**: Blur, sharpen, brightness, contrast
- **Overlays**: Text, image, or logo overlays

### Performance Benefits
- **CDN Delivery**: Global content delivery network
- **Lazy Loading**: Built-in lazy loading support
- **Caching**: Aggressive caching for faster load times
- **Bandwidth**: Reduced bandwidth usage

## Troubleshooting

### Common Issues

1. **Images not loading**: Check that public IDs match uploaded images
2. **Upload failures**: Verify environment variables are correct
3. **Build errors**: Ensure all imports are correct

### Debugging

Enable debug mode by adding to your `.env`:
```env
CLOUDINARY_DEBUG=true
```

### Fallback Behavior

The system automatically falls back to original URLs if:
- Cloudinary is unavailable
- Public ID is not found
- Network issues occur

## Best Practices

1. **Naming Convention**: Use descriptive public IDs (e.g., `blog/post-title-hero`)
2. **Folder Organization**: Group images by type (`blog/`, `icons/`, `avatars/`)
3. **Alt Text**: Always provide meaningful alt text
4. **Responsive Images**: Use appropriate sizes for different viewports
5. **Lazy Loading**: Enable lazy loading for better performance

## Migration Checklist

- [ ] Set up Cloudinary account
- [ ] Configure environment variables
- [ ] Run upload script
- [ ] Update Markdown frontmatter
- [ ] Update blog-data.json
- [ ] Test image loading
- [ ] Verify responsive behavior
- [ ] Check mobile performance
- [ ] Update any hardcoded image paths

## Support

For issues or questions:
1. Check the [Cloudinary documentation](https://cloudinary.com/documentation)
2. Review the generated `cloudinary-mapping.json` file
3. Check browser console for errors
4. Verify network requests in DevTools

---

**Note**: After migration, you can safely remove the original images from `src/assets/img/` as they will be served from Cloudinary's CDN.