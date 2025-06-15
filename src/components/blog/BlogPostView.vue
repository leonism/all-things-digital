<template>
  <section id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto mt-10 mb-20" role="main">
    <article v-if="post"
      class="overflow-hidden md:flex-row md:my-6rounded-2xl shadow-2xl border border-transparent bg-broken-white dark:bg-postcard transform transition-all duration-500">
      <HeaderBlogPost :title="post.title" :subtitle="post.subtitle" :authorName="post.author?.name ?? ''"
        :authorAvatar="post.author?.image ?? ''" :date="post.date" :category="post.category ?? ''"
        :featuredImage="post.featuredImage?.src" />
      <div class="p-6 md:p-8">
        <div class="prose prose-lg dark:prose-invert max-w-none prose-blue dark:prose-blue">
          <component :is="postContentComponent" v-if=" postContentComponent " />
        </div>
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div v-if=" post.categories && post.categories.length " class="mb-4">
            <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300">
              Categories:
            </span>
            <router-link v-for=" category in post.categories " :key="category" :to="{
              name: 'category-archive',
              params: { category: getTagSlug( category ) },
            }"
              class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {{ category }}
            </router-link>
          </div>
          <div v-if=" post.tags && post.tags.length ">
            <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300">Tags:</span>
            <router-link v-for=" tag in post.tags " :key="tag"
              :to="{ name: 'tag-archive', params: { tag: getTagSlug( tag ) } }"
              class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              #{{ tag }}
            </router-link>
          </div>
        </div>
        <!-- Use the new CusdisComments component -->
        <CusdisComments v-if="post?.slug && post?.title" :page-id="post.slug" :page-title="post.title" />
      </div>
    </article>
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-semibold dark:text-white">Post not found</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        The requested blog post could not be found.
      </p>
      <router-link to="/blog" class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block">
        &larr; Back to Blog List
      </router-link>
    </div>
    <BlogPostNavigation :previousPost="previousPost" :nextPost="nextPost" />
  </section>
</template>

<script setup lang="ts">
/**
 * BlogPostView Component
 *
 * This component is responsible for fetching and displaying a single blog post
 * based on the 'slug' parameter from the route. It retrieves post data from
 * the `blog-data.json` file and dynamically updates the page's meta tags
 * (title, description, Open Graph, Twitter Card, etc.) using the `@unhead/vue`
 * library.
 *
 * The component uses Vue 3 Composition API with `<script setup>` for a
 * cleaner and more concise syntax.
 *
 * Data Flow:
 * 1. The component watches changes to the route's 'slug' parameter.
 * 2. When the slug changes, the `findPost` function is called to locate the
 *    corresponding post data in `blog-data.json`.
 * 3. The found post data is assigned to the `post` ref.
 * 4. A watcher on the `post` ref triggers the update of meta tags using `useHead`.
 * 5. Computed properties (`pageTitle`, `pageDescription`, etc.) derive meta
 *    tag values from the `post` data.
 * 6. The template conditionally renders the post content or a "not found" message.
 */
