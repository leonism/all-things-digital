<template>
  <section id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto mt-10 mb-20" role="main">
    <article v-if=" post "
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
        <CusdisComments v-if=" post?.slug && post?.title " :page-id="post.slug" :page-title="post.title" />
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
import { useArticleSEO } from '@/composables/useSEO';
import HeaderBlogPost from '../heading/HeaderBlogPost.vue';
import BlogPostNavigation from './BlogPostNavigation.vue';
import CusdisComments from '../common/CusdisComments.vue';
import postsData from '../../blog-data.json';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface BlogPost
{
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
const post = ref<BlogPost | null>( null );
const postContentComponent = ref<any>( null );

// Computed properties for navigation
const allPosts = computed( () => postsData as BlogPost[] );

const currentPostIndex = computed( () =>
{
  return allPosts.value.findIndex( p => p.slug === post.value?.slug );
} );

const previousPost = computed( () =>
{
  const index = currentPostIndex.value;
  return index > 0 ? allPosts.value[ index - 1 ] : null;
} );

const nextPost = computed( () =>
{
  const index = currentPostIndex.value;
  return index >= 0 && index < allPosts.value.length - 1 ? allPosts.value[ index + 1 ] : null;
} );

// Function to convert tag to slug format
const getTagSlug = ( tag: string ): string =>
{
  return tag.toLowerCase().replace( /\s+/g, '-' ).replace( /[^a-z0-9-]/g, '' );
};

// Function to highlight code blocks
const highlightCodeBlocks = () =>
{
  nextTick( () =>
  {
    document.querySelectorAll( 'pre code' ).forEach( ( block, index ) =>
    {
      const pre = block.parentElement as HTMLPreElement;
      if ( !pre ) return;

      // Apply syntax highlighting
      hljs.highlightElement( block as HTMLElement );

      // Add line numbers
      const code = block.textContent || '';
      const lines = code.split( '\n' );
      const lineNumbers = lines.map( ( _, i ) => i + 1 ).join( '\n' );

      // Create line numbers element if it doesn't exist
      let lineNumbersEl = pre.querySelector( '.line-numbers' ) as HTMLDivElement;
      if ( !lineNumbersEl )
      {
        lineNumbersEl = document.createElement( 'div' );
        lineNumbersEl.className = 'line-numbers';
        lineNumbersEl.setAttribute( 'aria-hidden', 'true' );
        pre.appendChild( lineNumbersEl );
      }
      lineNumbersEl.textContent = lineNumbers;

      // Add copy button if it doesn't exist
      let copyButton = pre.querySelector( '.copy-button' ) as HTMLButtonElement;
      if ( !copyButton )
      {
        copyButton = document.createElement( 'button' );
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        `;
        copyButton.setAttribute( 'aria-label', 'Copy code to clipboard' );
        copyButton.addEventListener( 'click', () =>
        {
          navigator.clipboard.writeText( code ).then( () =>
          {
            if ( copyButton )
            {
              copyButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Copied!
              `;
              setTimeout( () =>
              {
                if ( copyButton )
                {
                  copyButton.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  `;
                }
              }, 2000 );
            }
          } ).catch( err =>
          {
            console.error( 'Failed to copy: ', err );
          } );
        } );
        pre.appendChild( copyButton );
      }

      // Add language detection and label
      const language = block.className.match( /language-(\w+)/ )?.[ 1 ] || 'text';
      pre.setAttribute( 'data-language', language );
    } );
  } );
};

// Function to load post data and component
const loadPost = async ( slug: string ) =>
{
  try
  {
    // Find post in data
    const foundPost = allPosts.value.find( p => p.slug === slug );
    if ( !foundPost )
    {
      post.value = null;
      postContentComponent.value = null;
      return;
    }

    post.value = foundPost;

    // Dynamically import the markdown component
    try
    {
      const module = await import( `../../data/posts/${slug}.md` );
      postContentComponent.value = defineAsyncComponent( () => import( `../../data/posts/${slug}.md` ) );

      // Highlight code blocks after component loads
      nextTick( () =>
      {
        highlightCodeBlocks();
      } );
    } catch ( importError )
    {
      console.warn( `Could not load markdown component for ${slug}:`, importError );
      postContentComponent.value = null;
    }
  } catch ( error )
  {
    console.error( 'Error loading post:', error );
    post.value = null;
    postContentComponent.value = null;
  }
};

// Watch for route changes
watch(
  () => route.params.slug,
  ( newSlug ) =>
  {
    if ( typeof newSlug === 'string' )
    {
      loadPost( newSlug );
    }
  },
  { immediate: true }
);

// Watch for component changes to re-highlight
watch(
  postContentComponent,
  () =>
  {
    highlightCodeBlocks();
  }
);

// SEO setup
watch(
  post,
  ( newPost ) =>
  {
    if ( newPost )
    {
      useArticleSEO( {
        title: newPost.seoTitle || newPost.title,
        description: newPost.description,
        image: newPost.featuredImage?.src,
        canonicalPath: `/blog/${newPost.slug}`,
        publishedTime: newPost.date,
        modifiedTime: newPost.lastModified,
        author: newPost.author?.name,
        keywords: newPost.tags,
        category: newPost.category
      } );
    }
  },
  { immediate: true }
);

// Initialize highlight.js on mount
onMounted( () =>
{
  highlightCodeBlocks();
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

/* ===== CODE BLOCKS ===== */
.prose pre {
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  padding-left: 4rem;
  /* Space for line numbers */
  margin: 2rem 0;
  overflow-x: auto;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.prose pre:hover {
  transform: translateY(-1px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.dark .prose pre {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-color: rgba(71, 85, 105, 0.3);
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.3),
    0 8px 10px -6px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.dark .prose pre:hover {
  box-shadow:
    0 20px 40px -10px rgba(0, 0, 0, 0.4),
    0 15px 20px -10px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.prose pre code {
  background: transparent !important;
  color: #334155 !important;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  font-weight: 400;
  letter-spacing: 0.025em;
  padding: 0;
  border-radius: 0;
  border: none;
  display: block;
  white-space: pre;
  overflow-x: auto;
}

.dark .prose pre code {
  color: #e2e8f0 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Line numbers styling */
.prose pre .line-numbers {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3rem;
  background: rgba(148, 163, 184, 0.1);
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1rem 0 0 1rem;
  padding: 1.5rem 0.5rem;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.6;
  color: #64748b;
  text-align: right;
  user-select: none;
  white-space: pre;
  overflow: hidden;
}

.dark .prose pre .line-numbers {
  background: rgba(71, 85, 105, 0.2);
  border-right-color: rgba(71, 85, 105, 0.3);
  color: #64748b;
}

/* Inline code styling */
.prose code {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
  color: rgb(99, 102, 241);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.875em;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(99, 102, 241, 0.2);

  transition: all 0.2s ease;
}

.prose code:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15));
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-1px);

}

.dark .prose code {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15));
  color: rgb(196, 181, 253);
  border-color: rgba(139, 92, 246, 0.3);
}

.dark .prose code:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));

}

/* Code block language label */
.prose pre::before {
  content: attr(data-language);
  position: absolute;
  top: 0.75rem;
  right: 4.5rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  z-index: 10;
}

/* Copy button styling */
.prose pre .copy-button {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9));
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0;
  transform: translateY(-5px);
}

.prose pre:hover .copy-button {
  opacity: 1;
  transform: translateY(0);
}

.prose pre .copy-button:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(16, 185, 129, 1));
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.prose pre .copy-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Scrollbar styling for code blocks */
.prose pre::-webkit-scrollbar {
  height: 8px;
}

.prose pre::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.prose pre::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6));
  border-radius: 4px;
  transition: background 0.2s ease;
}

.prose pre::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
}

/* Enhanced syntax highlighting overrides for light mode */
.prose pre code .hljs-keyword {
  color: #7c3aed !important;
  font-weight: 600;
}

.prose pre code .hljs-string {
  color: #059669 !important;
}

.prose pre code .hljs-number {
  color: #dc2626 !important;
}

.prose pre code .hljs-comment {
  color: #6b7280 !important;
  font-style: italic;
}

.prose pre code .hljs-function {
  color: #2563eb !important;
}

.prose pre code .hljs-variable {
  color: #374151 !important;
}

.prose pre code .hljs-title {
  color: #d97706 !important;
  font-weight: 600;
}

.prose pre code .hljs-attr {
  color: #7c3aed !important;
}

.prose pre code .hljs-built_in {
  color: #d97706 !important;
}

/* Dark mode syntax highlighting */
.dark .prose pre code .hljs-keyword {
  color: #c792ea !important;
  font-weight: 600;
}

.dark .prose pre code .hljs-string {
  color: #c3e88d !important;
}

.dark .prose pre code .hljs-number {
  color: #f78c6c !important;
}

.dark .prose pre code .hljs-comment {
  color: #546e7a !important;
  font-style: italic;
}

.dark .prose pre code .hljs-function {
  color: #82aaff !important;
}

.dark .prose pre code .hljs-variable {
  color: #eeffff !important;
}

.dark .prose pre code .hljs-title {
  color: #ffcb6b !important;
  font-weight: 600;
}

.dark .prose pre code .hljs-attr {
  color: #c792ea !important;
}

.dark .prose pre code .hljs-built_in {
  color: #ffcb6b !important;
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

  .prose pre code {
    font-size: 0.9375rem;
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

  .prose pre {
    padding: 2rem;
  }

  .prose pre code {
    font-size: 1rem;
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
