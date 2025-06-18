<template>
  <section id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto mt-10 mb-20" role="main">
    <article v-if="post"
      class="overflow-hidden md:flex-row md:my-6rounded-2xl shadow-2xl border border-transparent bg-broken-white dark:bg-postcard transform transition-all duration-500">
      <HeaderBlogPost :title="post.title" :subtitle="post.subtitle" :authorName="post.author?.name ?? ''"
        :authorAvatar="post.author?.image ?? ''" :date="post.date" :category="post.category ?? ''"
        :featuredImage="post.featuredImage?.src" />
      <div class="p-6 md:p-8">
        <div class="prose prose-lg dark:prose-invert max-w-none prose-blue dark:prose-blue">
          <component :is="postContentComponent" v-if="postContentComponent" />
        </div>
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div v-if="post.categories && post.categories.length" class="mb-4">
            <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300">
              Categories:
            </span>
            <router-link v-for="category in post.categories" :key="category" :to="{
              name: 'category-archive',
              params: { category: getTagSlug(category) },
            }"
              class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {{ category }}
            </router-link>
          </div>
          <div v-if="post.tags && post.tags.length">
            <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300">Tags:</span>
            <router-link v-for="tag in post.tags" :key="tag"
              :to="{ name: 'tag-archive', params: { tag: getTagSlug(tag) } }"
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
 * the blog-data.json file and dynamically imports the corresponding markdown
 * component for rendering.
 *
 * Features:
 * - Dynamic post loading based on route slug
 * - Markdown content rendering with highlight.js syntax highlighting
 * - Post navigation (previous/next)
 * - Tag slug generation for routing
 * - Error handling for missing posts
 */

import { ref, computed, onMounted, watch, defineAsyncComponent, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import HeaderBlogPost from '../heading/HeaderBlogPost.vue';
import BlogPostNavigation from './BlogPostNavigation.vue';
import CusdisComments from '../common/CusdisComments.vue';
import postsData from '../../blog-data.json';
import { useArticleSEO } from '@/composables/useSEO';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  seoTitle: string;
  date: string;
  lastModified: string;
  author: {
    name: string;
    role: string;
    image: string;
    link?: string;
  };
  category: string;
  tags: string[];
  featuredImage: {
    src: string;
    alt: string;
    caption: string;
  };
  content: string;
  excerpt?: string;
  description: string;
  categories?: string[];
}

const route = useRoute();
const post = ref<BlogPost | null>(null);
const postContentComponent = ref<any>(null);

// Computed properties for navigation
const allPosts = computed(() => postsData as BlogPost[]);

const currentPostIndex = computed(() => {
  return allPosts.value.findIndex(p => p.slug === post.value?.slug);
});

const previousPost = computed(() => {
  const index = currentPostIndex.value;
  return index > 0 ? allPosts.value[index - 1] : null;
});

const nextPost = computed(() => {
  const index = currentPostIndex.value;
  return index >= 0 && index < allPosts.value.length - 1 ? allPosts.value[index + 1] : null;
});

// Function to convert tag to slug format
const getTagSlug = (tag: string): string => {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Function to highlight code blocks
const highlightCodeBlocks = () => {
  nextTick(() => {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      if (!block.classList.contains('hljs')) {
        hljs.highlightElement(block as HTMLElement);
      }
    });
  });
};

// Function to load post data and component
const loadPost = async (slug: string) => {
  try {
    // Find post in data
    const foundPost = allPosts.value.find(p => p.slug === slug);
    if (!foundPost) {
      post.value = null;
      postContentComponent.value = null;
      return;
    }

    post.value = foundPost;

    // Dynamically import the markdown component
    try {
      const module = await import(`../../data/posts/${slug}.md`);
      postContentComponent.value = defineAsyncComponent(() => import(`../../data/posts/${slug}.md`));
      
      // Highlight code blocks after component loads
      nextTick(() => {
        highlightCodeBlocks();
      });
    } catch (importError) {
      console.warn(`Could not load markdown component for ${slug}:`, importError);
      postContentComponent.value = null;
    }
  } catch (error) {
    console.error('Error loading post:', error);
    post.value = null;
    postContentComponent.value = null;
  }
};

// Watch for route changes
watch(
  () => route.params.slug,
  (newSlug) => {
    if (typeof newSlug === 'string') {
      loadPost(newSlug);
    }
  },
  { immediate: true }
);

// Watch for component changes to re-highlight
watch(
  postContentComponent,
  () => {
    highlightCodeBlocks();
  }
);

