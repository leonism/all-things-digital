import { computed } from 'vue';
import {
  getCloudinaryUrl,
  getResponsiveImageUrl,
  getThumbnailUrl,
  getHeroImageUrl,
  getResponsiveSrcSet,
  getOptimizedImageUrl,
  isCloudinaryPublicId
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
    }
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
    thumbnail: { width: 150, height: 150 }
  };

  const authorImageSizes = {
    avatar: { width: 64, height: 64 },
    profile: { width: 128, height: 128 }
  };

  return {
    featuredImage,
    authorImage,
    
    // Convenience methods for common blog image sizes
    getFeaturedImageUrl: (size = 'card', options = {}) => {
      const { width, height } = featuredImageSizes[size] || featuredImageSizes.card;
      return featuredImage.value.responsive(width, height, options);
    },
    
    getAuthorImageUrl: (size = 'avatar', options = {}) => {
      const { width, height } = authorImageSizes[size] || authorImageSizes.avatar;
      return authorImage.value.responsive(width, height, options);
    },
    
    // Responsive srcsets for blog images
    getFeaturedImageSrcSet: (options = {}) => {
      return featuredImage.value.srcSet([400, 800, 1200], options);
    }
  };
}