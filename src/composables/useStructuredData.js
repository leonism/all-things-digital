import { computed, unref } from 'vue';
import { useHead } from '@unhead/vue';
import { getCloudinaryUrl } from '@/utils/cloudinary';

/**
 * Composable for generating and injecting JSON-LD structured data
 * Supports NewsArticle schema and ImageObject schema for blog posts
 *
 * @param {Object} config - Configuration object for structured data
 * @returns {void}
 */
export function useStructuredData(config) {
  const structuredData = computed(() => {
    const {
      headline,
      description,
      image,
      images = [],
      datePublished,
      dateModified,
      author,
      authors = [],
      publisher,
      url,
      mainEntityOfPage,
      articleSection,
      keywords,
      wordCount,
      inLanguage = 'en',
      genre,
      accessibilityFeature,
      accessibilityHazard,
      accessibilitySummary,
    } = config;

    // Resolve reactive values
    const resolvedHeadline = unref(headline);
    const resolvedDescription = unref(description);
    const resolvedImage = unref(image);
    const resolvedImages = unref(images);
    const resolvedDatePublished = unref(datePublished);
    const resolvedDateModified = unref(dateModified);
    const resolvedAuthor = unref(author);
    const resolvedAuthors = unref(authors);
    const resolvedPublisher = unref(publisher);
    const resolvedUrl = unref(url);
    const resolvedMainEntityOfPage = unref(mainEntityOfPage);
    const resolvedArticleSection = unref(articleSection);
    const resolvedKeywords = unref(keywords);
    const resolvedWordCount = unref(wordCount);
    const resolvedInLanguage = unref(inLanguage);
    const resolvedGenre = unref(genre);
    const resolvedAccessibilityFeature = unref(accessibilityFeature);
    const resolvedAccessibilityHazard = unref(accessibilityHazard);
    const resolvedAccessibilitySummary = unref(accessibilitySummary);

    // Helper function to process multiple images
    const processImages = () => {
      const imageList = [];

      // Add primary image if exists
      if (resolvedImage) {
        imageList.push(resolvedImage);
      }

      // Add additional images
      if (Array.isArray(resolvedImages) && resolvedImages.length > 0) {
        imageList.push(...resolvedImages);
      }

      // Remove duplicates and ensure we have valid URLs
      return [...new Set(imageList)].filter(
        (img) => img && typeof img === 'string',
      );
    };

    // Helper function to process authors
    const processAuthors = () => {
      const authorList = [];

      // Add primary author if exists
      if (resolvedAuthor) {
        if (typeof resolvedAuthor === 'string') {
          authorList.push({
            '@type': 'Person',
            name: resolvedAuthor,
          });
        } else if (typeof resolvedAuthor === 'object') {
          authorList.push({
            '@type': 'Person',
            name: resolvedAuthor.name,
            ...(resolvedAuthor.url && { url: resolvedAuthor.url }),
            ...(resolvedAuthor.image && { image: resolvedAuthor.image }),
            ...(resolvedAuthor.jobTitle && {
              jobTitle: resolvedAuthor.jobTitle,
            }),
            ...(resolvedAuthor.worksFor && {
              worksFor: resolvedAuthor.worksFor,
            }),
          });
        }
      }

      // Add additional authors
      if (Array.isArray(resolvedAuthors) && resolvedAuthors.length > 0) {
        resolvedAuthors.forEach((author) => {
          if (typeof author === 'string') {
            authorList.push({
              '@type': 'Person',
              name: author,
            });
          } else if (typeof author === 'object' && author.name) {
            authorList.push({
              '@type': 'Person',
              name: author.name,
              ...(author.url && { url: author.url }),
              ...(author.image && { image: author.image }),
              ...(author.jobTitle && { jobTitle: author.jobTitle }),
              ...(author.worksFor && { worksFor: author.worksFor }),
            });
          }
        });
      }

      return authorList.length > 0 ? authorList : undefined;
    };

    // Helper function to process publisher
    const processPublisher = () => {
      if (!resolvedPublisher) return undefined;

      if (typeof resolvedPublisher === 'string') {
        return {
          '@type': 'Organization',
          name: resolvedPublisher,
        };
      }

      return {
        '@type': 'Organization',
        name: resolvedPublisher.name,
        ...(resolvedPublisher.logo && { logo: resolvedPublisher.logo }),
        ...(resolvedPublisher.url && { url: resolvedPublisher.url }),
      };
    };

    // Build the JSON-LD object
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
    };

    // Add required and optional properties
    if (resolvedHeadline) jsonLd.headline = resolvedHeadline;
    if (resolvedDescription) jsonLd.description = resolvedDescription;

    const imageUrls = processImages();
    if (imageUrls.length > 0) {
      jsonLd.image = imageUrls.length === 1 ? imageUrls[0] : imageUrls;
    }

    if (resolvedDatePublished) jsonLd.datePublished = resolvedDatePublished;
    if (resolvedDateModified) jsonLd.dateModified = resolvedDateModified;

    const authorData = processAuthors();
    if (authorData) {
      jsonLd.author = authorData.length === 1 ? authorData[0] : authorData;
    }

    const publisherData = processPublisher();
    if (publisherData) jsonLd.publisher = publisherData;

    if (resolvedUrl) jsonLd.url = resolvedUrl;
    if (resolvedMainEntityOfPage)
      jsonLd.mainEntityOfPage = resolvedMainEntityOfPage;
    if (resolvedArticleSection) jsonLd.articleSection = resolvedArticleSection;
    if (resolvedKeywords) {
      if (Array.isArray(resolvedKeywords)) {
        jsonLd.keywords = resolvedKeywords.join(', ');
      } else {
        jsonLd.keywords = resolvedKeywords;
      }
    }
    if (resolvedWordCount) jsonLd.wordCount = resolvedWordCount;
    if (resolvedInLanguage) jsonLd.inLanguage = resolvedInLanguage;
    if (resolvedGenre) jsonLd.genre = resolvedGenre;
    if (resolvedAccessibilityFeature)
      jsonLd.accessibilityFeature = resolvedAccessibilityFeature;
    if (resolvedAccessibilityHazard)
      jsonLd.accessibilityHazard = resolvedAccessibilityHazard;
    if (resolvedAccessibilitySummary)
      jsonLd.accessibilitySummary = resolvedAccessibilitySummary;

    return jsonLd;
  });

  // Inject the structured data into the HTML head
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: () => JSON.stringify(structuredData.value, null, 2),
      },
    ],
  });

  return {
    structuredData,
    injectStructuredData: () => {},
  };
}

