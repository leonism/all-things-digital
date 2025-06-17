import { Ref, ComputedRef } from 'vue'
import { MaybeRefOrGetter } from '@vueuse/core'

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
  siteName?: string
  locale?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export interface ArticleConfig {
  title?: string
  description?: string
  image?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  keywords?: string[]
}

export interface ListingConfig {
  title?: string
  description?: string
  image?: string
  keywords?: string[]
}

export interface StructuredDataConfig {
  headline?: string
  description?: string
  image?: string | string[]
  author?: string | Array<{ name: string; url?: string }>
  datePublished?: string
  dateModified?: string
  articleSection?: string
  keywords?: string[]
  wordCount?: number
  timeRequired?: string
  inLanguage?: string
  accessibilityFeature?: string[]
  accessibilityHazard?: string[]
  genre?: string[]
}

export declare function useSEO(): {
  generateWebsiteSEO: (config: MaybeRefOrGetter<SEOConfig>) => ComputedRef<Record<string, any>>
  generateArticleSEO: (articleConfig: MaybeRefOrGetter<ArticleConfig>) => ComputedRef<Record<string, any>>
  generateListingSEO: (listingConfig: MaybeRefOrGetter<ListingConfig>) => ComputedRef<Record<string, any>>
  generateArticleStructuredData: (config: MaybeRefOrGetter<StructuredDataConfig>) => ComputedRef<Record<string, any>>
}

export declare function useWebsiteSEO(config: MaybeRefOrGetter<SEOConfig>): void
export declare function useArticleSEO(articleConfig: MaybeRefOrGetter<ArticleConfig>): void
export declare function useListingSEO(listingConfig: MaybeRefOrGetter<ListingConfig>): void