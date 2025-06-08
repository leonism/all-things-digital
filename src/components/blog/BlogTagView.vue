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
        :authorName="post.author?.name || 'Unknown Author'"
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
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="goToPageLocal"
    />
    <div v-if="!tagName" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="tag in allTags"
        :key="tag"
        class="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <router-link :to="`/blog/tag/${getTagSlug(tag)}`">
          #{{ tag }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import postsData from '../../blog-data.json';
import BlogArticleCard from './BlogArticleCard.vue';
import { usePagination } from '../../composables/usePagination';
import Pagination from '../common/Pagination.vue';

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

const goToPageLocal = (page: number) => {
  goToPage(page);
  router.push({
    name: 'tag-archive-pagination',
    params: { tag: route.params.tag, page: String(page) },
  });
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

  console.log('Current tag from route:', tag);

  const filtered = postsData.filter(
    (post) =>
      (!post.status || post.status === 'published') &&
      post.tags &&
      post.tags.map((t) => t.toLowerCase()).includes(tag),
  );
  console.log('Filtered posts for tag:', filtered);

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

const allTags = computed(() => {
  const tags = new Set();
  postsData.forEach((post) => {
    if (post.tags) {
      post.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
});
</script>