/**
 * Helper function to convert Cloudinary public ID to full URL
 * @param {string} publicIdOrUrl - Cloudinary public ID or full URL
 * @param {Object} options - Cloudinary transformation options
 * @returns {string} - Full image URL
 */
function convertToImageUrl(publicIdOrUrl, options = {}) {
  if (!publicIdOrUrl) return '';

  // If it's already a full URL, return as is
  if (
    publicIdOrUrl.startsWith('http://') ||
    publicIdOrUrl.startsWith('https://')
  ) {
    return publicIdOrUrl;
  }

  // If it's a Cloudinary public ID, convert to full URL
  return getCloudinaryUrl(publicIdOrUrl, options);
}

/**
 * Composable for generating ImageObject JSON-LD structured data
 * @param {Object} config - Image configuration object
 * @returns {Object} - Structured data and injection function
 */
export function useImageStructuredData(config) {
  const structuredData = computed(() => {
    const {
      contentUrl,
      license,
      acquireLicensePage,
      creditText,
      creator,
      copyrightNotice,
      name,
      description,
      width,
      height,
      encodingFormat,
      uploadDate,
      keywords,
      representativeOfPage = false,
    } = config;

    // Resolve reactive values
    const resolvedContentUrl = unref(contentUrl);
    const resolvedLicense = unref(license);
    const resolvedAcquireLicensePage = unref(acquireLicensePage);
    const resolvedCreditText = unref(creditText);
    const resolvedCreator = unref(creator);
    const resolvedCopyrightNotice = unref(copyrightNotice);
    const resolvedName = unref(name);
    const resolvedDescription = unref(description);
    const resolvedWidth = unref(width);
    const resolvedHeight = unref(height);
    const resolvedEncodingFormat = unref(encodingFormat);
    const resolvedUploadDate = unref(uploadDate);
    const resolvedKeywords = unref(keywords);
    const resolvedRepresentativeOfPage = unref(representativeOfPage);

    // Convert Cloudinary public ID to full URL if needed
    const imageUrl = convertToImageUrl(resolvedContentUrl);

    // Build the ImageObject JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
    };

    // Add required and optional properties
    if (imageUrl) jsonLd.contentUrl = imageUrl;
    if (resolvedLicense) jsonLd.license = resolvedLicense;
    if (resolvedAcquireLicensePage)
      jsonLd.acquireLicensePage = resolvedAcquireLicensePage;
    if (resolvedCreditText) jsonLd.creditText = resolvedCreditText;
    if (resolvedCopyrightNotice)
      jsonLd.copyrightNotice = resolvedCopyrightNotice;
    if (resolvedName) jsonLd.name = resolvedName;
    if (resolvedDescription) jsonLd.description = resolvedDescription;
    if (resolvedWidth) jsonLd.width = resolvedWidth;
    if (resolvedHeight) jsonLd.height = resolvedHeight;
    if (resolvedEncodingFormat) jsonLd.encodingFormat = resolvedEncodingFormat;
    if (resolvedUploadDate) jsonLd.uploadDate = resolvedUploadDate;
    if (resolvedRepresentativeOfPage)
      jsonLd.representativeOfPage = resolvedRepresentativeOfPage;

    // Handle creator (can be string or Person object)
    if (resolvedCreator) {
      if (typeof resolvedCreator === 'string') {
        jsonLd.creator = {
          '@type': 'Person',
          name: resolvedCreator,
        };
      } else if (typeof resolvedCreator === 'object' && resolvedCreator.name) {
        jsonLd.creator = {
          '@type': 'Person',
          name: resolvedCreator.name,
          ...(resolvedCreator.url && { url: resolvedCreator.url }),
          ...(resolvedCreator.image && { image: resolvedCreator.image }),
        };
      }
    }

    // Handle keywords
    if (resolvedKeywords) {
      if (Array.isArray(resolvedKeywords)) {
        jsonLd.keywords = resolvedKeywords.join(', ');
      } else {
        jsonLd.keywords = resolvedKeywords;
      }
    }

    return jsonLd;
  });

  const injectStructuredData = () => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: () => JSON.stringify(structuredData.value, null, 2),
        },
      ],
    });
  };

  return {
    structuredData,
    injectStructuredData,
  };
}

