import { ref, computed } from 'vue';

/**
 * A Vue composition function to handle pagination logic.
 *
 * @param {Ref<number>} totalPosts - A reactive reference to the total number of posts/items.
 * @param {number} [postsPerPage=6] - The number of posts/items to display per page (default is 6).
 * @returns {Object} An object containing:
 *   - currentPage: A reactive reference to the current active page.
 *   - totalPages: A computed property that calculates the total number of pages based on totalPosts and postsPerPage.
 *   - goToPage: A method to navigate to a specific page if it's within valid range.
 */
export function usePagination(totalPosts, postsPerPage = 6) {
  // Reactive reference to track the current page number, initialized to 1.
  const currentPage = ref(1);

  // Computed property to calculate the total number of pages by dividing totalPosts by postsPerPage,
  // rounding up to ensure all posts are accounted for even if the last page has fewer items.
  const totalPages = computed(() => {
    return Math.ceil(totalPosts.value / postsPerPage);
  });

  /**
   * Function to navigate to a specific page.
   * Ensures the requested page is within the valid range (1 to totalPages).
   * If valid, updates the currentPage value.
   *
   * @param {number} page - The page number to navigate to.
   */
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  // Expose the reactive state and methods for use in components.
  return {
    currentPage, // Reactive reference to the current page.
    totalPages, // Computed property for total number of pages.
    goToPage, // Method to navigate to a specific page.
  };
}