// SEO setup
watch(
  post,
  (newPost) => {
    if (newPost) {
      useArticleSEO({
         title: newPost.seoTitle || newPost.title,
         description: newPost.description,
         image: newPost.featuredImage?.src,
         canonicalPath: `/blog/${newPost.slug}`,
         publishedTime: newPost.date,
         modifiedTime: newPost.lastModified,
         author: newPost.author?.name,
         keywords: newPost.tags,
         category: newPost.category
       });
    }
  },
  { immediate: true }
);

// Initialize highlight.js on mount
onMounted(() => {
  highlightCodeBlocks();
});
</script>

<style scoped>
/* ===== HIGHLIGHT.JS THEME OVERRIDES ===== */
/* Custom styling for highlight.js code blocks */
.prose pre {
  background: #0d1117 !important;
  border: 1px solid #30363d;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 2rem 0;
  overflow-x: auto;
  font-family: 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.7;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -2px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.dark .prose pre {
  background: #0d1117 !important;
  border-color: #21262d;
}

/* Light mode override */
.prose pre {
  background: #f6f8fa !important;
  border-color: #d0d7de;
  color: #24292f;
}

.prose pre code {
  background: none !important;
  color: inherit !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  font-weight: 400 !important;
  box-shadow: none !important;
}

/* Inline code styling */
.prose code {
  font-family: 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #be185d;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875em;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .prose code {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  color: #f472b6;
  border: 1px solid #6b7280;
}

/* Custom scrollbar for code blocks */
.prose pre::-webkit-scrollbar {
  height: 8px;
}

.prose pre::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.prose pre::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #64748b, #475569);
  border-radius: 4px;
}

.dark .prose pre::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.dark .prose pre::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #94a3b8, #cbd5e1);
}

.prose pre::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #475569, #334155);
}

.dark .prose pre::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #cbd5e1, #e2e8f0);
}

/* Ensure highlight.js styles take precedence */
.prose pre .hljs {
  background: inherit !important;
  padding: 0 !important;
}

/* Additional highlight.js theme adjustments */
.hljs-comment,
.hljs-quote {
  color: #6a737d !important;
  font-style: italic;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-subst {
  color: #d73a49 !important;
  font-weight: 600;
}

.hljs-number,
.hljs-literal,
.hljs-variable,
.hljs-template-variable,
.hljs-tag .hljs-attr {
  color: #005cc5 !important;
}

.hljs-string,
.hljs-doctag {
  color: #032f62 !important;
}

.hljs-title,
.hljs-section,
.hljs-selector-id {
  color: #6f42c1 !important;
  font-weight: 600;
}

.hljs-type,
.hljs-class .hljs-title {
  color: #d73a49 !important;
}

.hljs-tag,
.hljs-name,
.hljs-attribute {
  color: #22863a !important;
}

.hljs-regexp,
.hljs-link {
  color: #032f62 !important;
}

.hljs-symbol,
.hljs-bullet {
  color: #e36209 !important;
}

.hljs-built_in,
.hljs-builtin-name {
  color: #005cc5 !important;
}

.hljs-meta {
  color: #6a737d !important;
}

.hljs-deletion {
  background: #ffeef0 !important;
}

.hljs-addition {
  background: #f0fff4 !important;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

/* Dark mode adjustments for highlight.js */
.dark .hljs-comment,
.dark .hljs-quote {
  color: #8b949e !important;
}

.dark .hljs-keyword,
.dark .hljs-selector-tag,
.dark .hljs-subst {
  color: #ff7b72 !important;
}

.dark .hljs-number,
.dark .hljs-literal,
.dark .hljs-variable,
.dark .hljs-template-variable,
.dark .hljs-tag .hljs-attr {
  color: #79c0ff !important;
}

.dark .hljs-string,
.dark .hljs-doctag {
  color: #a5d6ff !important;
}

.dark .hljs-title,
.dark .hljs-section,
.dark .hljs-selector-id {
  color: #d2a8ff !important;
}

.dark .hljs-type,
.dark .hljs-class .hljs-title {
  color: #ff7b72 !important;
}

.dark .hljs-tag,
.dark .hljs-name,
.dark .hljs-attribute {
  color: #7ee787 !important;
}

.dark .hljs-regexp,
.dark .hljs-link {
  color: #a5d6ff !important;
}

.dark .hljs-symbol,
.dark .hljs-bullet {
  color: #ffa657 !important;
}

.dark .hljs-built_in,
.dark .hljs-builtin-name {
  color: #79c0ff !important;
}

.dark .hljs-meta {
  color: #8b949e !important;
}
</style>
