<template>
  <BaseLayout>
    <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
      <ContentHomeHeader />
      <ContentFeaturedPost
        v-if="featuredPost"
        :imageSrc="featuredPost.featuredImage?.src || '/assets/img/featured-blog-comp.jpg'"
        :imageAlt="featuredPost.featuredImage?.alt || featuredPost.title"
        :title="featuredPost.title"
        :postLink="`/blog/${featuredPost.slug}`"
        :date="featuredPost.date"
        :category="featuredPost.category || (featuredPost.categories && featuredPost.categories[0]) || 'Uncategorized'"
        :categoryLink="`/blog/category/${(featuredPost.category || (featuredPost.categories && featuredPost.categories[0]) || 'uncategorized').toLowerCase()}`"
        :tags="featuredPost.tags"
        :authorImageSrc="featuredPost.author?.image || '/assets/img/avatar.png'"
        :authorImageAlt="featuredPost.author?.name || 'Author profile photo'"
        :authorLink="featuredPost.author?.link || '/about'"
      />
      <ContentLatestBlog>
        <template #latest-posts>
          <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 p-5">
            <BlogArticleCard
              v-for="post in latestPosts"
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
          </div>
        </template>
      </ContentLatestBlog>
      <HomeBlogGrid />
    </main>
  </BaseLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useHead } from '@unhead/vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import ContentHomeHeader from '../components/header/ContentHomeHeader.vue';
import ContentFeaturedPost from '../content/ContentFeaturedPost.vue';
import ContentLatestBlog from '../content/ContentLatestBlog.vue';
import HomeBlogGrid from '../content/HomeBlogGrid.vue';
import BlogArticleCard from '../components/BlogArticleCard.vue'; // Needed for the latest posts slot
import postsData from '../../blog-data.json';

useHead({
  title: 'DGPond.COM',
});

const featuredPost = computed(() => {
  return postsData.find(post => post.featured && (post.status === 'published' || !post.status));
});

const latestPosts = computed(() => {
  // Get latest 3 published posts, excluding the featured one if it's among them
  const published = postsData.filter(post => post.status === 'published' || !post.status);
  const sorted = published.sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted.filter(post => post.slug !== featuredPost.value?.slug).slice(0, 3);
});
</script>

<style scoped>
/* Scoped styles for this view if any */
</style>
