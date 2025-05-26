<template>
  <BaseLayout>
    <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
      <CategoryHeader :categoryName="categoryName" />
      <div
        v-if="filteredPosts.length"
        class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <BlogArticleCard
          v-for="post in filteredPosts"
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
        <p>No posts found in the category "{{ categoryName }}".</p>
        <router-link
          to="/blog"
          class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block"
          >Back to Blog List</router-link
        >
      </div>
    </main>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import BaseLayout from '@/layouts/BaseLayout.vue';
import CategoryHeader from '@/components/header/HeaderCategory.vue';
import BlogArticleCard from '@/components/blog/BlogArticleCard.vue';
import postsData from '@/data/blog-data.json';

const route = useRoute();
const categoryName = ref(route.params.category);

const filteredPosts = computed(() => {
  if (!categoryName.value) return [];
  const lowerCaseCategory = categoryName.value.toLowerCase();
  return postsData.filter(
    (post) =>
      (!post.status || post.status === 'published') &&
      post.categories &&
      post.categories.map((c) => c.toLowerCase()).includes(lowerCaseCategory),
  );
});

// Computed properties for meta tags
const pageTitle = computed(
  () => `Category: ${categoryName.value || 'Archive'} | DGPond.COM`,
); // Updated title
const pageDescription = computed(
  () => `Posts categorized under ${categoryName.value || 'archive'}.`,
);
const canonicalUrl = computed(() => {
  const base = 'https://yourdomain.com'; // <<<--- IMPORTANT: Replace with your actual domain
  return categoryName.value
    ? `${base}/blog/category/${encodeURIComponent(categoryName.value)}`
    : `${base}/blog`;
});

// Update meta tags using useHead, reacting to categoryName changes
watch(
  categoryName,
  (newCategoryName) => {
    if (newCategoryName) {
      useHead({
        title: pageTitle.value,
        meta: [
          { name: 'description', content: pageDescription.value },
          { property: 'og:title', content: pageTitle.value },
          { property: 'og:description', content: pageDescription.value },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: canonicalUrl.value },
          { property: 'og:image', content: '/images/default-og-image.png' }, // Default image for category pages
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: pageTitle.value },
          { name: 'twitter:description', content: pageDescription.value },
          { name: 'twitter:image', content: '/images/default-og-image.png' }, // Default image
          { name: 'robots', content: 'index, follow' }, // Allow indexing for category pages
        ],
        link: [{ rel: 'canonical', href: canonicalUrl.value }],
      });
    } else {
      useHead({ title: 'Category Archive' });
    }
  },
  { immediate: true },
);

// Watch route param changes
watch(
  () => route.params.category,
  (newCategory) => {
    categoryName.value = newCategory;
    // Meta tags are updated by the categoryName watcher
  },
);

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
</style>
