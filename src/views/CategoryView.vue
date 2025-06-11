<template>
  <section
    id="mainWrapper"
    class="max-w-4xl sm:mx-5 md:mx-10 lg:mx-auto"
    role="main"
  >
    <!-- Enhanced Category Header Section -->
    <section class="mb-12 text-center relative">
      <HeaderCategory :categoryName="displayCategoryName" />
      
      <!-- Enhanced stats section -->
      <div class="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6">
        <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ allCategories.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">Categories</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
               <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ blogDataRef.length }}</p>
               <p class="text-sm text-gray-600 dark:text-gray-300">Total Posts</p>
             </div>
          </div>
        </div>
        
        <div v-if="categoryParam" class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ allPosts.length }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">In {{ displayCategoryName }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Fluid Category Grid -->
    <section
      v-if="!categoryParam"
      class="mb-16"
      role="region"
      aria-label="Category Grid"
    >
      <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="(category, index) in allCategories"
          :key="category"
          class="group relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200/60 dark:border-gray-700/60 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
          :class="[
            index % 4 === 0 ? 'hover:shadow-indigo-500/20' : '',
            index % 4 === 1 ? 'hover:shadow-emerald-500/20' : '',
            index % 4 === 2 ? 'hover:shadow-purple-500/20' : '',
            index % 4 === 3 ? 'hover:shadow-orange-500/20' : ''
          ]"
          role="article"
        >
          <!-- Gradient overlay -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div 
              class="absolute inset-0 rounded-3xl"
              :class="[
                index % 4 === 0 ? 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5' : '',
                index % 4 === 1 ? 'bg-gradient-to-br from-emerald-500/5 to-teal-500/5' : '',
                index % 4 === 2 ? 'bg-gradient-to-br from-purple-500/5 to-pink-500/5' : '',
                index % 4 === 3 ? 'bg-gradient-to-br from-orange-500/5 to-red-500/5' : ''
              ]"
            ></div>
          </div>
          
          <div class="relative p-6">
            <!-- Category header with icon -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div 
                  class="p-2 rounded-xl transition-colors duration-300"
                  :class="[
                    index % 4 === 0 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : '',
                    index % 4 === 1 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : '',
                    index % 4 === 2 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : '',
                    index % 4 === 3 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : ''
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {{ category }}
                </h3>
              </div>
              
              <!-- Post count badge -->
              <div 
                class="px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300"
                :class="[
                  index % 4 === 0 ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : '',
                  index % 4 === 1 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : '',
                  index % 4 === 2 ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' : '',
                  index % 4 === 3 ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' : ''
                ]"
              >
                {{ getLatestPostsByCategory(category).length }} posts
              </div>
            </div>

            <!-- Featured Posts Preview -->
            <div class="space-y-3 mb-5">
              <div
                v-for="(post, postIndex) in getLatestPostsByCategory(category).slice(0, 2)"
                :key="post.slug"
                class="group/post p-3 transition-all duration-300 bg-gray-50/70 dark:bg-gray-700/40 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/60 cursor-pointer border border-transparent hover:border-gray-200/60 dark:hover:border-gray-600/60"
                @click="goToPost(post.slug)"
              >
                <div class="flex items-start space-x-3">
                  <div class="relative">
                    <img
                      v-if="post.featuredImage"
                      :src="post.featuredImage.src"
                      :alt="post.featuredImage.alt || post.title"
                      class="object-cover w-12 h-12 rounded-lg transition-transform duration-300 group-hover/post:scale-105"
                    />
                    <div v-else class="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {{ formatDate(post.date) }}
                    </p>
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover/post:text-indigo-600 dark:group-hover/post:text-indigo-400 transition-colors duration-300">
                      {{ post.title }}
                    </h4>
                    <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                      {{ post.excerpt || post.description }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Show more indicator if there are more posts -->
              <div v-if="getLatestPostsByCategory(category).length > 2" class="text-center">
                <div class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {{ getLatestPostsByCategory(category).length - 2 }} more posts
                </div>
              </div>
            </div>

            <!-- Enhanced View All Button -->
            <button
              @click="goToCategory(category)"
              class="w-full group/btn relative overflow-hidden px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-xl border-2 hover:scale-[1.02] active:scale-[0.98]"
              :class="[
                index % 4 === 0 ? 'text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-700' : '',
                index % 4 === 1 ? 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700' : '',
                index % 4 === 2 ? 'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700' : '',
                index % 4 === 3 ? 'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700' : ''
              ]"
            >
              <span class="relative z-10 flex items-center justify-center gap-2">
                Explore {{ category }}
                <svg class="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Category-specific posts using BlogArticleCard layout -->
    <section
      v-if="categoryParam && allPosts.length > 0"
      class="mb-16"
      role="region"
      aria-label="Blog Posts"
    >
      <BlogArticleCard
        v-for="post in allPosts"
        :key="post.slug"
        :imageSrc="
          post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'
        "
        :imageAlt="post.featuredImage?.alt || post.title"
        :title="post.title"
        :postLink="`/blog/${post.slug}`"
        :date="post.date"
        :excerpt="post.excerpt || post.description"
        :tags="post.tags"
        :authorImageSrc="post.author?.image || '/assets/img/avatar.png'"
        :authorImageAlt="post.author?.name || 'Author profile picture'"
        :authorLink="post.author?.link || '/about'"
        :authorName="post.author?.name || 'Unknown Author'"
        :category="post.category"
        role="article"
      />
    </section>

    <!-- Fallback for non-category pages -->
    <section v-else-if="paginatedPosts.length" aria-label="Blog articles">
      <BlogArticleCard
        v-for="post in paginatedPosts"
        :key="post.slug"
        :imageSrc="
          post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'
        "
        :imageAlt="post.featuredImage?.alt || post.title"
        :title="post.title"
        :postLink="`/blog/${post.slug}`"
        :date="post.date"
        :excerpt="post.excerpt || post.description"
        :tags="post.tags"
        :authorImageSrc="post.author?.image || '/assets/img/avatar.png'"
        :authorImageAlt="post.author?.name || 'Author profile picture'"
        :authorLink="post.author?.link || '/about'"
        :authorName="post.author?.name || 'Unknown Author'"
        role="article"
      />
    </section>

    <!-- Enhanced Empty State -->
    <section
      v-else
      class="relative overflow-hidden p-12 text-center bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl"
      role="alert"
    >
      <!-- Background decoration -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
      </div>
      
      <!-- Empty state icon -->
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl">
          <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
      
      <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
        No Articles Found
      </h3>
      
      <p class="mb-6 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
        <span v-if="categoryParam">
          We couldn't find any articles in the <strong>{{ displayCategoryName }}</strong> category yet.
        </span>
        <span v-else>
          No posts are available at the moment.
        </span>
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <router-link
          to="/blog"
          class="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
        >
          <svg class="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to All Articles
        </router-link>
        
        <router-link
          to="/category"
          class="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition-all duration-300 hover:scale-105 border border-indigo-200/50 dark:border-indigo-800/50"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Browse Categories
          <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </router-link>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import blogData from '../blog-data.json';