import { ref, watch, computed, type Ref, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue'; // useScript is no longer needed here
import HeaderBlogPost from '../heading/HeaderBlogPost.vue';
import postsData from '../../blog-data.json';
import BlogPostNavigation from './BlogPostNavigation.vue';
import { useCloudinary } from '@/composables/useCloudinary';
import CusdisComments from '../common/CusdisComments.vue'; // Adjust path if you placed it elsewhere

// Define a type for the dynamically imported Markdown component
interface MarkdownModule
{
  default: any;
  frontmatter: Record<string, any>;
}

/**
 * Generates a hyphenated slug from a tag name.
 * Replaces spaces with hyphens and converts to lowercase.
 * @param name The tag name.
 * @returns The hyphenated tag slug.
 */
const getTagSlug = ( name: string ): string =>
{
  return name.toLowerCase().replace( /\s+/g, '-' );
};

interface BlogPost
{
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  lastModified?: string;
  author?: {
    name: string;
    role?: string;
    image?: string;
  };
  category?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: {
    src: string;
    alt?: string;
  };
  seoTitle?: string;
  excerpt?: string;
  metaRobots?: string;
  canonicalUrl?: string;
  schema?: any; // Use a more specific type if schema structure is known
  status?: 'published' | 'draft' | string; // Allow string type based on data structure
}

const route = useRoute();
const post: Ref<BlogPost | null> = ref( null );
const postContentComponent: Ref<any | null> = ref( null );

/**
 * Finds a blog post by its slug in the imported posts data.
 * Only returns published posts (or posts without a status field).
 * @param slug The slug of the post to find.
 * @returns The found blog post object or null if not found or not published.
 */
const findPost = ( slug: string ): BlogPost | null =>
{
  const foundPost = postsData.find( ( p ) => p.slug === slug );
  return foundPost && ( !foundPost.status || foundPost.status === 'published' )
    ? ( foundPost as BlogPost )
    : null;
};

// Function to dynamically import the Markdown file
const loadMarkdownComponent = async ( slug: string ) =>
{
  try
  {
    // Dynamically import the Markdown file based on the slug
    const module = ( await import(
      `../../data/posts/${slug}.md`
    ) ) as MarkdownModule;
    postContentComponent.value = markRaw( module.default );

    // Update head with SEO data from the current post
    // The 'post' ref should be populated by the watchEffect below before this runs
  } catch ( error )
  {
    console.error( `Failed to load Markdown for slug: ${slug}`, error );
    postContentComponent.value = null;
  }
};

// Computed properties for meta tags
const pageTitle = computed(
  () => post.value?.seoTitle || post.value?.title || 'Blog Post',
);
const pageDescription = computed(
  () => post.value?.excerpt || 'Read this blog post.',
);
const ogImage = computed(
  () => post.value?.featuredImage?.src || '/images/default-og-image.png',
); // Add a default OG image path
const canonicalUrl = computed( () =>
{
  // Construct canonical URL - replace with your actual domain
  const base = 'https://all-things-digital.pages.dev'; // <<<--- IMPORTANT: Replace with your actual domain
  return post.value ? `${base}/blog/${post.value.slug}` : base;
} );

// Watcher to update meta tags whenever the 'post' ref changes.
// This ensures that meta tags are updated when a post is loaded.
// Watcher to react to changes in the route's slug parameter.
// This is triggered when navigating between blog posts.
watch(
  () => route.params.slug,
  ( newSlug ) =>
  {
    if ( newSlug )
    {
      const slug = Array.isArray( newSlug ) ? newSlug[ 0 ] : newSlug;
      post.value = findPost( slug );
      if ( post.value )
      {
        loadMarkdownComponent( slug );
      } else
      {
        postContentComponent.value = null;
      }
    }
  },
  { immediate: true },
);

const allPosts = postsData.filter(
  ( post ) => !post.status || post.status === 'published',
);

const currentPostIndex = computed( () =>
{
  return allPosts.findIndex( ( p ) => p.slug === route.params.slug );
} );

const previousPost = computed( () =>
{
  if ( currentPostIndex.value === -1 || currentPostIndex.value === 0 )
  {
    return null;
  }
  return allPosts[ currentPostIndex.value - 1 ];
} );

const nextPost = computed( () =>
{
  if (
    currentPostIndex.value === -1 ||
    currentPostIndex.value === allPosts.length - 1
  )
  {
    return null;
  }
  return allPosts[ currentPostIndex.value + 1 ];
} );

const pageUrl = computed( () =>
{
  if ( typeof window !== 'undefined' )
  {
    return window.location.href;
  }
  return '';
} );

</script>

<style>
/* ===== BASE TYPOGRAPHY SETTINGS ===== */
.prose {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* ===== HEADINGS ===== */
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  font-weight: 700;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  color: rgb(17, 24, 39);
  letter-spacing: -0.025em;
}

.dark .prose h1,
.dark .prose h2,
.dark .prose h3,
.dark .prose h4,
.dark .prose h5,
.dark .prose h6 {
  color: rgb(255, 255, 255);
}

.prose h1 {
  font-size: 2.25rem;
  line-height: 1.2;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 2rem;
}

.prose h2 {
  font-size: 1.75rem;
  line-height: 1.25;
  position: relative;
  padding-bottom: 0.5rem;
}

.prose h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 3rem;
  height: 0.25rem;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.5), transparent);
  border-radius: 0.125rem;
}

