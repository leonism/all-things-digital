<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <HeaderHome />

    <BlogFeaturedPost
      v-if="featuredPost"
      :imageSrc="featuredImageSrc"
      :imageAlt="featuredImageAlt"
      :title="featuredPost.title"
      :postLink="`/blog/${featuredPost.slug}`"
      :date="featuredPost.date"
      :category="postCategory"
      :categoryLink="categoryLink"
      :tags="featuredPost.tags"
      :authorImageSrc="authorImageSrc"
      :authorImageAlt="authorImageAlt"
      :authorLink="authorLink"
    />

    <BlogLatestPost>
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
    </BlogLatestPost>

    <BlogGridHome />
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useHead } from '@unhead/vue';

import HeaderHome from '../components/header/HeaderHome.vue';
import BlogFeaturedPost from '../components/blog/BlogFeaturedPost.vue';
import BlogLatestPost from '../components/blog/BlogLatestPost.vue';
import BlogGridHome from '../components/blog/BlogGridHome.vue';
import BlogArticleCard from '../components/blog/BlogArticleCard.vue';

import { useFeaturedPost } from '../composables/useFeaturedPost';
import { useLatestPosts } from '../composables/useLatestPosts';

useHead({ title: 'DGPond.COM' });

const featuredPost = useFeaturedPost();
const latestPosts = useLatestPosts();

const featuredImageSrc = computed(
  () =>
    featuredPost.value?.featuredImage?.src ||
    '/assets/img/featured-blog-comp.jpg',
);
const featuredImageAlt = computed(
  () => featuredPost.value?.featuredImage?.alt || featuredPost.value?.title,
);
const postCategory = computed(
  () =>
    featuredPost.value?.category ||
    featuredPost.value?.categories?.[0] ||
    'Uncategorized',
);
const categoryLink = computed(
  () => `/blog/category/${postCategory.value.toLowerCase()}`,
);
const authorImageSrc = computed(
  () => featuredPost.value?.author?.image || '/assets/img/avatar.png',
);
const authorImageAlt = computed(
  () => featuredPost.value?.author?.name || 'Author profile photo',
);
const authorLink = computed(() => featuredPost.value?.author?.link || '/about');
</script>

<style scoped>
/* Optional scoped styles */
</style>
