<template>
  <section id="homeBlogArticles" class="flex flex-col">
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <BlogArticleCard
        v-for="post in limitedPosts"
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
    <div
      v-if="limitedPosts.length === 0"
      class="text-center text-gray-500 dark:text-gray-400 py-10"
    >
      <p>No blog posts found.</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import BlogArticleCard from '../components/blog/BlogArticleCard.vue';
import postsData from '../blog-data.json';

const limitedPosts = computed(() => {
  // Get only published posts and limit to, for example, 3 for the home page grid
  return postsData
    .filter((post) => post.status === 'published' || !post.status)
    .slice(0, 3);
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
