<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <article
      v-if="post"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <ContentBlogPostHeader
        :title="post.title"
        :subtitle="post.subtitle"
        :date="post.date"
        :tags="post.tags"
      />
      <img
        v-if="post.featuredImage && post.featuredImage.src"
        :src="post.featuredImage.src"
        :alt="post.featuredImage.alt || post.title"
        class="w-full h-64 md:h-96 object-cover"
      />
      <BlogPostContent :post="post" />
    </article>
    <PostNotFound v-else />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ContentBlogPostHeader from '../components/header/ContentBlogPostHeader.vue';
import BlogPostContent from '../components/blog/BlogPostContent.vue';
import BlogPostMetaTags from '../components/blog/BlogPostMetaTags.vue';
import PostNotFound from '../components/blog/PostNotFound.vue';
import postsData from '../blog-data.json';

const route = useRoute();
const post = ref(null);

// Use the BlogPostMetaTags composable
// This will handle the useHead logic based on the 'post' ref
BlogPostMetaTags({ post });

const findPost = (slug) => {
  const foundPost = postsData.find((p) => p.slug === slug);
  return foundPost && (!foundPost.status || foundPost.status === 'published')
    ? foundPost
    : null;
};

// Watch route changes to update the post
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      post.value = findPost(newSlug);
    }
  },
  { immediate: true },
);
</script>

<style>
/* Styles for Tailwind Typography */
.prose :where(code):not(:where([class~='not-prose'] *))::before,
.prose :where(code):not(:where([class~='not-prose'] *))::after {
  content: '';
}
</style>
