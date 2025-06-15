<template>
  <section
    id="mainWrapper"
    class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto"
    role="main"
  >
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
    <BlogLatestPost />
    <BlogArticleCard
      v-for="post in latestPosts"
      :key="post.slug"
      :imageSrc="post.featuredImage?.src || thumbnail01Comp"
      :imageAlt="post.featuredImage?.alt || post.title"
      :title="post.title"
      :category="post.category"
      :postLink="`/blog/${post.slug}`"
      :date="post.date"
      :excerpt="post.excerpt || post.description"
      :tags="post.tags"
      :authorImageSrc="post.author?.image || avatar"
      :authorImageAlt="post.author?.name || 'Author profile picture'"
      :authorLink="post.author?.link || '/about'"
      :authorName="post.author?.name || 'Unknown Author'"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useHead } from '@unhead/vue';
import HeaderHome from '../components/heading/HeaderHome.vue';
import BlogFeaturedPost from '../components/home/BlogFeaturedPost.vue';
import BlogLatestPost from '../components/home/BlogLatestPost.vue';
import BlogArticleCard from '../components/home/BlogArticleCard.vue';
import { useFeaturedPost } from '../composables/useFeaturedPost';
import { useLatestPosts } from '../composables/useLatestPosts';

// Define fallback images
const thumbnail01Comp = '/assets/img/thumbnail-01-comp.jpg';
const avatar = '/assets/img/avatar.png';

// SEO Meta Data
const siteName = 'DGPond.COM';
const pageTitle = 'DGPond.COM - Web Development Insights & Experiments';
const pageDescription = 'Explore articles on web development, emerging technologies, and hands-on experiments with cutting-edge tools and frameworks by a passionate developer.';
const homeUrl = 'https://www.dgpond.com/'; // Replace with your actual domain
const ogImage = 'https://www.dgpond.com/all-things-digital.png'; // Replace with your actual OG image URL

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: 'web development, javascript, vue, tailwindcss, Jamstack, frontend, backend, fullstack, tutorials, coding, programming, tech blog' },
    { name: 'author', content: 'DGPond' }, // Or your name/site name
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: homeUrl },
    { property: 'og:image', content: ogImage },
    { property: 'og:site_name', content: siteName },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: ogImage },
    // Add twitter:site and twitter:creator if you have a Twitter handle
  ],
  link: [
    {
      rel: 'canonical',
      href: homeUrl,
    },
  ],
});

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
  () => featuredPost.value?.author?.image || avatar,
);
const authorImageAlt = computed(
  () => featuredPost.value?.author?.name || 'Author profile photo',
);
const authorLink = computed(() => featuredPost.value?.author?.link || '/about');
</script>

<style scoped>
/* Optional scoped styles */
</style>
