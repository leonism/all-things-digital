<template>
  <ContentLatestBlog>
    <template #latest-posts>
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 p-5">
        <BlogArticleCard
          v-for="post in latestPosts"
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
    </template>
  </ContentLatestBlog>
</template>

<script setup>
import { computed } from 'vue';
import ContentLatestBlog from '../../content/ContentLatestBlog.vue';
import BlogArticleCard from '../blog/BlogArticleCard.vue';
import postsData from '../../blog-data.json';

const latestPosts = computed(() => {
  // Get latest 3 published posts, excluding the featured one if it's among them
  const published = postsData.filter(
    (post) => post.status === 'published' || !post.status,
  );
  const sorted = published.sort((a, b) => new Date(b.date) - new Date(a.date));
  // To exclude the featured post, we need to get the featured post data.
  // For simplicity and to avoid prop drilling, we'll re-calculate it here.
  // In a larger app, a store (like Pinia or Vuex) would be better for shared state.
  const featuredPost = postsData.find(
    (post) => post.featured && (post.status === 'published' || !post.status),
  );
  return sorted.filter((post) => post.slug !== featuredPost?.slug).slice(0, 3);
});
</script>
