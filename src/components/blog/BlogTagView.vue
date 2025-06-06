<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 dark:text-white">Tag: #{{ tagName }}</h1>
    <div
      v-if="paginatedPosts.length"
      class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <BlogArticleCard
        v-for="post in paginatedPosts"
        :key="post.slug"
        :imageSrc="
          post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'
        "
        :imageAlt="post.featuredImage?.alt || post.title"
        :title="post.title"
        :postLink="`/blog/${post.slug}`"
        :date="post.date"
        :excerpt="post.excerpt || post.description"
        :tags="post.tags"
        :authorImageSrc="post.author?.image || '/assets/img/avatar.png'"
        :authorImageAlt="post.author?.name || 'Author profile picture'"
        :authorLink="post.author?.link || '/about'"
      />
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No posts found with the tag "#{{ tagName }}".</p>
      <router-link
        to="/blog"
        class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block"
        >Back to Blog List</router-link
      >
    </div>
    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="goToPageLocal(currentPage - 1)"
      >
        Previous
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="goToPageLocal(page)"
      >
        {{ page }}
      </button>
      <button :disabled="totalPages" @click="goToPageLocal(currentPage + 1)">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import postsData from '../../blog-data.json';
import BlogArticleCard from './BlogArticleCard.vue';
import { usePagination } from '../../composables/usePagination';

const getTagSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

const route = useRoute();
const router = useRouter();
const tagName = ref(
  Array.isArray(route.params.tag) ? route.params.tag[0] : route.params.tag,
);

const postsPerPage = 6;
const allPosts = ref([]);

const { currentPage, totalPages, goToPage } = usePagination(
  computed(() => allPosts.value.length),
  postsPerPage,
);

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  return allPosts.value.slice(startIndex, endIndex);
});

const goToPageLocal = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    goToPage(page);
    router.push({
      name: 'tag-archive-pagination',
      params: { tag: route.params.tag, page: String(page) },
    });
  }
};

// Computed properties for meta tags
const pageTitle = computed(
  () => `Tag: #${tagName.value || 'Archive'} - All Things Digital`,
);
const pageDescription = computed(
  () => `Posts tagged with #${tagName.value || 'archive'}.`,
);
const canonicalUrl = computed(() => {
  const base = 'https://yourdomain.com';
  return tagName.value
    ? `${base}/blog/tag/${getTagSlug(tagName.value)}`
    : `${base}/blog`;
});

// Watcher to update meta tags whenever the 'tagName' ref changes.
watch(
  tagName,
  (newTagName) => {
    if (newTagName) {
      useHead({
        title: pageTitle.value,
        meta: [
          { name: 'description', content: pageDescription.value },
          { property: 'og:title', content: pageTitle.value },
          { property: 'og:description', content: pageDescription.value },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: canonicalUrl.value },
          { property: 'og:image', content: '/images/default-og-image.png' },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: pageTitle.value },
          { name: 'twitter:description', content: pageDescription.value },
          { name: 'twitter:image', content: '/images/default-og-image.png' },
          { name: 'robots', content: 'index, follow' },
        ],
        link: [{ rel: 'canonical', href: canonicalUrl.value }],
      });
    } else {
      useHead({ title: 'Tag Archive' });
    }
  },
  { immediate: true },
);

onMounted(() => {
  const tag = route.params.tag;
  const page = Number(route.params.page) || 1;

  console.log("Current tag from route:", tag);

  const filtered = postsData.filter(
    (post) =>
      (!post.status || post.status === 'published') &&
      post.tags &&
      post.tags.map((t) => t.toLowerCase()).includes(tag),
  );
  console.log("Filtered posts for tag:", filtered);

  allPosts.value = filtered;
  currentPage.value = page;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error('Error formatting date:', dateString, e);
    return dateString;
  }
};
</script>

<style scoped>
/* Add component-specific styles if necessary */

/* Basic styling for pagination */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem; /* Space between buttons */
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-radius: 0.25rem; /* Rounded corners */
}

.pagination button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #007bff; /* Example active color */
  color: white;
  border-color: #007bff;
}

/* Dark mode styles for pagination */
.dark .pagination button {
  background-color: #333;
  border-color: #555;
  color: #eee;
}

.dark .pagination button:hover:not(:disabled) {
  background-color: #555;
}

.dark .pagination button.active {
  background-color: #0056b3; /* Example active color in dark mode */
  border-color: #0056b3;
}
</style>
