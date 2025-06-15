import { ref, onMounted, onUnmounted } from 'vue';

export function useLazyLoading(options = {}) {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    loadDelay = 0,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const isVisible = ref(false);
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const hasError = ref(false);
  const loadAttempts = ref(0);
  const targetRef = ref(null);

  let observer = null;
  let retryTimeout = null;

  const load = async (loadFunction) => {
    if (isLoaded.value || isLoading.value) return;

    isLoading.value = true;
    hasError.value = false;
    loadAttempts.value++;

    try {
      if (loadDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, loadDelay));
      }

      if (loadFunction) {
        await loadFunction();
      }

      isLoaded.value = true;
      isLoading.value = false;
    } catch (error) {
      console.error('Lazy loading error:', error);
      isLoading.value = false;
      hasError.value = true;

      // Retry logic
      if (loadAttempts.value < retryAttempts) {
        retryTimeout = setTimeout(() => {
          load(loadFunction);
        }, retryDelay * loadAttempts.value);
      }
    }
  };

  const retry = (loadFunction) => {
    loadAttempts.value = 0;
    hasError.value = false;
    load(loadFunction);
  };

  const observe = (loadFunction) => {
    if (!targetRef.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible.value) {
            isVisible.value = true;
            load(loadFunction);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(targetRef.value);
  };

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
  });

  return {
    targetRef,
    isVisible,
    isLoading,
    isLoaded,
    hasError,
    loadAttempts,
    observe,
    load,
    retry
  };
}
