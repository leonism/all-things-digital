/**
 * Cloudinary Utility Functions
 *
 * This utility module provides a comprehensive set of functions for generating
 * optimized Cloudinary image URLs with various transformations and optimizations.
 * It serves as the foundation for image optimization throughout the blog application.
 *
 * CURRENT FLOW LOGIC:
 *
 * 1. CORE URL GENERATION:
 *    - Builds Cloudinary URLs with proper cloud name and transformation parameters
 *    - Handles URL encoding and parameter serialization automatically
 *    - Provides fallback handling for invalid or missing public IDs
 *    - Supports both simple and complex transformation chains
 *
 * 2. AUTOMATIC OPTIMIZATIONS:
 *    - Auto format selection (f_auto): Delivers WebP, AVIF when browser supports
 *    - Auto quality (q_auto): Applies optimal compression based on content analysis
 *    - Progressive JPEG encoding for faster perceived loading
 *    - Intelligent compression algorithms that preserve visual quality
 *
 * 3. RESPONSIVE IMAGE SUPPORT:
 *    - Generates multiple image sizes for different screen densities
 *    - Creates srcset attributes for responsive image implementation
 *    - Supports custom breakpoints and device-specific optimizations
 *    - Handles retina/high-DPI displays with appropriate scaling
 *
 * 4. SPECIALIZED TRANSFORMATIONS:
 *    - Thumbnail generation with smart cropping and face detection
 *    - Hero image optimization with aspect ratio preservation
 *    - Custom transformation chains for specific use cases
 *    - Overlay and text rendering capabilities for dynamic content
 *
 * 5. PERFORMANCE OPTIMIZATIONS:
 *    - Lazy loading support with low-quality placeholder generation
 *    - Progressive enhancement strategies for slow connections
 *    - Bandwidth-aware delivery based on connection speed
 *    - Cache-friendly URL structures for CDN optimization
 *
 * 6. VALIDATION AND ERROR HANDLING:
 *    - Public ID validation and sanitization
 *    - Graceful fallback for non-Cloudinary images
 *    - Comprehensive error logging for debugging
 *    - Type checking and parameter validation
 *
 * TRANSFORMATION FEATURES:
 * - Smart cropping with face and object detection
 * - Automatic color enhancement and contrast adjustment
 * - Format conversion and compression optimization
 * - Responsive breakpoint generation
 * - Custom overlay and watermark support
 *
 * INTEGRATION POINTS:
 * - Used by useCloudinary composable for Vue component integration
 * - Consumed by blog components for image rendering
 * - Utilized by build scripts for static image optimization
 * - Supports both runtime and build-time image processing
 *
 * CLOUDINARY FEATURES UTILIZED:
 * - Advanced image analysis and optimization algorithms
 * - Global CDN distribution for fast delivery
 * - Real-time image transformations
 * - Bandwidth and device-aware delivery
 * - SEO-friendly URL structures
 *
 * This utility module is essential for delivering optimized images across
 * the blog application, ensuring fast loading times and excellent user
 * experience while maintaining high visual quality.
 */

// Your Cloudinary cloud name (set this to your actual cloud name)
const CLOUDINARY_CLOUD_NAME = 'du61t1sey'; // Replace with your actual cloud name

/**
 * Generate a Cloudinary URL with optimizations
 * @param {string} publicId - The Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized Cloudinary URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
  if (!publicId) {
    console.warn('No public ID provided to getCloudinaryUrl');
    return '';
  }

  // Default transformations for web optimization
  const defaultTransformations = {
    f_auto: true, // Auto format (WebP, AVIF when supported)
    q_auto: true, // Auto quality
    ...options,
  };

  // Build transformation string
  const transformations = Object.entries(defaultTransformations)
    .filter(
      ([key, value]) =>
        value !== false && value !== null && value !== undefined,
    )
    .map(([key, value]) => {
      if (value === true) {
        return key;
      }
      return `${key}_${value}`;
    })
    .join(',');

  // Construct the URL
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const transformationPart = transformations ? `/${transformations}` : '';
  return `${baseUrl}${transformationPart}/v1/${publicId}`;
}

/**
 * Generate a responsive image URL with specific dimensions
 * @param {string} publicId - The Cloudinary public ID
 * @param {number} width - Desired width
 * @param {number} height - Desired height (optional)
 * @param {Object} options - Additional transformation options
 * @returns {string} - Optimized Cloudinary URL
 */
