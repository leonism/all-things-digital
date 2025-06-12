<template>
  <section
    id="mainWrapper"
    class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto mt-10 mb-20"
    role="main"
  >
    <!-- Blog Post Content -->
    <article
      v-if="post"
      class="overflow-hidden md:flex-row md:my-6 rounded-2xl shadow-2xl border border-transparent bg-broken-white dark:bg-postcard transform transition-all duration-500"
    >
      <HeaderBlogPost
        :title="post.title"
        :subtitle="post.subtitle"
        :authorName="post.author?.name || 'Unknown Author'"
        :authorAvatar="post.author?.image || '/images/default-avatar.png'"
        :date="post.date"
        :category="post.category || 'Uncategorized'"
        :featuredImage="processedFeaturedImageSrc"
      />

      <div class="p-6 md:p-8">
        <!-- Main Content -->
        <div
          class="prose prose-lg dark:prose-invert max-w-none prose-blue dark:prose-blue"
        >
          <component :is="postContentComponent" v-if="postContentComponent" />
        </div>

        <!-- Categories and Tags -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div v-if="post.categories?.length" class="mb-0">
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

          <div v-if="post.tags?.length">
            <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300">
              Tags:
            </span>
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

        <!-- Comments Section -->
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

    <!-- Post Not Found State -->
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

    <!-- Post Navigation -->
    <BlogPostNavigation :previousPost="previousPost" :nextPost="nextPost" />
  </section>
</template>

<script setup lang="ts">
import { ref, watch, computed, type Ref, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import HeaderBlogPost from '../heading/HeaderBlogPost.vue';
import postsData from '../../blog-data.json';
import BlogPostNavigation from './BlogPostNavigation.vue';
import { useCloudinary } from '../../composables/useCloudinary';

interface MarkdownModule {
  default: any;
  frontmatter: Record<string, any>;
}

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
  seoTitle?: string;
  excerpt?: string;
  metaRobots?: string;
  canonicalUrl?: string;
  schema?: any;
  status?: 'published' | 'draft' | string;
}

// Router and State
const route = useRoute();
const post: Ref<BlogPost | null> = ref(null);
const postContentComponent: Ref<any | null> = ref(null);

// Utility Functions
const getTagSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

const findPost = (slug: string): BlogPost | null => {
  const foundPost = postsData.find((p) => p.slug === slug);
  return foundPost && (!foundPost.status || foundPost.status === 'published')
    ? (foundPost as BlogPost)
    : null;
};

const loadMarkdownComponent = async (slug: string) => {
  try {
    const module = (await import(
      `../../data/posts/${slug}.md`
    )) as MarkdownModule;

    postContentComponent.value = markRaw(module.default);

    if (module.frontmatter) {
      const { title, description, ...rest } = module.frontmatter;
      useHead({
        title: title || pageTitle.value,
        meta: [
          {
            name: 'description',
            content: description || pageDescription.value,
          },
          ...Object.entries(rest).map(([key, value]) => ({
            property: `og:${key}`,
            content: value,
          })),
        ],
      });
    }
  } catch (error) {
    console.error(`Failed to load Markdown for slug: ${slug}`, error);
    postContentComponent.value = null;
  }
};

// Computed Properties
const pageTitle = computed(
  () => post.value?.seoTitle || post.value?.title || 'Blog Post',
);

const pageDescription = computed(
  () => post.value?.excerpt || 'Read this blog post.',
);

const ogImage = computed(
  () => post.value?.featuredImage?.src || '/images/default-og-image.png',
);

const canonicalUrl = computed(() => {
  const base = 'https://all-things-digital.pages.dev';
  return post.value ? `${base}/blog/${post.value.slug}` : base;
});

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

const { getResponsiveUrl } = useCloudinary();
const processedFeaturedImageSrc = computed(() => {
  if (!post.value?.featuredImage?.src) return '';
  return getResponsiveUrl(post.value.featuredImage.src, 1200, 600, {
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:good',
  });
});

// Watchers
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      const slug = Array.isArray(newSlug) ? newSlug[0] : newSlug;
      post.value = findPost(slug);
      if (post.value) {
        loadMarkdownComponent(slug);
      } else {
        postContentComponent.value = null;
      }
    }
  },
  { immediate: true },
);
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
