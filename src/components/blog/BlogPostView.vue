<template>
  <section
    id="mainWrapper"
    class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto"
    role="main"
  >
    <article
      v-if="post"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <img
        v-if="processedFeaturedImageSrc"
        :src="processedFeaturedImageSrc"
        :alt="post.featuredImage?.alt || post.title"
        class="w-full h-64 md:h-96 object-cover"
      />
      <HeaderBlogPost
        :title="post.title"
        :subtitle="post.subtitle"
        :authorName="post.author?.name"
        :authorAvatar="post.author?.image"
        :date="post.date"
        :category="post.category"
      />
      <div class="p-6 md:p-8">
        <div
          class="prose prose-lg dark:prose-invert max-w-none prose-blue dark:prose-blue"
          v-html="post.contentHtml"
        ></div>
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div v-if="post.categories && post.categories.length" class="mb-4">
            <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300">
              Categories:
            </span>
            <router-link
              v-for="category in post.categories"
              :key="category"
              :to="{
                name: 'category-archive',
                params: { category: getTagSlug(category) },
              }"
              class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              {{ category }}
            </router-link>
          </div>
          <div v-if="post.tags && post.tags.length">
            <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300"
              >Tags:</span
            >
            <router-link
              v-for="tag in post.tags"
              :key="tag"
              :to="{ name: 'tag-archive', params: { tag: getTagSlug(tag) } }"
              class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              #{{ tag }}
            </router-link>
          </div>
        </div>
        <div
          id="comments-section"
          class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <h2 class="text-2xl font-bold mb-4 dark:text-white">Comments</h2>
          <p class="text-gray-500 dark:text-gray-400">
            (Comment system integration pending user configuration)
          </p>
        </div>
      </div>
    </article>
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-semibold dark:text-white">Post not found</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        The requested blog post could not be found.
      </p>
      <router-link
        to="/blog"
        class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block"
      >
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
import { ref, watch, computed, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import HeaderBlogPost from '../heading/HeaderBlogPost.vue';
import postsData from '../../blog-data.json';
import BlogPostNavigation from './BlogPostNavigation.vue';

// Function to dynamically import images
const getImageUrl = (name: string): string => {
  // Construct the relative path from the component to the image
  const relativePath = `../../assets/img/${name}`;
  return new URL(relativePath, import.meta.url).href;
};

/**
 * Generates a hyphenated slug from a tag name.
 * Replaces spaces with hyphens and converts to lowercase.
 * @param name The tag name.
 * @returns The hyphenated tag slug.
 */
const getTagSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

interface BlogPost {
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
  contentHtml: string;
  seoTitle?: string;
  excerpt?: string;
  metaRobots?: string;
  canonicalUrl?: string;
  schema?: any; // Use a more specific type if schema structure is known
  status?: 'published' | 'draft' | string; // Allow string type based on data structure
}

const route = useRoute();
const post: Ref<BlogPost | null> = ref(null);

/**
 * Finds a blog post by its slug in the imported posts data.
 * Only returns published posts (or posts without a status field).
 * @param slug The slug of the post to find.
 * @returns The found blog post object or null if not found or not published.
 */
const findPost = (slug: string): BlogPost | null => {
  const foundPost = postsData.find((p) => p.slug === slug);
  return foundPost && (!foundPost.status || foundPost.status === 'published')
    ? (foundPost as BlogPost)
    : null;
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
const canonicalUrl = computed(() => {
  // Construct canonical URL - replace with your actual domain
  const base = 'https://yourdomain.com'; // <<<--- IMPORTANT: Replace with your actual domain
  return post.value ? `${base}/blog/${post.value.slug}` : base;
});

// Watcher to update meta tags whenever the 'post' ref changes.
// This ensures that meta tags are updated when a post is loaded.
watch(
  post,
  (currentPost) => {
    if (currentPost) {
      useHead({
        title: pageTitle.value,
        meta: [
          { name: 'description', content: pageDescription.value },
          // Open Graph
          { property: 'og:title', content: pageTitle.value },
          { property: 'og:description', content: pageDescription.value },
          { property: 'og:type', content: 'article' },
          { property: 'og:url', content: canonicalUrl.value },
          { property: 'og:image', content: ogImage.value },
          {
            property: 'article:published_time',
            content: currentPost.date as string,
          },
          {
            property: 'article:modified_time',
            content: (currentPost.lastModified || currentPost.date) as string,
          },
          // Twitter Card
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: pageTitle.value },
          { name: 'twitter:description', content: pageDescription.value },
          { name: 'twitter:image', content: ogImage.value },
          // Robots
          {
            name: 'robots',
            content: currentPost.metaRobots || 'index, follow',
          },
        ],
        link: [
          {
            rel: 'canonical',
            href: currentPost.canonicalUrl || canonicalUrl.value,
          },
        ],
        // Add JSON-LD script if available in post data
        script: currentPost.schema
          ? [
              {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(currentPost.schema),
              },
            ]
          : [],
      });
    } else {
      useHead({ title: 'Post Not Found' });
    }
  },
  { immediate: true },
);

// Watcher to react to changes in the route's slug parameter.
// This is triggered when navigating between blog posts.
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      const slug = Array.isArray(newSlug) ? newSlug[0] : newSlug;
      post.value = findPost(slug);
      // Meta tags are updated automatically by the 'post' watcher above
    }
  },
  { immediate: true },
);

