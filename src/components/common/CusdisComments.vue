<template>
  <section class="my-6 sm:my-8 py-4 sm:py-6 border-t border-gray-200 dark:border-gray-700" role="region" aria-labelledby="comments-heading">
    <h3 id="comments-heading" class="sr-only">Comments Section</h3>

    <button
      @click="toggleComments"
      :aria-expanded="showComments"
      aria-controls="cusdis-comments-container"
      class="group flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:scale-[1.02] active:scale-[0.98]"
    >
      <svg
        class="w-4 h-4 transition-transform duration-300"
        :class="{ 'rotate-180': showComments }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
      <span class="text-center sm:text-left">
        {{ showComments ? 'Hide' : 'Show' }} Comments
      </span>
      <span class="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium" aria-hidden="true">
        💬
      </span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 transform scale-95"
      enter-to-class="opacity-100 transform scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 transform scale-100"
      leave-to-class="opacity-0 transform scale-95"
    >
      <div
        v-show="showComments"
        id="cusdis-comments-container"
        ref="cusdisContainer"
        class="mt-4 sm:mt-6"
        role="region"
        aria-label="Comments discussion"
      >
        <div
          id="cusdis_thread"
          :data-host="'https://cusdis.com'"
          :data-app-id="appId"
          :data-page-id="pageId"
          :data-page-url="pageUrl"
          :data-page-title="pageTitle"
          data-theme="auto"
          :key="`cusdis-${pageId}`"
          class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Loading state -->
          <div v-if="!cusdisLoaded" class="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm">Loading comments...</span>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const props = defineProps({
  appId: {
    type: String,
    default: '900c1d23-f0c4-474b-b2e2-9717eb5c22cd',
  },
  pageId: {
    type: String,
    required: true,
  },
  pageTitle: {
    type: String,
    required: true,
  },
});

const showComments = ref(false);
const cusdisContainer = ref<HTMLElement | null>(null);
const scriptLoaded = ref(false);
const cusdisLoaded = ref(false);

const pageUrl = computed(() => {
  return typeof window !== 'undefined' ? window.location.href : '';
});

// Load Cusdis script dynamically
const loadCusdisScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (scriptLoaded.value || (window as any).CUSDIS) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cusdis.com/js/cusdis.es.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      scriptLoaded.value = true;
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Cusdis script'));
    };

    document.head.appendChild(script);
  });
};

const initializeCusdis = async () => {
  try {
    cusdisLoaded.value = false;
    await loadCusdisScript();

    // Wait a bit for Cusdis to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    if ((window as any).CUSDIS && typeof (window as any).CUSDIS.render === 'function') {
      (window as any).CUSDIS.render();

      // Add responsive styles to Cusdis iframe when it loads
      setTimeout(() => {
        const cusdisIframe = document.querySelector('#cusdis_thread iframe') as HTMLIFrameElement;
        if (cusdisIframe) {
          cusdisIframe.style.width = '100%';
          cusdisIframe.style.maxWidth = '100%';
          cusdisIframe.style.minHeight = '200px';
          cusdisLoaded.value = true;
        }
      }, 500);
    }
  } catch (error) {
    console.warn('Failed to initialize Cusdis:', error);
    cusdisLoaded.value = true; // Hide loading state even on error
  }
};

const toggleComments = async () => {
  showComments.value = !showComments.value;

  if (showComments.value) {
    await nextTick();
    await initializeCusdis();

    // Focus management for accessibility
    setTimeout(() => {
      const commentsContainer = document.getElementById('cusdis-comments-container');
      if (commentsContainer) {
        commentsContainer.focus();
      }
    }, 300);
  }
};

// Watch for pageId changes to re-render Cusdis
watch(() => props.pageId, async (newPageId, oldPageId) => {
  if (showComments.value && newPageId !== oldPageId) {
    await nextTick();
    await initializeCusdis();
  }
});

onMounted(() => {
  // Pre-load the script but don't initialize until needed
  loadCusdisScript().catch(error => {
    console.warn('Failed to pre-load Cusdis script:', error);
  });
});
</script>

<style scoped>
/* Ensure smooth transitions */
.transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ensure Cusdis forms are responsive */
:deep(#cusdis_thread) {
  width: 100%;
  overflow-x: hidden;
}

:deep(#cusdis_thread iframe) {
  width: 100% !important;
  max-width: 100% !important;
  min-height: 200px;
}

:deep(#cusdis_thread .cusdis-container) {
  width: 100% !important;
  max-width: 100% !important;
}

/* Mobile-specific adjustments */
@media (max-width: 640px) {
  :deep(#cusdis_thread) {
    font-size: 14px;
  }

  :deep(#cusdis_thread input),
  :deep(#cusdis_thread textarea) {
    font-size: 16px; /* Prevents zoom on iOS */
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  :deep(#cusdis_thread button) {
    min-height: 44px; /* Touch target size */
    padding: 12px 16px;
  }
}
</style>
