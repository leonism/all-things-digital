<template>
  <div
    class="search-result-item group relative p-3 sm:p-4 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all duration-200"
    :class="{
      'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 selected': isSelected,
      'hover:shadow-md': !isSelected
    }"
    @click="$emit('click')"
    @mouseenter="$emit('mouseenter')"
  >
    <div class="flex items-start space-x-3 sm:space-x-4">
      <!-- Post Thumbnail -->
      <div class="flex-shrink-0">
        <img
          :src="post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'"
          :alt="post.featuredImage?.alt || post.title"
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
          loading="lazy"
        />
      </div>

      <!-- Post Content -->
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <h3 
          class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 leading-tight"
          v-html="post._highlightedTitle || post.title"
        ></h3>

        <!-- Excerpt/Snippet -->
        <p 
          class="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed"
          v-html="post._highlightedExcerpt || post._snippet || post.excerpt || 'No description available'"
        ></p>

        <!-- Metadata -->
        <div class="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
          <!-- Category -->
          <span 
            class="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs"
            v-html="post._highlightedCategory || post.category"
          ></span>

          <!-- Date -->
          <span class="flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="hidden sm:inline">{{ formatDate(post.date) }}</span>
            <span class="sm:hidden">{{ formatDateShort(post.date) }}</span>
          </span>

          <!-- Author -->
          <span v-if="post.author?.name" class="hidden sm:flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ post.author.name }}
          </span>

          <!-- Reading Time -->
          <span v-if="post.readingTime" class="hidden sm:flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ post.readingTime }}
          </span>
        </div>

        <!-- Tags -->
        <div v-if="post.tags && post.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="(tag, index) in post._highlightedTags || post.tags.slice(0, isMobile ? 2 : 3)"
            :key="index"
            class="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
            v-html="typeof tag === 'string' ? `#${tag}` : `#${tag}`"
          ></span>
          <span 
            v-if="post.tags.length > (isMobile ? 2 : 3)" 
            class="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            +{{ post.tags.length - (isMobile ? 2 : 3) }} more
          </span>
        </div>
      </div>

      <!-- Search Score (for debugging, can be removed) -->
      <div v-if="showScore && post._searchScore" class="flex-shrink-0">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
          {{ Math.round(post._searchScore) }}
        </span>
      </div>

      <!-- Arrow Icon -->
      <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>

    <!-- Selection Indicator -->
    <div 
      v-if="isSelected" 
      class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r"
    ></div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  showScore: {
    type: Boolean,
    default: false // Set to true for debugging search scores
  }
});

defineEmits(['click', 'mouseenter']);

// Mobile detection
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 640;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

// Format date for mobile (shorter)
function formatDateShort(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ensure highlighted text maintains proper styling */
:deep(mark) {
  background-color: rgb(254 240 138);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

:deep(.dark mark) {
  background-color: rgb(133 77 14);
  color: rgb(254 240 138);
}
</style>