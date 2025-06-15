<template>
  <div ref="imageContainer" class="lazy-image-container h-full">
    <!-- Loading placeholder -->
    <div
      v-if="!isLoaded && !hasError"
      class="image-placeholder"
      :class="placeholderClass"
      :style="{ aspectRatio: aspectRatio }"
    >
      <div v-if="showSkeleton" class="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full rounded"></div>
      <div v-else-if="showSpinner" class="flex items-center justify-center w-full h-full">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
      <div v-else class="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="hasError"
      class="error-placeholder flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded"
      :style="{ aspectRatio: aspectRatio }"
    >
      <svg class="w-8 h-8 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      <p class="text-sm text-red-600 dark:text-red-400 text-center mb-2">Failed to load image</p>
      <button
        @click="retryLoad"
        class="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Actual optimized picture -->
    <Transition
      name="fade"
      @enter="onImageEnter"
      @after-enter="onImageAfterEnter"
    >
      <OptimizedPicture
        v-if="shouldLoad && !hasError"
        v-bind="$props"
        :img-class="`${imgClass} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`"
        @load="onImageLoad"
        @error="onImageError"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLazyLoading } from '../../composables/useLazyLoading.js';
import OptimizedPicture from './OptimizedPicture.vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    default: null,
  },
  height: {
    type: [String, Number],
    default: null,
  },
  sizes: {
    type: String,
    default: '100vw',
  },
  imgClass: {
    type: String,
    default: '',
  },
  placeholderClass: {
    type: String,
    default: '',
  },
  loadingType: {
    type: String,
    default: 'skeleton', // 'skeleton', 'spinner', 'placeholder'
    validator: (value) => ['skeleton', 'spinner', 'placeholder'].includes(value)
  },
  eager: {
    type: Boolean,
    default: false
  },
  rootMargin: {
    type: String,
    default: '50px'
  },
  threshold: {
    type: Number,
    default: 0.1
  }
});

const emit = defineEmits(['load', 'error', 'visible']);

const imageContainer = ref(null);
const isLoaded = ref(false);
const hasError = ref(false);
const shouldLoad = ref(props.eager);

const showSkeleton = computed(() => props.loadingType === 'skeleton');
const showSpinner = computed(() => props.loadingType === 'spinner');

const aspectRatio = computed(() => {
  if (props.width && props.height) {
    return `${props.width} / ${props.height}`;
  }
  return 'auto';
});

const {
  targetRef,
  isVisible,
  observe
} = useLazyLoading({
  rootMargin: props.rootMargin,
  threshold: props.threshold
});

const onImageLoad = () => {
  isLoaded.value = true;
  emit('load');
};

const onImageError = () => {
  hasError.value = true;
  emit('error');
};

const onImageEnter = (el) => {
  el.style.opacity = '0';
};

const onImageAfterEnter = (el) => {
  el.style.opacity = '1';
};

const retryLoad = () => {
  hasError.value = false;
  isLoaded.value = false;
  shouldLoad.value = true;
};

onMounted(() => {
  targetRef.value = imageContainer.value;

  if (!props.eager) {
    observe(() => {
      shouldLoad.value = true;
      emit('visible');
    });
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.lazy-image-container {
  position: relative;
  overflow: hidden;
  /* h-full is now applied directly in the template for clarity */
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
}

.dark .image-placeholder {
  background-color: #374151;
}
</style>
