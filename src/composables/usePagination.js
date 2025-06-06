import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export function usePagination(totalPosts, postsPerPage = 6) {
  const currentPage = ref(1);
  const router = useRouter();

  const totalPages = computed(() => {
    return Math.ceil(totalPosts.value / postsPerPage);
  });

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      router.push({ params: { page: String(page) } });
    }
  };

  return {
    currentPage,
    totalPages,
    goToPage,
  };
}
