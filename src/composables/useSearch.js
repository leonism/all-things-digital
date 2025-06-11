import { ref, computed, watch } from 'vue';
import postsData from '../blog-data.json';

/**
 * Enhanced search composable with Algolia-like features
 * Provides instant search, fuzzy matching, highlighting, and categorized results
 */
export function useSearch() {
  const searchQuery = ref('');
  const searchResults = ref([]);
  const isSearching = ref(false);
  const searchStats = ref({ total: 0, time: 0 });
  const selectedIndex = ref(-1);

  // Search configuration
  const searchConfig = {
    minQueryLength: 1,
    maxResults: 50,
    fuzzyThreshold: 0.6,
    highlightPreTag: '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">',
    highlightPostTag: '</mark>'
  };

  /**
   * Calculate string similarity using Levenshtein distance
   */
  function calculateSimilarity(str1, str2) {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0) return len2;
    if (len2 === 0) return len1;

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
  }

  /**
   * Highlight matching text in search results
   */
  function highlightText(text, query) {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, `${searchConfig.highlightPreTag}$1${searchConfig.highlightPostTag}`);
  }

  /**
   * Extract relevant snippet from content
   */
  function extractSnippet(content, query, maxLength = 150) {
    if (!content || !query) return '';
    
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);
    
    if (index === -1) {
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
    }
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, start + maxLength);
    const snippet = content.substring(start, end);
    
    return (start > 0 ? '...' : '') + snippet + (end < content.length ? '...' : '');
  }

  /**
   * Calculate search score for a post
   */
  function calculateScore(post, query) {
    const lowerQuery = query.toLowerCase();
    let score = 0;
    
    // Title match (highest weight)
    if (post.title) {
      const titleLower = post.title.toLowerCase();
      if (titleLower.includes(lowerQuery)) {
        score += titleLower.indexOf(lowerQuery) === 0 ? 100 : 80;
      }
      score += calculateSimilarity(titleLower, lowerQuery) * 50;
    }
    
    // Exact tag match (high weight)
    if (post.tags) {
      const exactTagMatch = post.tags.some(tag => 
        tag.toLowerCase() === lowerQuery
      );
      if (exactTagMatch) score += 90;
      
      const partialTagMatch = post.tags.some(tag => 
        tag.toLowerCase().includes(lowerQuery)
      );
      if (partialTagMatch) score += 60;
    }
    
    // Category match (medium weight)
    if (post.category && post.category.toLowerCase().includes(lowerQuery)) {
      score += 70;
    }
    
    // Description/excerpt match (medium weight)
    if (post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery)) {
      score += 40;
    }
    
    // Author match (low weight)
    if (post.author?.name && post.author.name.toLowerCase().includes(lowerQuery)) {
      score += 30;
    }
    
    // Content match (low weight, if available)
    if (post.contentHtml && post.contentHtml.toLowerCase().includes(lowerQuery)) {
      score += 20;
    }
    
    return score;
  }

  /**
   * Perform the search operation
   */
  function performSearch(query) {
    const startTime = performance.now();
    isSearching.value = true;
    
    if (!query || query.length < searchConfig.minQueryLength) {
      searchResults.value = [];
      searchStats.value = { total: 0, time: 0 };
      isSearching.value = false;
      return;
    }
    
    const results = postsData
      .map(post => {
        const score = calculateScore(post, query);
        
        if (score > 0) {
          return {
            ...post,
            _searchScore: score,
            _highlightedTitle: highlightText(post.title, query),
            _highlightedExcerpt: highlightText(
              extractSnippet(post.excerpt || post.description || '', query),
              query
            ),
            _highlightedCategory: highlightText(post.category, query),
            _highlightedTags: post.tags?.map(tag => highlightText(tag, query)) || [],
            _snippet: extractSnippet(post.excerpt || post.description || '', query)
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b._searchScore - a._searchScore)
      .slice(0, searchConfig.maxResults);
    
    const endTime = performance.now();
    
    searchResults.value = results;
    searchStats.value = {
      total: results.length,
      time: Math.round(endTime - startTime)
    };
    isSearching.value = false;
    selectedIndex.value = -1;
  }

  /**
   * Group search results by category
   */
  const groupedResults = computed(() => {
    const groups = {};
    
    searchResults.value.forEach(result => {
      const category = result.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(result);
    });
    
    return groups;
  });

  /**
   * Get recent searches (could be stored in localStorage)
   */
  const recentSearches = ref([]);
  
  function addToRecentSearches(query) {
    if (!query || query.length < 2) return;
    
    const recent = recentSearches.value.filter(item => item !== query);
    recent.unshift(query);
    recentSearches.value = recent.slice(0, 5); // Keep only 5 recent searches
    
    // Store in localStorage
    try {
      localStorage.setItem('search-recent', JSON.stringify(recentSearches.value));
    } catch (e) {
      console.warn('Could not save recent searches to localStorage');
    }
  }
  
  function loadRecentSearches() {
    try {
      const stored = localStorage.getItem('search-recent');
      if (stored) {
        recentSearches.value = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load recent searches from localStorage');
    }
  }

  /**
   * Keyboard navigation
   */
  function navigateResults(direction) {
    const maxIndex = searchResults.value.length - 1;
    
    if (direction === 'down') {
      selectedIndex.value = selectedIndex.value < maxIndex ? selectedIndex.value + 1 : 0;
    } else if (direction === 'up') {
      selectedIndex.value = selectedIndex.value > 0 ? selectedIndex.value - 1 : maxIndex;
    }
  }
  
  function selectResult() {
    if (selectedIndex.value >= 0 && searchResults.value[selectedIndex.value]) {
      return searchResults.value[selectedIndex.value];
    }
    return null;
  }

  /**
   * Clear search
   */
  function clearSearch() {
    searchQuery.value = '';
    searchResults.value = [];
    selectedIndex.value = -1;
    searchStats.value = { total: 0, time: 0 };
  }

  /**
   * Get search suggestions based on available content
   */
  const searchSuggestions = computed(() => {
    if (!searchQuery.value || searchQuery.value.length < 2) {
      return {
        categories: [...new Set(postsData.map(post => post.category))].slice(0, 5),
        tags: [...new Set(postsData.flatMap(post => post.tags || []))].slice(0, 8),
        authors: [...new Set(postsData.map(post => post.author?.name).filter(Boolean))].slice(0, 3)
      };
    }
    
    const query = searchQuery.value.toLowerCase();
    const categories = [...new Set(postsData.map(post => post.category))]
      .filter(cat => cat.toLowerCase().includes(query))
      .slice(0, 3);
    
    const tags = [...new Set(postsData.flatMap(post => post.tags || []))]
      .filter(tag => tag.toLowerCase().includes(query))
      .slice(0, 5);
    
    const authors = [...new Set(postsData.map(post => post.author?.name).filter(Boolean))]
      .filter(author => author.toLowerCase().includes(query))
      .slice(0, 2);
    
    return { categories, tags, authors };
  });

  // Watch for search query changes and perform search
  watch(searchQuery, (newQuery) => {
    performSearch(newQuery);
  }, { immediate: false });

  // Load recent searches on initialization
  loadRecentSearches();

  return {
    // State
    searchQuery,
    searchResults,
    isSearching,
    searchStats,
    selectedIndex,
    recentSearches,
    
    // Computed
    groupedResults,
    searchSuggestions,
    
    // Methods
    performSearch,
    clearSearch,
    navigateResults,
    selectResult,
    addToRecentSearches,
    highlightText,
    extractSnippet
  };
}