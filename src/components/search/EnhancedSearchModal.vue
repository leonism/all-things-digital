<template>
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-start justify-center pt-2 sm:pt-4 md:pt-8 lg:pt-16 bg-gray-900/75 backdrop-blur-sm"
      @click.self="closeModal"
      @keydown.esc="closeModal"
    >
      <div
        class="relative w-full max-w-xs sm:max-w-sm md:max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 mx-2 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] md:max-h-[80vh] flex flex-col"
        style="
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        <!-- Close Button - Center aligned with search elements -->
        <button
          @click="closeModal"
          class="absolute sm:-p-2 md:ml-3 md:p-2 md:mt-1 top-6 sm:top-4 right-4 sm:right-5 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close search modal"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Search Header -->
        <div
          class="p-3 sm:p-4 pr-12 sm:pr-16 border-b border-gray-200 dark:border-gray-700"
        >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="search"
              placeholder="Search posts, categories, tags..."
              class="block w-full pl-9 sm:pl-10 pr-14 sm:pr-16 py-2.5 sm:py-3 border-0 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-colors text-sm sm:text-base"
              @keydown.down.prevent="navigateFilteredResults('down')"
              @keydown.up.prevent="navigateFilteredResults('up')"
              @keydown.enter.prevent="selectCurrentResult"
              @keydown.tab.prevent="selectSuggestion"
            />
            <div
              class="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
            >
              <kbd
                class="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded border border-gray-300 dark:border-gray-600"
              >
                ESC
              </kbd>
            </div>
          </div>

          <!-- Search Stats -->
          <div class="mt-2">
            <SearchStats
              :total-results="filteredResults.length"
              :query="searchQuery"
              :search-time="searchTime"
              :categories="resultCategories"
              @filter-category="handleCategoryFilter"
            />
          </div>
        </div>

        <!-- Search Content -->
        <div class="flex-1 overflow-hidden">
          <!-- Loading State -->
          <div v-if="isSearching" class="p-6 text-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"
            ></div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </p>
          </div>

          <!-- No Query State - Show Suggestions -->
          <div v-else-if="!searchQuery" class="p-4 space-y-6">
            <!-- Recent Searches -->
            <div v-if="recentSearches.length > 0">
              <h3
                class="text-sm font-medium text-gray-900 dark:text-white mb-3"
              >
                Recent Searches
              </h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="recent in recentSearches"
                  :key="recent"
                  @click="searchQuery = recent"
                  class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {{ recent }}
                </button>
              </div>
            </div>

            <!-- Quick Suggestions -->
            <div>
              <h3
                class="text-sm font-medium text-gray-900 dark:text-white mb-3"
              >
                Browse by Category
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  v-for="category in searchSuggestions.categories"
                  :key="category"
                  @click="searchQuery = category"
                  class="p-2 sm:p-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ category }}
                  </div>
                </button>
              </div>
            </div>

            <!-- Popular Tags -->
            <div>
              <h3
                class="text-sm font-medium text-gray-900 dark:text-white mb-3"
              >
                Popular Tags
              </h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in searchSuggestions.tags"
                  :key="tag"
                  @click="searchQuery = tag"
                  class="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  #{{ tag }}
                </button>
              </div>
            </div>
          </div>

          <!-- Search Results -->
          <div
            v-else-if="filteredResults.length > 0"
            class="overflow-y-auto max-h-48 sm:max-h-64 md:max-h-80 lg:max-h-96"
          >
            <!-- Grouped Results -->
            <div
              v-if="
                Object.keys(filteredGroupedResults).length > 1 &&
                !activeCategoryFilter
              "
              class="p-3 sm:p-4 space-y-4 sm:space-y-6"
            >
              <div
                v-for="(posts, category) in filteredGroupedResults"
                :key="category"
              >
                <h3
                  class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 uppercase tracking-wide"
                >
                  {{ category }} ({{ posts.length }})
                </h3>
                <div class="space-y-1 sm:space-y-2">
                  <SearchResultItem
                    v-for="(post, index) in posts"
                    :key="post.slug"
                    :post="post"
                    :is-selected="
                      filteredSelectedIndex === getFilteredGlobalIndex(post)
                    "
                    @click="selectPost(post)"
                    @mouseenter="
                      filteredSelectedIndex = getFilteredGlobalIndex(post)
                    "
                  />
                </div>
              </div>
            </div>

            <!-- Flat Results -->
            <div v-else class="p-3 sm:p-4 space-y-1 sm:space-y-2">
              <SearchResultItem
                v-for="(post, index) in filteredResults"
                :key="post.slug"
                :post="post"
                :is-selected="filteredSelectedIndex === index"
                @click="selectPost(post)"
                @mouseenter="filteredSelectedIndex = index"
              />
            </div>
          </div>

          <!-- No Results -->
          <div v-else-if="searchQuery" class="p-6 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m8 0V7a2 2 0 012 2v6.414l-1.293-1.293a1 1 0 00-1.414 0L12 16.414l-2.293-2.293a1 1 0 00-1.414 0L7 15.414V9a2 2 0 012-2h6a2 2 0 012 2v6.414z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No results found
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No posts found for "<span class="font-medium">{{
                searchQuery
              }}</span
              >"
            </p>
            <div class="mt-4">
              <button
                @click="clearSearch"
                class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Clear search
              </button>
            </div>
          </div>
        </div>

        <!-- Search Footer -->
        <div
          class="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-bl-2xl rounded-br-2xl"
        >
          <div
            class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
          >
            <div class="flex items-center space-x-2 sm:space-x-4">
              <span class="flex items-center">
                <kbd
                  class="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
                  >↑↓</kbd
                >
                <span class="ml-1 sm:ml-2 hidden sm:inline">Navigate</span>
                <span class="ml-1 sm:hidden">Nav</span>
              </span>
              <span class="flex items-center">
                <kbd
                  class="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs"
                  >↵</kbd
                >
                <span class="ml-1 sm:ml-2 hidden sm:inline">Select</span>
                <span class="ml-1 sm:hidden">OK</span>
              </span>
            </div>
            <div class="flex items-center space-x-1 sm:space-x-2">
              <img
                src="../../assets/img/icons/logo-footer.png"
                alt="Logo"
                class="w-6 h-6 sm:w-6 sm:h-6 border-gray-300 dark:border-gray-600 rounded-full opacity-40 dark:opacity-40 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300"
              />
              <span class="hidden sm:inline">Search powered by Vue</span>
              <span class="sm:hidden text-xs">Vue Search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSearch } from '@/composables/useSearch';
