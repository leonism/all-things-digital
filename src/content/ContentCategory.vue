<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <ContentCategoryHeader :categoryName="category" />
    <section id="blogArticles" class="flex flex-col">
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
      <div
        v-if="filteredPosts.length === 0"
        class="text-center text-gray-500 dark:text-gray-400 py-10"
      >
        <p>No blog posts found for this category.</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import BlogArticleCard from '../components/blog/BlogArticleCard.vue';
import ContentCategoryHeader from '../components/heading/ContentCategoryHeader.vue';
import postsData from '../../blog-data.json';

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
});

const filteredPosts = computed(() => {
  return postsData.filter(
    (post) =>
      (post.status === 'published' || !post.status) &&
      (post.category?.toLowerCase() === props.category.toLowerCase() ||
        (post.categories &&
          post.categories
            .map((c) => c.toLowerCase())
            .includes(props.category.toLowerCase()))),
  );
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
