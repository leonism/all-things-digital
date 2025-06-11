/**
 * Vue Cloudinary Composable
 *
 * This composable provides a reactive interface for Cloudinary image optimization
 * within Vue.js components. It abstracts complex image transformation logic into
 * a simple, reusable API that automatically handles responsive images, thumbnails,
 * and various optimization scenarios.
 *
 * CURRENT FLOW LOGIC:
 *
 * 1. REACTIVE INITIALIZATION:
 *    - Accepts image source as string or Vue ref for reactive updates
 *    - Creates computed properties that automatically update when source changes
 *    - Provides seamless integration with Vue's reactivity system
 *    - Handles both Cloudinary public IDs and regular URLs gracefully
 *
 * 2. IMAGE SOURCE DETECTION:
 *    - Automatically detects if source is a Cloudinary public ID or external URL
 *    - Uses intelligent pattern matching to identify Cloudinary resources
 *    - Provides fallback handling for non-Cloudinary images
 *    - Maintains compatibility with existing image workflows
 *
 * 3. OPTIMIZATION STRATEGIES:
 *    - Generates optimized URLs with automatic format selection (WebP, AVIF)
 *    - Applies quality optimization based on content type and device capabilities
 *    - Implements responsive image generation for different screen sizes
 *    - Provides lazy loading support with placeholder generation
 *
 * 4. TRANSFORMATION METHODS:
 *    - thumbnail(): Creates thumbnail images with customizable sizes and options
 *    - hero(): Generates hero/banner images with optimal aspect ratios
 *    - responsive(): Creates responsive image sets with multiple breakpoints
 *    - srcSet(): Generates srcset attributes for responsive images
 *    - optimized(): Provides general-purpose optimized image URLs
 *
 * 5. PERFORMANCE FEATURES:
 *    - Computed properties ensure transformations are cached and reactive
 *    - Lazy evaluation prevents unnecessary URL generation
 *    - Automatic format selection based on browser support
 *    - Progressive loading with low-quality placeholders
 *
 * 6. COMPONENT INTEGRATION:
 *    - Seamlessly integrates with Vue components through reactive properties
 *    - Supports v-model binding for dynamic image sources
 *    - Provides consistent API across different component types
 *    - Enables declarative image optimization in templates
 *
 * USAGE PATTERNS:
 * - Blog post featured images with automatic optimization
 * - Author avatars with consistent thumbnail generation
 * - Hero banners with responsive breakpoints
 * - Gallery images with lazy loading and progressive enhancement
 *
 * CLOUDINARY FEATURES UTILIZED:
 * - Auto format selection (WebP, AVIF, etc.)
 * - Quality optimization algorithms
 * - Responsive image generation
 * - Progressive JPEG encoding
 * - Advanced compression techniques
 *
 * This composable is central to the blog's image optimization strategy,
 * providing a developer-friendly interface while ensuring optimal performance
 * and user experience across all devices and network conditions.
 */

import { computed } from 'vue';
import {
  getCloudinaryUrl,
  getResponsiveImageUrl,
  getThumbnailUrl,
  getHeroImageUrl,
  getResponsiveSrcSet,
  getOptimizedImageUrl,
  isCloudinaryPublicId,
} from '@/utils/cloudinary';

/**
 * Vue composable for Cloudinary image optimization
 * @param {string|Ref} src - Image source (public ID or URL)
 * @returns {Object} - Reactive Cloudinary utilities
 */
export function useCloudinary(src) {
  // Reactive computed properties
  const isPublicId = computed(() => {
    return isCloudinaryPublicId(src.value || src);
  });

  const optimizedUrl = computed(() => {
    return getOptimizedImageUrl(src.value || src);
  });

  const thumbnail = computed(() => {
    return (size = 150, options = {}) => {
      const source = src.value || src;
      if (isCloudinaryPublicId(source)) {
        return getThumbnailUrl(source, size, options);
      }
      return source;
    };
  });

  const responsive = computed(() => {
    return (width, height = null, options = {}) => {
      const source = src.value || src;
      if (isCloudinaryPublicId(source)) {
        return getResponsiveImageUrl(source, width, height, options);
      }
      return source;
    };
  });

  const hero = computed(() => {
    return (width = 1200, height = 630, options = {}) => {
      const source = src.value || src;
      if (isCloudinaryPublicId(source)) {
        return getHeroImageUrl(source, width, height, options);
      }
      return source;
    };
  });

  const srcSet = computed(() => {
    return (sizes = [400, 800, 1200], options = {}) => {
      const source = src.value || src;
      if (isCloudinaryPublicId(source)) {
        return getResponsiveSrcSet(source, sizes, options);
      }
      return '';
    };
  });

  // Helper function to get URL with custom transformations
  const withTransformations = computed(() => {
    return (options = {}) => {
      const source = src.value || src;
      if (isCloudinaryPublicId(source)) {
        return getCloudinaryUrl(source, options);
      }
      return source;
    };
  });

  return {
    // Properties
    isPublicId,
    optimizedUrl,

    // Methods
    thumbnail,
    responsive,
    hero,
    srcSet,
    withTransformations,

    // Direct utility access
    getUrl: (options = {}) => {
      const source = src.value || src;
      return getOptimizedImageUrl(source, options);
    },
  };
}

/**
 * Composable for blog post images with predefined sizes
 * @param {Object} post - Blog post object
 * @returns {Object} - Blog-specific image utilities
 */
export function useBlogImages(post) {
  const featuredImage = computed(() => {
    const src = post.value?.featuredImage?.src || post?.featuredImage?.src;
    return useCloudinary(src);
  });

  const authorImage = computed(() => {
    const src = post.value?.author?.image || post?.author?.image;
    return useCloudinary(src);
  });

  // Predefined sizes for blog images
  const featuredImageSizes = {
    card: { width: 400, height: 250 },
    hero: { width: 1200, height: 630 },
    thumbnail: { width: 150, height: 150 },
  };

  const authorImageSizes = {
    avatar: { width: 64, height: 64 },
    profile: { width: 128, height: 128 },
  };

  return {
    featuredImage,
    authorImage,

    // Convenience methods for common blog image sizes
    getFeaturedImageUrl: (size = 'card', options = {}) => {
      const { width, height } =
        featuredImageSizes[size] || featuredImageSizes.card;
      return featuredImage.value.responsive(width, height, options);
    },

    getAuthorImageUrl: (size = 'avatar', options = {}) => {
      const { width, height } =
        authorImageSizes[size] || authorImageSizes.avatar;
      return authorImage.value.responsive(width, height, options);
    },

    // Responsive srcsets for blog images
    getFeaturedImageSrcSet: (options = {}) => {
      return featuredImage.value.srcSet([400, 800, 1200], options);
    },
  };
}