const allPosts = postsData.filter(
  (post) => !post.status || post.status === 'published',
);

const currentPostIndex = computed(() => {
  return allPosts.findIndex((p) => p.slug === route.params.slug);
});

const previousPost = computed(() => {
  if (currentPostIndex.value === -1 || currentPostIndex.value === 0) {
    return null;
  }
  return allPosts[currentPostIndex.value - 1];
});

const nextPost = computed(() => {
  if (
    currentPostIndex.value === -1 ||
    currentPostIndex.value === allPosts.length - 1
  ) {
    return null;
  }
  return allPosts[currentPostIndex.value + 1];
});

const processedFeaturedImageSrc = computed(() => {
  if (post.value?.featuredImage?.src?.startsWith('/assets/img/')) {
    const filename = post.value.featuredImage.src.split('/').pop();
    if (filename) {
      return getImageUrl(filename);
    }
  }
  return post.value?.featuredImage?.src || '';
});
</script>

<style>
/* Styles for Tailwind Typography */
.prose :where(code):not(:where([class~='not-prose'] *))::before,
.prose :where(code):not(:where([class~='not-prose'] *))::after {
  content: '';
}

/* Custom styles for better readability and aesthetics */
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  font-weight: bold;
  color: rgb(17, 24, 39);
  margin-top: 2rem;
  margin-bottom: 1rem;
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
  font-size: 1.875rem; /* text-3xl */
  line-height: 2.25rem;
  @media (min-width: 768px) {
    font-size: 2.25rem; /* md:text-4xl */
    line-height: 2.5rem;
  }
}

.prose h2 {
  font-size: 1.5rem; /* text-2xl */
  line-height: 2rem;
  @media (min-width: 768px) {
    font-size: 1.875rem; /* md:text-3xl */
    line-height: 2.25rem;
  }
}

.prose h3 {
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem;
  @media (min-width: 768px) {
    font-size: 1.5rem; /* md:text-2xl */
    line-height: 2rem;
  }
}

.prose p {
  line-height: 1.625;
  margin-bottom: 1rem;
  color: rgb(55, 65, 81);
}

.dark .prose p {
  line-height: 1.625;
  margin-bottom: 1rem;
  color: rgb(237, 228, 228);
}

.prose a {
  color: rgb(37, 99, 235); /* text-blue-600 */
  text-decoration: none;
}

.dark .prose a {
  color: rgb(96, 165, 250); /* dark:text-blue-400 */
}

.prose a:hover {
  text-decoration: underline;
}

.prose ul,
.prose ol {
  list-style-position: inside;
  margin-bottom: 1rem;
}

.prose ul li {
  list-style-type: disc;
}

.prose ol li {
  list-style-type: decimal;
}

.prose li {
  margin-bottom: 0.5rem;
  color: rgb(55, 65, 81);
}
.dark .prose li {
  color: rgb(209, 213, 219);
}

.prose blockquote {
  border-left: 4px solid rgb(59, 130, 246);
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-style: italic;
  color: rgb(75, 85, 99);
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.prose pre {
  background-color: rgb(243, 244, 246);
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-size: 0.875rem;
}

.dark .prose pre {
  background-color: rgb(17, 24, 39);
}

.prose code {
  background-color: rgb(229, 231, 235);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  color: rgb(220, 38, 38);
}

.dark .prose code {
  background-color: rgb(55, 65, 81);
  color: rgb(248, 113, 113);
}

.prose table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.prose th,
.prose td {
  border: 1px solid rgb(209, 213, 219);
  padding: 1rem 1rem;
  text-align: left;
  color: rgb(31, 41, 55);
}

.dark .prose th,
.dark .prose td {
  border-color: rgb(75, 85, 99);
  color: rgb(229, 231, 235);
}

.prose th {
  background-color: rgb(229, 231, 235); /* bg-gray-200 */
  font-weight: 600; /* font-semibold */
}

.dark .prose th {
  background-color: rgb(55, 65, 81); /* dark:bg-gray-700 */
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
