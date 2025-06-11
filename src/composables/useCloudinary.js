import { Cloudinary } from '@cloudinary/url-gen';
import { computed } from 'vue';

// Initialize Cloudinary instance for browser use
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'
  }
});

/**
 * Vue composable for Cloudinary image optimization
 * @param {string|Ref} src - Image source (public ID or URL)
 * @returns {Object} - Reactive Cloudinary utilities
 */
export function useCloudinary(src) {
  // Check if source is a Cloudinary public ID
  const isPublicId = computed(() => {
    const source = src.value || src;
    return typeof source === 'string' && !source.startsWith('http') && !source.startsWith('/');
  });

  // Generate optimized URL
  const optimizedUrl = computed(() => {
    const source = src.value || src;
    if (isPublicId.value) {
      return cld.image(source).format('auto').quality('auto').toURL();
    }
    return source;
  });

  // Thumbnail generator
  const thumbnail = computed(() => {
    return (size = 150, options = {}) => {
      const source = src.value || src;
      if (isPublicId.value) {
        return cld.image(source)
          .resize(`w_${size},h_${size},c_thumb,g_face`)
          .format('auto')
          .quality('auto')
          .toURL();
      }
      return source;
    };
  });

  // Responsive image generator
  const responsive = computed(() => {
    return (width, height = null, options = {}) => {
      const source = src.value || src;
      if (isPublicId.value) {
        let transformation = cld.image(source).resize(`w_${width}`);
        if (height) {
          transformation = transformation.resize(`w_${width},h_${height},c_fill,g_auto`);
        }
        return transformation.format('auto').quality('auto').toURL();
      }
      return source;
    };
  });

  // Hero image generator
  const hero = computed(() => {
    return (width = 1200, height = 630, options = {}) => {
      const source = src.value || src;
      if (isPublicId.value) {
        return cld.image(source)
          .resize(`w_${width},h_${height},c_fill,g_auto`)
          .format('auto')
          .quality('auto')
          .toURL();
      }
      return source;
    };
  });

  return {
    isPublicId,
    optimizedUrl,
    thumbnail,
    responsive,
    hero,
    cld
  };
}