import SearchResultItem from './SearchResultItem.vue';
import SearchSuggestions from './SearchSuggestions.vue';
import SearchStats from './SearchStats.vue';

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const router = useRouter();
const searchInput = ref(null);

// Use the enhanced search composable
const {
  searchQuery,
  searchResults,
  isSearching,
  searchStats,
  selectedIndex,
  recentSearches,
  groupedResults,
  searchSuggestions,
  navigateResults,
  selectResult,
  clearSearch,
  addToRecentSearches,
} = useSearch();

// Additional computed properties for the template
const searchTime = computed(() => searchStats.value?.time || null);

// Active category filter state
const activeCategoryFilter = ref(null);

// Separate selected index for filtered results
const filteredSelectedIndex = ref(-1);

// Filtered search results based on category filter
const filteredResults = computed(() => {
  if (!activeCategoryFilter.value) {
    return searchResults.value;
  }
  return searchResults.value.filter(
    (result) => (result.category || 'Other') === activeCategoryFilter.value,
  );
});

// Result categories with active state
const resultCategories = computed(() => {
  const categories = {};
  searchResults.value.forEach((result) => {
    const category = result.category || 'Other';
    if (!categories[category]) {
      categories[category] = {
        name: category,
        count: 0,
        active: activeCategoryFilter.value === category,
      };
    }
    categories[category].count++;
  });
  return Object.values(categories);
});

// Update grouped results to use filtered results
const filteredGroupedResults = computed(() => {
  const grouped = {};
  filteredResults.value.forEach((result) => {
    const category = result.category || 'Other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(result);
  });
  return grouped;
});
const suggestions = computed(() => searchSuggestions.value || []);