/**
 * Convenience function for blog post images using ImageObject schema
 * Automatically maps blog post frontmatter image data to structured data
 * @param {Object} post - Blog post object with frontmatter
 * @param {Object} options - Additional options for image structured data
 * @returns {Object} - Structured data and injection function
 */
export function useBlogPostImageStructuredData(post, options = {}) {
  const {
    defaultLicense = 'https://all-things-digital.pages.dev/license',
    defaultAcquireLicensePage = 'https://all-things-digital.pages.dev/how-to-use-images',
    defaultCreditText = 'All Things Digital',
    defaultCopyrightNotice = 'All Things Digital',
    baseUrl = 'https://all-things-digital.pages.dev',
  } = options;

  return useImageStructuredData({
    contentUrl: computed(() => {
      const postData = unref(post);
      return postData?.featuredImage?.src || '';
    }),
    name: computed(() => {
      const postData = unref(post);
      return postData?.featuredImage?.alt || postData?.title || '';
    }),
    description: computed(() => {
      const postData = unref(post);
      return (
        postData?.featuredImage?.caption ||
        postData?.excerpt ||
        postData?.description ||
        ''
      );
    }),
    license: defaultLicense,
    acquireLicensePage: defaultAcquireLicensePage,
    creditText: defaultCreditText,
    copyrightNotice: defaultCopyrightNotice,
    creator: computed(() => {
      const postData = unref(post);
      if (postData?.author) {
        return {
          name: postData.author.name || 'Unknown Author',
          ...(postData.author.link && { url: postData.author.link }),
        };
      }
      return 'Unknown Author';
    }),
    uploadDate: computed(() => {
      const postData = unref(post);
      return postData?.datePublished || postData?.date || '';
    }),
    keywords: computed(() => {
      const postData = unref(post);
      return postData?.tags || [];
    }),
    representativeOfPage: true,
  });
}

