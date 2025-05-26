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
      :excerpt="post.excerpt || post.description"
      :tags="post.tags"
      :authorImageSrc="post.author?.image || '/assets/img/avatar.png'"
      :authorImageAlt="post.author?.name || 'Author profile picture'"
      :authorLink="post.author?.link || '/about'"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import BlogArticleCard from '@/components/blog/BlogArticleCard.vue';
import postsData from '@/data/blog-data.json';

const publishedPosts = computed(() => {
  return postsData.filter(post => post.status === 'published' || !post.status);
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
