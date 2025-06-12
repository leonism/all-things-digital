<template>
  <section id="blogArticles" class="flex flex-col">
    <BlogArticleCard
      v-for="post in publishedPosts"
      :key="post.slug"
      :imageSrc="post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'"
      :imageAlt="post.featuredImage?.alt || post.title"
      :title="post.title"
      :postLink="`/blog/${post.slug}`"
      :date="post.date"
      :excerpt="post.excerpt"
      :tags="post.tags"
      :authorImageSrc="post.author?.image || '/assets/img/avatar.png'"
      :authorImageAlt="post.author?.name || 'Author profile picture'"
      :authorName="post.author?.name || 'Unknown Author'"
      :category="post.category"
    />
  </section>
</template>

<script setup>
/**
 * BlogGrid Component
 *
 * This component displays a grid of blog posts using the `BlogArticleCard`
 * component. It fetches all posts from `blog-data.json` and filters them
 * to only show published posts.
 *
 * The component uses Vue 3 Composition API with `<script setup>` and a
 * computed property to handle the filtering logic.
 */
import { computed } from 'vue';
import BlogArticleCard from '../common/BlogArticleCard.vue';
import postsData from '../../blog-data.json';

/**
 * Computed property that filters the imported `postsData` array
 * to include only posts where the `status` is 'published' or
 * where the `status` field is not present (assuming it's published by default).
 */
const publishedPosts = computed(() => {
  return postsData.filter(
    (post) => post.status === 'published' || !post.status,
  );
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
