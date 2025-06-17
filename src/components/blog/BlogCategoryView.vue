<template>
  <section id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto" role="main">
    <!-- Page Header -->
    <h1 id="mainHeading"
      class="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mt-3 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600 dark:from-indigo-400 dark:via-pink-400 dark:to-purple-500 animate-gradient-shift">
      Category: {{ displayCategoryName }}
    </h1>

    <!-- Posts Grid -->

    <main>
      <div v-if=" filteredPosts.length " aria-label="Blog articles" class="space-y-6">
        <BlogArticleCard v-for=" post in filteredPosts " :key="post.slug" :imageSrc="getPostImage( post )"
          :imageAlt="getPostImageAlt( post )" :title="post.title" :postLink="getPostLink( post.slug )" :date="post.date"
          :excerpt="getPostExcerpt( post )" :tags="post.tags" :authorImageSrc="getAuthorImage( post )"
          :authorImageAlt="getAuthorImageAlt( post )" :authorLink="getAuthorLink( post )"
          :authorName="getAuthorName( post )" :category="post.category" role="article" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center text-gray-500 dark:text-gray-400 py-16">
        <div class="max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor"
            viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No posts found
          </h2>
          <p class="mb-6">
            No posts found in the category "{{ displayCategoryName }}".
          </p>
          <router-link to="/blog"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            Back to Blog List
          </router-link>
        </div>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import postsData from '../../blog-data.json';
import BlogArticleCard from '../home/BlogArticleCard.vue';

// Constants
const SITE_BASE_URL = 'https://yourdomain.com';
const DEFAULT_THUMBNAIL = '/assets/img/thumbnail-01-comp.jpg';
const DEFAULT_AVATAR = '/assets/img/avatar.png';
const DEFAULT_AUTHOR_LINK = '/about';
const DEFAULT_AUTHOR_NAME = 'Unknown Author';
const DEFAULT_AUTHOR_ALT = 'Author profile picture';
const DEFAULT_OG_IMAGE = '/images/default-og-image.png';

// Types
interface BlogPost
{
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  featuredImage?: {
    src: string;
    alt?: string;
    caption?: string;
  };
  category: string;
  tags: string[];
  author?: {
    name: string;
    role?: string;
    image?: string;
    link?: string;
  };
  excerpt?: string;
  description?: string;
  content?: string;
  status?: string;
}

// Utility Functions
const getCategorySlug = ( name: string ): string =>
{
  return name.toLowerCase().replace( /\s+/g, '-' );
};

const slugToDisplayName = ( slug: string ): string =>
{
  return slug
    .split( '-' )
    .map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) )
    .join( ' ' );
};

const isPublishedPost = ( post: BlogPost ): boolean =>
{
  return !post.status || post.status === 'published';
};

// Reactive State
const route = useRoute();
const categorySlug = ref<string>(
  Array.isArray( route.params.category )
    ? route.params.category[ 0 ]
    : route.params.category || ''
);

const allPosts = ref<BlogPost[]>( [] );

// Computed Properties
const displayCategoryName = computed( (): string =>
{
  return categorySlug.value ? slugToDisplayName( categorySlug.value ) : '';
} );

const filteredPosts = computed( (): BlogPost[] =>
{
  if ( !categorySlug.value ) return [];

  return allPosts.value.filter( post =>
    isPublishedPost( post ) &&
    post.category &&
    getCategorySlug( post.category ) === categorySlug.value
  );
} );

const pageTitle = computed( (): string =>
{
  const categoryName = displayCategoryName.value || 'Archive';
  return `Category: ${categoryName} - All Things Digital`;
} );

const pageDescription = computed( (): string =>
{
  const categoryName = displayCategoryName.value || 'archive';
  return `Explore articles in the ${categoryName} category. Discover insights, tutorials, and thoughts on technology and digital innovation.`;
} );

const canonicalUrl = computed( (): string =>
{
  return categorySlug.value
    ? `${SITE_BASE_URL}/blog/category/${categorySlug.value}`
    : `${SITE_BASE_URL}/blog`;
} );

// Helper Functions for Template
const getPostImage = ( post: BlogPost ): string =>
{
  return post.featuredImage?.src || DEFAULT_THUMBNAIL;
};

const getPostImageAlt = ( post: BlogPost ): string =>
{
  return post.featuredImage?.alt || post.title;
};

const getPostLink = ( slug: string ): string =>
{
  return `/blog/${slug}`;
};

const getPostExcerpt = ( post: BlogPost ): string =>
{
  return post.excerpt || post.description || '';
};

const getAuthorImage = ( post: BlogPost ): string =>
{
  return post.author?.image || DEFAULT_AVATAR;
};

const getAuthorImageAlt = ( post: BlogPost ): string =>
{
  return post.author?.name ? `${post.author.name}'s avatar` : DEFAULT_AUTHOR_ALT;
};

const getAuthorLink = ( post: BlogPost ): string =>
{
  return post.author?.link || DEFAULT_AUTHOR_LINK;
};

const getAuthorName = ( post: BlogPost ): string =>
{
  return post.author?.name || DEFAULT_AUTHOR_NAME;
};

// Meta Tags Management
const updateMetaTags = ( categorySlug: string | null ): void =>
{
  if ( !categorySlug )
  {
    useHead( { title: 'Category Archive' } );
    return;
  }

  useHead( {
    title: pageTitle.value,
    meta: [
      { name: 'description', content: pageDescription.value },
      { property: 'og:title', content: pageTitle.value },
      { property: 'og:description', content: pageDescription.value },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl.value },
      { property: 'og:image', content: DEFAULT_OG_IMAGE },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle.value },
      { name: 'twitter:description', content: pageDescription.value },
      { name: 'twitter:image', content: DEFAULT_OG_IMAGE },
      { name: 'robots', content: 'index, follow' },
    ],
    link: [ { rel: 'canonical', href: canonicalUrl.value } ],
  } );
};

// Data Loading
const loadCategoryPosts = (): void =>
{
  try
  {
    // Load all posts and let computed property handle filtering
    allPosts.value = postsData as BlogPost[];

    if ( process.env.NODE_ENV === 'development' )
    {
      console.log( 'Loaded posts for category:', categorySlug.value );
      console.log( 'Filtered posts count:', filteredPosts.value.length );
    }
  } catch ( error )
  {
    console.error( 'Error loading category posts:', error );
    allPosts.value = [];
  }
};

// Watchers
watch(
  categorySlug,
  ( newCategorySlug ) =>
  {
    updateMetaTags( newCategorySlug );
  },
  { immediate: true }
);

watch(
  () => route.params.category,
  ( newCategory ) =>
  {
    const newSlug = Array.isArray( newCategory ) ? newCategory[ 0 ] : newCategory || '';
    if ( newSlug !== categorySlug.value )
    {
      categorySlug.value = newSlug;
    }
  }
);

// Lifecycle
onMounted( () =>
{
  loadCategoryPosts();
} );
</script>
