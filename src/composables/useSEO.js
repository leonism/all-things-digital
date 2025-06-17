import { computed, unref } from 'vue';
import { useHead } from '@unhead/vue';

/**
 * SEO Composable for managing meta tags, Open Graph, and Twitter Card data
 * 
 * This composable provides a centralized way to handle SEO across the application.
 * It supports different page types (website, article) and automatically generates
 * appropriate meta tags based on the provided configuration.
 */
export function useSEO(config = {}) {
  // Default site configuration
  const defaultSiteConfig = {
    siteName: 'DGPond.COM',
    baseUrl: 'https://all-things-digital.pages.dev',
    defaultImage: '/images/default-og-image.png',
    twitterHandle: '@YourTwitterHandle', // Update with actual handle
    language: 'en'
  };

  // Merge with provided config
  const siteConfig = { ...defaultSiteConfig, ...config.site };

  /**
   * Generate SEO meta tags for a website page
   * @param {Object} pageConfig - Page-specific configuration
   * @returns {Object} - SEO configuration object
   */
  function generateWebsiteSEO(pageConfig) {
    const {
      title: titleRef,
      description: descriptionRef,
      keywords: keywordsRef = [],
      canonicalPath: canonicalPathRef = '',
      image: imageRef = siteConfig.defaultImage,
      author: authorRef = siteConfig.siteName
    } = pageConfig;

    // Resolve reactive values
    const title = unref(titleRef);
    const description = unref(descriptionRef);
    const keywords = unref(keywordsRef);
    const canonicalPath = unref(canonicalPathRef);
    const image = unref(imageRef);
    const author = unref(authorRef);

    const fullTitle = title.includes(siteConfig.siteName) ? title : `${title} | ${siteConfig.siteName}`;
    const canonicalUrl = `${siteConfig.baseUrl}${canonicalPath}`;
    const fullImageUrl = image.startsWith('http') ? image : `${siteConfig.baseUrl}${image}`;

    return {
      title: fullTitle,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: Array.isArray(keywords) ? keywords.join(', ') : keywords },
        { name: 'author', content: author },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: fullImageUrl },
        { property: 'og:site_name', content: siteConfig.siteName },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: fullImageUrl },
        ...(siteConfig.twitterHandle ? [{ name: 'twitter:site', content: siteConfig.twitterHandle }] : [])
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      htmlAttrs: {
        lang: siteConfig.language
      }
    };
  }

  /**
   * Generate SEO meta tags for an article/blog post
   * @param {Object} articleConfig - Article-specific configuration
   * @returns {Object} - SEO configuration object
   */
  function generateArticleSEO(articleConfig) {
    const {
      title: titleRef,
      description: descriptionRef,
      canonicalPath: canonicalPathRef = '',
      image: imageRef = siteConfig.defaultImage,
      author: authorRef = {},
      publishedTime: publishedTimeRef,
      modifiedTime: modifiedTimeRef,
      category: categoryRef,
      tags: tagsRef = [],
      keywords: keywordsRef = [],
      robots: robotsRef = 'index, follow'
    } = articleConfig;

    // Resolve reactive values
    const title = unref(titleRef);
    const description = unref(descriptionRef);
    const canonicalPath = unref(canonicalPathRef);
    const image = unref(imageRef);
    const author = unref(authorRef);
    const publishedTime = unref(publishedTimeRef);
    const modifiedTime = unref(modifiedTimeRef);
    const category = unref(categoryRef);
    const tags = unref(tagsRef);
    const keywords = unref(keywordsRef);
    const robots = unref(robotsRef);

    const fullTitle = title.includes(siteConfig.siteName) ? title : `${title} | ${siteConfig.siteName}`;
    const canonicalUrl = `${siteConfig.baseUrl}${canonicalPath}`;
    const fullImageUrl = image.startsWith('http') ? image : `${siteConfig.baseUrl}${image}`;
    
    // Combine tags and keywords for meta keywords
    const allKeywords = [...new Set([...tags, ...keywords])];

    return {
      title: fullTitle,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: allKeywords.join(', ') },
        { name: 'robots', content: robots },
        { name: 'author', content: author.name || siteConfig.siteName },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: fullImageUrl },
        { property: 'og:site_name', content: siteConfig.siteName },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: fullImageUrl },
        ...(siteConfig.twitterHandle ? [{ name: 'twitter:site', content: siteConfig.twitterHandle }] : []),
        ...(author.twitter ? [{ name: 'twitter:creator', content: author.twitter }] : []),
        // Article-specific meta tags
        ...(author.name ? [{ property: 'article:author', content: author.name }] : []),
        ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
        ...(modifiedTime ? [{ property: 'article:modified_time', content: modifiedTime }] : []),
        ...(category ? [{ property: 'article:section', content: category }] : []),
        // Article tags
        ...tags.map(tag => ({ property: 'article:tag', content: tag }))
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      htmlAttrs: {
        lang: siteConfig.language
      }
    };
  }

  /**
   * Generate SEO meta tags for a listing page (categories, tags, etc.)
   * @param {Object} listingConfig - Listing page configuration
   * @returns {Object} - SEO configuration object
   */
  function generateListingSEO(listingConfig) {
    const {
      title: titleRef,
      description: descriptionRef,
      canonicalPath: canonicalPathRef = '',
      image: imageRef = siteConfig.defaultImage,
      keywords: keywordsRef = [],
      robots: robotsRef = 'index, follow'
    } = listingConfig;

    // Resolve reactive values
    const title = unref(titleRef);
    const description = unref(descriptionRef);
    const canonicalPath = unref(canonicalPathRef);
    const image = unref(imageRef);
    const keywords = unref(keywordsRef);
    const robots = unref(robotsRef);

    const fullTitle = title.includes(siteConfig.siteName) ? title : `${title} | ${siteConfig.siteName}`;
    const canonicalUrl = `${siteConfig.baseUrl}${canonicalPath}`;
    const fullImageUrl = image.startsWith('http') ? image : `${siteConfig.baseUrl}${image}`;

    return {
      title: fullTitle,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: Array.isArray(keywords) ? keywords.join(', ') : keywords },
        { name: 'robots', content: robots },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: fullImageUrl },
        { property: 'og:site_name', content: siteConfig.siteName },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: fullImageUrl },
        ...(siteConfig.twitterHandle ? [{ name: 'twitter:site', content: siteConfig.twitterHandle }] : [])
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      htmlAttrs: {
        lang: siteConfig.language
      }
    };
  }

  /**
   * Apply SEO configuration using useHead
   * @param {string} type - SEO type ('website', 'article', 'listing')
   * @param {Object} config - Configuration object
   */
  function applySEO(type, config) {
    let seoConfig;
    
    switch (type) {
      case 'article':
        seoConfig = generateArticleSEO(config);
        break;
      case 'listing':
        seoConfig = generateListingSEO(config);
        break;
      case 'website':
      default:
        seoConfig = generateWebsiteSEO(config);
        break;
    }

    // Apply the SEO configuration
    useHead(seoConfig);
    
    // Also update document title and meta description for immediate client-side updates
    if (typeof document !== 'undefined') {
      if (seoConfig.title) {
        document.title = typeof seoConfig.title === 'function' ? seoConfig.title() : seoConfig.title;
      }
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && seoConfig.meta) {
        const descriptionMeta = seoConfig.meta.find(meta => meta.name === 'description');
        if (descriptionMeta) {
          metaDescription.setAttribute('content', descriptionMeta.content);
        }
      }
    }
    
    return seoConfig;
  }

  /**
   * Generate structured data for articles
   * @param {Object} articleData - Article data
   * @returns {Object} - JSON-LD structured data
   */
  function generateArticleStructuredData(articleData) {
    const {
      title,
      description,
      author = {},
      publishedTime,
      modifiedTime,
      image,
      canonicalPath,
      category,
      tags = []
    } = articleData;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: image?.startsWith('http') ? image : `${siteConfig.baseUrl}${image}`,
      author: {
        '@type': 'Person',
        name: author.name || siteConfig.siteName,
        url: author.link ? `${siteConfig.baseUrl}${author.link}` : siteConfig.baseUrl
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${siteConfig.baseUrl}/images/logo.png`
        }
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteConfig.baseUrl}${canonicalPath}`
      },
      articleSection: category,
      keywords: tags.join(', ')
    };
  }

  return {
    // Main functions
    applySEO,
    generateWebsiteSEO,
    generateArticleSEO,
    generateListingSEO,
    generateArticleStructuredData,
    
    // Site configuration
    siteConfig,
    
    // Computed helpers
    createCanonicalUrl: (path) => computed(() => `${siteConfig.baseUrl}${path}`),
    createFullImageUrl: (imagePath) => computed(() => 
      imagePath?.startsWith('http') ? imagePath : `${siteConfig.baseUrl}${imagePath}`
    )
  };
}

/**
 * Convenience function for website pages
 */
export function useWebsiteSEO(config) {
  const { applySEO } = useSEO(config.site);
  return applySEO('website', config);
}

/**
 * Convenience function for article pages
 */
export function useArticleSEO(config) {
  const { applySEO } = useSEO(config.site);
  return applySEO('article', config);
}

/**
 * Convenience function for listing pages
 */
export function useListingSEO(config) {
  const { applySEO } = useSEO(config.site);
  return applySEO('listing', config);
}