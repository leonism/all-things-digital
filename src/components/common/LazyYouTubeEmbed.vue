<template>
  <div ref="embedContainer" class="youtube-embed-container aspect-video">
    <iframe
      v-if="iframeSrc"
      :src="iframeSrc"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="w-full h-full"
      :title="title"
    ></iframe>
    <div v-else class="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700">
      <!-- Optional: Placeholder content or loading spinner -->
      <p class="text-gray-500 dark:text-gray-400">Loading YouTube Video...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'YouTube video player',
  },
});

const embedContainer = ref(null);
const iframeSrc = ref(null);
let observer = null;

const loadVideo = () => {
  iframeSrc.value = `https://www.youtube.com/embed/${props.videoId}?autoplay=0&rel=0`;
};

onMounted(() => {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadVideo();
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px 0px' } // Load when 200px away from viewport
    );
    if (embedContainer.value) {
      observer.observe(embedContainer.value);
    }
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    loadVideo();
  }
});

onBeforeUnmount(() => {
  if (observer && embedContainer.value) {
    observer.unobserve(embedContainer.value);
  }
});
</script>

<style scoped>
.youtube-embed-container {
  position: relative;
  overflow: hidden;
  width: 100%;
}
</style>
