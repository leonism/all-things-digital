# ☁️ Cloudinary Integration

This project includes a comprehensive Cloudinary integration for optimized image delivery, automatic format conversion, and responsive image generation. The integration provides significant performance improvements through CDN delivery and intelligent image optimization.

### Key Features

- **Automatic Optimization**: Auto-converts to WebP/AVIF when supported
- **Intelligent Quality**: Smart quality adjustment based on content
- **Responsive Images**: Multiple sizes for different devices and viewports
- **CDN Delivery**: Global content delivery network for faster loading
- **Vue Integration**: Seamless integration with Vue components through composables
- **Fallback Support**: Automatic fallback to original URLs when needed

### Prerequisites

1. **Cloudinary Account**: Sign up for a free account at [cloudinary.com](https://cloudinary.com)
2. **Node.js**: Ensure you have Node.js installed for running the upload script

### Quick Setup

#### 1. Configure Environment Variables

Create a `.env` file in your project root:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 2. Upload Images to Cloudinary

Run the upload script to migrate your existing images:

```bash
node scripts/upload-to-cloudinary.js
```

This script will:

- Upload all images from `src/assets/img/` to Cloudinary
- Generate optimized public IDs based on file paths
- Create a mapping file at `src/data/cloudinary-mapping.json`
- Organize images in folders (e.g., `blog/`, `icons/`)

#### 3. Update Your Content

Update your Markdown files and blog data to use Cloudinary public IDs:

**Before:**

```yaml
featuredImage:
  src: '/assets/img/featured-blog.jpg'
```

**After:**

```yaml
featuredImage:
  src: 'blog/featured-blog'
```

### Usage in Components

The integration provides Vue composables for easy image optimization:

```vue
<template>
  <img :src="optimizedImageUrl" alt="Optimized image" />
</template>

<script setup>
import { useCloudinary } from '@/composables/useCloudinary';

const props = defineProps(['imageSrc']);
const imageCloudinary = useCloudinary(computed(() => props.imageSrc));

const optimizedImageUrl = computed(() => {
  return imageCloudinary.responsive(800, 600, {
    c: 'fill',
    g: 'auto',
  });
});
</script>
```

### Available Utilities

The integration includes several utility functions in `src/utils/cloudinary.js`:

- `getOptimizedImageUrl()`: Basic optimization with auto format/quality
- `getResponsiveImageUrl()`: Responsive images with specific dimensions
- `getThumbnailUrl()`: Small thumbnails for avatars
- `getHeroImageUrl()`: Large hero images for headers
- `getResponsiveSrcSet()`: Multiple sizes for responsive images

### Performance Benefits

- **CDN Delivery**: Global content delivery network for faster loading
- **Format Optimization**: Automatic WebP/AVIF conversion when supported
- **Quality Adjustment**: Intelligent quality optimization
- **Bandwidth Reduction**: Significantly reduced bandwidth usage
- **Lazy Loading**: Built-in lazy loading support
- **Aggressive Caching**: Optimized caching for faster subsequent loads

### Transformation Options

- **Smart Cropping**: Automatic cropping with face detection
- **Responsive Sizing**: Maintain aspect ratio or fill dimensions
- **Visual Effects**: Blur, sharpen, brightness, contrast adjustments
- **Overlays**: Text, image, or logo overlays
- **Custom Transformations**: Extensive transformation API support

### Migration Checklist

- [ ] Set up Cloudinary account and get credentials
- [ ] Configure environment variables in `.env` file
- [ ] Run the upload script to migrate images
- [ ] Update Markdown frontmatter to use public IDs
- [ ] Update `blog-data.json` with new image references
- [ ] Test image loading across different pages
- [ ] Verify responsive behavior on various devices
- [ ] Check mobile performance and loading times
- [ ] Update any remaining hardcoded image paths

### Troubleshooting

**Common Issues:**

1. **Images not loading**: Verify public IDs match uploaded images
2. **Upload failures**: Check environment variables are correct
3. **Build errors**: Ensure all imports are properly configured

**Debugging:**
Enable debug mode by adding to your `.env`:

```env
CLOUDINARY_DEBUG=true
```

**Fallback Behavior:**
The system automatically falls back to original URLs if Cloudinary is unavailable or public IDs are not found.

### Best Practices

1. **Naming Convention**: Use descriptive public IDs (e.g., `blog/post-title-hero`)
2. **Folder Organization**: Group images by type (`blog/`, `icons/`, `avatars/`)
3. **Alt Text**: Always provide meaningful alt text for accessibility
4. **Responsive Images**: Use appropriate sizes for different viewports
5. **Lazy Loading**: Enable lazy loading for better performance

For detailed documentation, refer to the [Cloudinary documentation](https://cloudinary.com/documentation) and check the generated `cloudinary-mapping.json` file for image mappings.