.prose h3 {
  font-size: 1.375rem;
  line-height: 1.3;
}

/* ===== PARAGRAPHS ===== */
.prose p {
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: rgb(55, 65, 81);
  font-weight: 400;
}

.dark .prose p {
  color: rgb(237, 228, 228);
}

/* ===== LINKS ===== */
.prose a {
  color: rgb(37, 99, 235);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.15s ease;
  border-bottom: 1px solid transparent;
}

.dark .prose a {
  color: rgb(96, 165, 250);
}

.prose a:hover {
  text-decoration: none;
  border-bottom-color: currentColor;
}

/* ===== LISTS ===== */
.prose ul,
.prose ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
  color: rgb(55, 65, 81);
}

.dark .prose li {
  color: rgb(209, 213, 219);
}

.prose ul li {
  position: relative;
  list-style-type: none;
}

.prose ul li::before {
  content: '•';
  position: absolute;
  left: -1.25rem;
  color: rgb(59, 130, 246);
}

.dark .prose ul li::before {
  color: rgb(96, 165, 250);
}

.prose ol {
  counter-reset: item;
}

.prose ol li {
  counter-increment: item;
  list-style-type: none;
}

.prose ol li::before {
  content: counter(item) '.';
  position: absolute;
  left: -1.25rem;
  color: rgb(59, 130, 246);
  font-weight: 600;
}

.dark .prose ol li::before {
  color: rgb(96, 165, 250);
}

/* ===== BLOCKQUOTES ===== */
.prose blockquote {
  border-left: 4px solid rgb(59, 130, 246);
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: rgb(75, 85, 99);
  background-color: rgba(59, 130, 246, 0.05);
  border-radius: 0 0.5rem 0.5rem 0;
}

.dark .prose blockquote {
  color: rgb(209, 213, 219);
  background-color: rgba(59, 130, 246, 0.1);
}

/* ===== CODE ===== */
.prose pre {
  background-color: rgb(243, 244, 246);
  padding: 1.25rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 2rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .prose pre {
  background-color: rgb(17, 24, 39);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.prose code {
  font-family:
    'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  background-color: rgb(229, 231, 235);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  color: rgb(220, 38, 38);
  font-size: 0.9375em;
}

.dark .prose code {
  background-color: rgb(55, 65, 81);
  color: rgb(248, 113, 113);
}

/* ===== TABLES ===== */
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 0.9375rem;
}

.prose th,
.prose td {
  padding: 0.75rem 1rem;
  border: 1px solid rgb(209, 213, 219);
  text-align: left;
  color: rgb(31, 41, 55);
}

.dark .prose th,
.dark .prose td {
  border-color: rgb(75, 85, 99);
  color: rgb(229, 231, 235);
}

.prose th {
  background-color: rgb(229, 231, 235);
  font-weight: 600;
}

.dark .prose th {
  background-color: rgb(55, 65, 81);
}

.prose tr:nth-child(even) {
  background-color: rgba(243, 244, 246, 0.5);
}

.dark .prose tr:nth-child(even) {
  background-color: rgba(17, 24, 39, 0.5);
}

/* ===== IMAGES ===== */
.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 2rem 0;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (min-width: 640px) {
  .prose {
    font-size: 1.0625rem;
  }

  .prose h1 {
    font-size: 2.5rem;
  }

  .prose h2 {
    font-size: 2rem;
  }

  .prose h3 {
    font-size: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .prose h1 {
    font-size: 3rem;
  }

  .prose h2 {
    font-size: 2.25rem;
  }

  .prose h3 {
    font-size: 1.75rem;
  }

  .prose p {
    font-size: 1.125rem;
  }
}

/* ===== DARK MODE TRANSITIONS ===== */
.prose,
.prose * {
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}
</style>
