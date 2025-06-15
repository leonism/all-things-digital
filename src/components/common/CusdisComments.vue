<template>
  <div class="my-8 py-6 border-t border-gray-200 dark:border-gray-700">
    <button @click="toggleComments"
      class="mb-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
      {{ showComments ? 'Hide' : 'Show' }} Comments
    </button>

    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
      <div v-show="showComments" ref="cusdisContainer">
        <div id="cusdis_thread" :data-host="'https://cusdis.com'" :data-app-id="appId" :data-page-id="pageId"
          :data-page-url="pageUrl" :data-page-title="pageTitle" :key="pageId"></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'; // Import onMounted
import { useScript } from '@unhead/vue';

const props = defineProps({
  appId: {
    type: String,
    default: '900c1d23-f0c4-474b-b2e2-9717eb5c22cd', // Your default App ID
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

const pageUrl = computed(() => {
  // Ensure this generates the correct, full URL for the current page
  return typeof window !== 'undefined' ? window.location.href : '';
});

// Load Cusdis script
useScript({
  src: 'https://cusdis.com/js/cusdis.es.js',
  async: true,
  defer: true,
});

const toggleComments = () => {
  showComments.value = !showComments.value;
  if (showComments.value) {
    nextTick(() => {
      if ((window as any).CUSDIS && typeof (window as any).CUSDIS.render === 'function') {
        // (window as any).CUSDIS.render(); // Or similar function if available and needed
      }
    });
  }
};

onMounted(() => { // Use onMounted
  const checkCusdis = () => {
    if ((window as any).CUSDIS && typeof (window as any).CUSDIS.render === 'function') {
      // (window as any).CUSDIS.render(); // Or similar function if available and needed
    } else {
      setTimeout(checkCusdis, 100); // Retry after 100ms
    }
  };
  // Only check Cusdis if comments are initially shown or when toggled on.
  // This might be better placed inside toggleComments or a watcher on showComments.
  if (showComments.value) { 
    checkCusdis();
  }
});

// Watch for pageId changes to potentially re-render Cusdis if it's already visible
// This is important if navigating between posts without a full page reload
watch(() => props.pageId, (newPageId, oldPageId) => {
  if (showComments.value && newPageId !== oldPageId) {
    nextTick(() => {
      // This forces Vue to re-render the #cusdis_thread div by changing its key
      // Cusdis should pick up the new attributes automatically.
      // If Cusdis has a specific API to update/reload, use that instead.
      if ((window as any).CUSDIS && typeof (window as any).CUSDIS.render === 'function') {
        // (window as any).CUSDIS.render(); // Or specific update function
      }
    });
  }
});

// Removed export default block as it's not used with <script setup>
</script>

<style scoped>
/* Add any component-specific styles here */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
