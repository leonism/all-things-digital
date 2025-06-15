<template>
  <div class="blog-article-card-container" ref="cardContainer">
    <!-- Loading skeleton while component loads -->
    <div v-if="isLoading" class="animate-pulse">
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

    <!-- Actual component when loaded -->
    <Suspense v-else>
      <template #default>
        <BlogArticleCard v-bind="$props" />
      </template>
      <template #fallback>
        <div class="animate-pulse">
          <!-- Same skeleton as above -->
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';

// Lazy load the actual BlogArticleCard component
const BlogArticleCard = defineAsyncComponent(() =>
  import('./BlogArticleCard.vue')
);

const props = defineProps({
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

const isLoading = ref(true);
const cardContainer = ref(null);

// Intersection Observer for lazy loading
let observer;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add a small delay to simulate loading
          setTimeout(() => {
            isLoading.value = false;
          }, 1000); // Increased delay from 300ms to 1000ms (1 second)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before entering viewport
      threshold: 0.1
    }
  );

  if (cardContainer.value) {
    observer.observe(cardContainer.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>
