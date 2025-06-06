import { ref, computed } from 'vue';

export function usePagination(totalPosts, postsPerPage = 6) {
  const currentPage = ref(1);

  const totalPages = computed(() => {
    return Math.ceil(totalPosts.value / postsPerPage);
  });

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  return {
    currentPage,
    totalPages,
    goToPage,
  };
}