/**
 * Convenience function for blog posts using NewsArticle schema
 * Automatically maps common frontmatter fields to structured data
 *
 * @param {Object} post - Blog post object with frontmatter data
 * @param {Object} options - Additional options and overrides
 * @returns {void}
 */
export function useBlogPostStructuredData(post, options = {}) {
  const {
    baseUrl = 'https://all-things-digital.pages.dev/',
    defaultPublisher = {
      name: 'DGPond.COM',
      logo: 'https://all-things-digital.pages.dev//logo.png',
      url: 'https://all-things-digital.pages.dev/',
    },
    ...overrides
  } = options;

  const config = computed(() => {
    const resolvedPost = unref(post);
    if (!resolvedPost) return {};

    return {
      headline: resolvedPost.title || resolvedPost.seoTitle,
      description: resolvedPost.excerpt || resolvedPost.description,
      image: resolvedPost.featuredImage?.src,
      images: resolvedPost.images || [],
      datePublished: resolvedPost.date
        ? new Date(resolvedPost.date).toISOString()
        : undefined,
      dateModified: resolvedPost.lastModified
        ? new Date(resolvedPost.lastModified).toISOString()
        : undefined,
      author: resolvedPost.author,
      authors: resolvedPost.authors || [],
      publisher: defaultPublisher,
      url: `${baseUrl}/blog/${resolvedPost.slug}`,
      mainEntityOfPage: `${baseUrl}/blog/${resolvedPost.slug}`,
      articleSection: resolvedPost.category || resolvedPost.categories?.[0],
      keywords: resolvedPost.tags,
      wordCount: resolvedPost.wordCount,
      inLanguage: resolvedPost.language || 'en',
      genre: resolvedPost.genre || 'Technology',
      ...overrides,
    };
  });

  useStructuredData(config.value);
}

/**
 * Generate structured data for website/organization
 *
 * @param {Object} config - Website configuration
 * @returns {void}
 */
export function useWebsiteStructuredData(config) {
  const structuredData = computed(() => {
    const {
      name,
      description,
      url,
      logo,
      sameAs = [],
      contactPoint,
      address,
      foundingDate,
      founder,
    } = config;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
    };

    if (unref(name)) jsonLd.name = unref(name);
    if (unref(description)) jsonLd.description = unref(description);
    if (unref(url)) jsonLd.url = unref(url);
    if (unref(logo)) jsonLd.logo = unref(logo);
    if (unref(sameAs) && Array.isArray(unref(sameAs)))
      jsonLd.sameAs = unref(sameAs);
    if (unref(contactPoint)) jsonLd.contactPoint = unref(contactPoint);
    if (unref(address)) jsonLd.address = unref(address);
    if (unref(foundingDate)) jsonLd.foundingDate = unref(foundingDate);
    if (unref(founder)) jsonLd.founder = unref(founder);

    return jsonLd;
  });

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: () => JSON.stringify(structuredData.value, null, 2),
      },
    ],
  });
}

export default {
  useStructuredData,
  useBlogPostStructuredData,
  useWebsiteStructuredData,
};
