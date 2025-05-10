<!-- src/components/HomeContent.vue -->
<script setup>
import HomeHeader from "/content/ContentHomeHeader.vue";
import FeaturedPost from "/content/ContentFeaturedPost.vue";
import LatestBlog from "/content/ContentLatestBlog.vue";
import BlogGrid from "/content/ContentBlogGrid.vue";
</script>

<template>
  <main
    id="mainWrapper"
    class="max-w-4xl mx-auto">
    <HomeHeader />
    <FeaturedPost />
    <LatestBlog />
    <BlogGrid />
  </main>
</template>