// Get global index for grouped results
function getGlobalIndex(post) {
  return searchResults.value.findIndex((result) => result.slug === post.slug);
}

// Get global index for filtered results
function getFilteredGlobalIndex(post) {
  return filteredResults.value.findIndex((result) => result.slug === post.slug);
}

// Navigate to selected post
function selectPost(post) {
  addToRecentSearches(searchQuery.value);
  router.push(`/blog/${post.slug}`);
  closeModal();
}

// Select current highlighted result
function selectCurrentResult() {
  const results = filteredResults.value;
  if (
    results.length > 0 &&
    filteredSelectedIndex.value >= 0 &&
    filteredSelectedIndex.value < results.length
  ) {
    selectPost(results[filteredSelectedIndex.value]);
  }
}

// Select suggestion with Tab
function selectSuggestion() {
  if (!searchQuery.value && searchSuggestions.value.categories.length > 0) {
    searchQuery.value = searchSuggestions.value.categories[0];
  }
}

// Close modal
function closeModal() {
  clearSearch();
  activeCategoryFilter.value = null;
  emit('close');
}

// Prevent body scroll when modal is open
function preventBodyScroll() {
  document.body.style.overflow = 'hidden';
}

function restoreBodyScroll() {
  document.body.style.overflow = '';
}

// Handle category filter
function handleCategoryFilter(categoryName) {
  if (activeCategoryFilter.value === categoryName) {
    // If clicking the same category, remove filter
    activeCategoryFilter.value = null;
  } else {
    // Set new category filter
    activeCategoryFilter.value = categoryName;
  }
  // Reset selected index when filtering
  filteredSelectedIndex.value = 0;
}

// Navigate filtered results with keyboard
function navigateFilteredResults(direction) {
  const maxIndex = filteredResults.value.length - 1;

  if (maxIndex < 0) return;

  if (direction === 'down') {
    filteredSelectedIndex.value =
      filteredSelectedIndex.value < maxIndex
        ? filteredSelectedIndex.value + 1
        : 0;
  } else if (direction === 'up') {
    filteredSelectedIndex.value =
      filteredSelectedIndex.value > 0
        ? filteredSelectedIndex.value - 1
        : maxIndex;
  }

  // Scroll selected item into view
  nextTick(() => {
    const selectedElement = document.querySelector(
      '.search-result-item.selected',
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

// Apply suggestion
function applySuggestion(suggestion) {
  searchQuery.value = suggestion;
}

// Handle keyboard shortcuts
function handleKeydown(event) {
  if (event.key === '/' && !props.showModal) {
    event.preventDefault();
    // We can't emit 'open' from this component since it doesn't control its own visibility
    // The parent component (App.vue) should handle this global shortcut
    return;
  }

  if (!props.showModal) return;

  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      closeModal();
      break;
    case 'ArrowDown':
      event.preventDefault();
      navigateResults('down');
      break;
    case 'ArrowUp':
      event.preventDefault();
      navigateResults('up');
      break;
    case 'Enter':
      event.preventDefault();
      selectCurrentResult();
      break;
    case 'Tab':
      if (!searchQuery.value) {
        event.preventDefault();
        selectSuggestion();
      }
      break;
  }
}

// Focus input when modal opens and handle body scroll
watch(
  () => props.showModal,
  (newValue) => {
    if (newValue) {
      preventBodyScroll();
      filteredSelectedIndex.value = -1;
      nextTick(() => {
        searchInput.value?.focus();
      });
    } else {
      restoreBodyScroll();
      filteredSelectedIndex.value = -1;
    }
  },
);

// Reset filtered selected index when search query or filter changes
watch([searchQuery, activeCategoryFilter], () => {
  filteredSelectedIndex.value = filteredResults.value.length > 0 ? 0 : -1;
});

// Cleanup on unmount
onUnmounted(() => {
  restoreBodyScroll();
});

// Add global keyboard listener
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Custom scrollbar for search results */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

/* Dark mode scrollbar */
.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(75, 85, 99, 0.7);
}
</style>