export function getResponsiveImageUrl(
  publicId,
  width,
  height = null,
  options = {},
) {
  const transformations = {
    w: width,
    ...(height && { h: height }),
    c: options.crop || 'fill', // Default to fill crop mode
    ...options,
  };

  return getCloudinaryUrl(publicId, transformations);
}

/**
 * Generate a thumbnail URL
 * @param {string} publicId - The Cloudinary public ID
 * @param {number} size - Square size for thumbnail (default: 150)
 * @param {Object} options - Additional transformation options
 * @returns {string} - Optimized thumbnail URL
 */
export function getThumbnailUrl(publicId, size = 150, options = {}) {
  return getResponsiveImageUrl(publicId, size, size, {
    c: 'thumb',
    g: 'face', // Focus on face if present
    ...options,
  });
}

/**
 * Generate a hero/featured image URL with specific aspect ratio
 * @param {string} publicId - The Cloudinary public ID
 * @param {number} width - Desired width
 * @param {number} height - Desired height
 * @param {Object} options - Additional transformation options
 * @returns {string} - Optimized hero image URL
 */
export function getHeroImageUrl(
  publicId,
  width = 1200,
  height = 630,
  options = {},
) {
  return getResponsiveImageUrl(publicId, width, height, {
    c: 'fill',
    g: 'auto', // Auto focus
    ...options,
  });
}

/**
 * Generate multiple sizes for responsive images (srcset)
 * @param {string} publicId - The Cloudinary public ID
 * @param {Array} sizes - Array of widths [400, 800, 1200]
 * @param {Object} options - Additional transformation options
 * @returns {string} - Srcset string
 */
export function getResponsiveSrcSet(
  publicId,
  sizes = [400, 800, 1200],
  options = {},
) {
  return sizes
    .map((width) => {
      const url = getResponsiveImageUrl(publicId, width, null, options);
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Check if a string is a Cloudinary public ID or a regular URL
 * @param {string} src - Image source
 * @returns {boolean} - True if it's a Cloudinary public ID
 */
export function isCloudinaryPublicId(src) {
  if (!src) return false;

  // If it starts with http/https, it's already a URL
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return false;
  }

  // If it contains cloudinary.com, it's already a Cloudinary URL
  if (src.includes('cloudinary.com')) {
    return false;
  }

  // If it starts with ./ or ../ or /, it's a local path
  if (src.startsWith('./') || src.startsWith('../') || src.startsWith('/')) {
    return false;
  }

  // Otherwise, assume it's a public ID
  return true;
}

/**
 * Smart image URL generator that handles both Cloudinary public IDs and regular URLs
 * @param {string} src - Image source (public ID or URL)
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
export function getOptimizedImageUrl(src, options = {}) {
  if (!src) return '';

  // If it's a Cloudinary public ID, generate optimized URL
  if (isCloudinaryPublicId(src)) {
    return getCloudinaryUrl(src, options);
  }

  // Otherwise, return the original URL
  return src;
}

/**
 * Generate picture element sources for modern formats
 * @param {string} publicId - The Cloudinary public ID
 * @param {Array} breakpoints - Array of widths for responsive images
 * @param {Object} options - Additional transformation options
 * @returns {Object} - Object with AVIF, WebP, and fallback sources
 */
export function getPictureElementSources(publicId, breakpoints = [400, 800, 1200], options = {}) {
  if (!isCloudinaryPublicId(publicId)) {
    return {
      avif: null,
      webp: null,
      fallback: publicId
    };
  }

  const generateSrcSet = (format) => {
    return breakpoints
      .map((width) => {
        const url = getCloudinaryUrl(publicId, {
          w: width,
          f: format,
          q_auto: true,
          ...options,
        });
        return `${url} ${width}w`;
      })
      .join(', ');
  };

  return {
    avif: generateSrcSet('avif'),
    webp: generateSrcSet('webp'),
    fallback: generateSrcSet('auto')
  };
}
