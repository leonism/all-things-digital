<template>
  <div class="blog-article-card-container">
    <Suspense>
      <template #default>
        <BlogArticleCard v-bind="$props" />
      </template>
      <template #fallback>
        <!-- Skeleton for Blog Article Card -->
        <div class="animate-pulse">
          <div class="flex flex-col my-10 min-h-60 overflow-hidden rounded-2xl shadow-xl border border-transparent bg-broken-white dark:bg-postcard md:flex-row">
            <!-- Image skeleton -->
            <div class="mb-0 shrink-0 md:w-2/5">
              <div class="w-full h-48 md:h-full bg-gray-300 dark:bg-gray-700 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"></div>
            </div>
            <!-- Content skeleton -->
            <div class="flex grow flex-col p-4 md:p-5 space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

// Lazy load the actual BlogArticleCard component
const BlogArticleCard = defineAsyncComponent(() =>
  import('./BlogArticleCard.vue')
);

// Props are still needed for BlogArticleCard
defineProps({
  imageSrc: String,
  imageAlt: String,
  title: String,
  postLink: String,
  date: String,
  category: String,
  tags: Array,
  authorImageSrc: String,
  authorImageAlt: String,
  authorLink: String,
  authorName: String,
  excerpt: String
});

// Removed isLoading, cardContainer, onMounted, and onUnmounted
</script>