import HeaderCategory from '../components/heading/HeaderCategory.vue';
import Pagination from '../components/common/Pagination.vue';
import { usePagination } from '../composables/usePagination';

// Make blogData available in template
const blogDataRef = ref(blogData);

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
    link?: string;
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
  description?: string;
  metaRobots?: string;
  canonicalUrl?: string;
  schema?: any;
  status?: 'published' | 'draft' | string;
}

const route = useRoute();
const router = useRouter();
const categoryParam = route.params.category;
const postsPerPage = 3;
const allPosts = ref<BlogPost[]>([]);

const { currentPage, totalPages, goToPage } = usePagination(
  computed(() => allPosts.value.length),
  postsPerPage,
);

const displayCategoryName = computed(() => {
  return categoryParam
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    : 'All Categories';
});

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage;
  return allPosts.value.slice(startIndex, startIndex + postsPerPage);
});

const allCategories = computed(() => {
  const categories = new Set();
  blogData.forEach((post) => {
    if (post.category) categories.add(post.category);
  });
  return Array.from(categories).sort();
});

function getLatestPostsByCategory(category) {
  return blogData
    .filter((post) => post.category === category)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
}

function goToCategory(category) {
  router.push(`/blog/category/${category.toLowerCase()}`);
}

function goToPost(slug) {
  router.push(`/blog/${slug}`);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const goToPageLocal = (page: number) => {
  goToPage(page);
  if (categoryParam) {
    router.push({
      name: 'category-archive',
      params: { category: categoryParam, page: String(page) },
    });
  } else {
    router.push({ name: 'blog-categories-list', params: { page: String(page) } });
  }
};

onMounted(() => {
  const category = categoryParam;
  const page = Number(route.params.page) || 1;

  const filtered = blogData.filter(
    (post) =>
      (!post.status || post.status === 'published') &&
      (!category || (post.category && post.category.toLowerCase() === category.toLowerCase()))
  );

  allPosts.value = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (page > 1 && page <= totalPages.value) {
    currentPage.value = page;
  } else {
    currentPage.value = 1;
  }
});
</script>

<style>
/* Fluid scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Organic scrollbars */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.6);
}

/* Smooth transitions */
* {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}
</style>
