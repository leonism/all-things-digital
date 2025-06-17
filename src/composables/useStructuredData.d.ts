import { Ref, ComputedRef } from 'vue'
import { MaybeRefOrGetter } from '@vueuse/core'

export interface Author {
  name: string
  url?: string
  email?: string
  image?: string
  jobTitle?: string
  affiliation?: string
}

export interface Publisher {
  '@type': 'Organization'
  name: string
  logo?: {
    '@type': 'ImageObject'
    url: string
    width?: number
    height?: number
  }
  url?: string
}

export interface BlogPost {
  title?: string
  description?: string
  image?: string | string[]
  author?: string | Author | Array<string | Author>
  date?: string
  datePublished?: string
  dateModified?: string
  categories?: string[]
  tags?: string[]
  keywords?: string[]
  excerpt?: string
  readingTime?: number
  wordCount?: number
  slug?: string
  url?: string
  language?: string
  [key: string]: any
}

export interface StructuredDataConfig {
  '@context'?: string
  '@type': string
  headline?: string
  description?: string
  image?: string | string[]
  author?: Author | Author[]
  publisher?: Publisher
  datePublished?: string
  dateModified?: string
  mainEntityOfPage?: {
    '@type': 'WebPage'
    '@id': string
  }
  articleSection?: string
  keywords?: string[]
  wordCount?: number
  timeRequired?: string
  inLanguage?: string
  accessibilityFeature?: string[]
  accessibilityHazard?: string[]
  genre?: string[]
  url?: string
  [key: string]: any
}

export interface BlogPostStructuredDataOptions {
  publisher?: Publisher
  baseUrl?: string
  defaultImage?: string
  includeAccessibility?: boolean
  customOverrides?: Record<string, any>
}

export interface WebsiteStructuredDataConfig {
  '@context'?: string
  '@type': 'Organization' | 'WebSite'
  name: string
  url?: string
  logo?: string
  description?: string
  sameAs?: string[]
  contactPoint?: {
    '@type': 'ContactPoint'
    telephone?: string
    contactType?: string
    email?: string
  }
  address?: {
    '@type': 'PostalAddress'
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  [key: string]: any
}

export declare function useStructuredData(config: MaybeRefOrGetter<StructuredDataConfig>): {
  structuredData: ComputedRef<StructuredDataConfig>
  injectStructuredData: () => void
}

export declare function useBlogPostStructuredData(
  post: MaybeRefOrGetter<BlogPost>,
  options?: MaybeRefOrGetter<BlogPostStructuredDataOptions>
): {
  structuredData: ComputedRef<StructuredDataConfig>
  injectStructuredData: () => void
}

export declare function useImageStructuredData(
  config: {
    contentUrl?: Ref<string> | string;
    license?: Ref<string> | string;
    acquireLicensePage?: Ref<string> | string;
    creditText?: Ref<string> | string;
    creator?: Ref<string | { name: string; url?: string; image?: string }> | string | { name: string; url?: string; image?: string };
    copyrightNotice?: Ref<string> | string;
    name?: Ref<string> | string;
    description?: Ref<string> | string;
    width?: Ref<number> | number;
    height?: Ref<number> | number;
    encodingFormat?: Ref<string> | string;
    uploadDate?: Ref<string> | string;
    keywords?: Ref<string[] | string> | string[] | string;
    representativeOfPage?: Ref<boolean> | boolean;
  }
): {
  structuredData: ComputedRef<any>;
  injectStructuredData: () => void;
};

export declare function useBlogPostImageStructuredData(
  post: Ref<BlogPost | null> | BlogPost | null,
  options?: {
    defaultLicense?: string;
    defaultAcquireLicensePage?: string;
    defaultCreditText?: string;
    defaultCopyrightNotice?: string;
    baseUrl?: string;
  }
): {
  structuredData: ComputedRef<any>;
  injectStructuredData: () => void;
};

export declare function useWebsiteStructuredData(config: MaybeRefOrGetter<WebsiteStructuredDataConfig>): {
  structuredData: ComputedRef<WebsiteStructuredDataConfig>
  injectStructuredData: () => void
}