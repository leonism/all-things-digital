<template>
  <section
    id="mainWrapper"
    class="max-w-4xl sm:mx-5 md:mx-10 lg:mx-auto"
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
    <BlogLatestPost>
      <template #latest-posts>
        <div class="flex flex-col-reverse">
          <BlogArticleCard
            v-for="post in latestPosts"
            :key="post.slug"
            :imageSrc="post.featuredImage?.src || thumbnail01Comp"
            :imageAlt="post.featuredImage?.alt || post.title"
            :title="post.title"
            :postLink="`/blog/${post.slug}`"
            :date="post.date"
            :excerpt="post.excerpt || post.description"
            :tags="post.tags"
            :authorImageSrc="post.author?.image || avatar"
            :authorImageAlt="post.author?.name || 'Author profile picture'"
            :authorLink="post.author?.link || '/about'"
          />
        </div>
      </template>
    </BlogLatestPost>
    <!-- <BlogGridHome /> -->
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useHead } from '@unhead/vue';
import HeaderHome from '../components/heading/HeaderHome.vue';
import BlogFeaturedPost from '../components/blog/BlogFeaturedPost.vue';
import BlogLatestPost from '../components/blog/BlogLatestPost.vue';
import BlogArticleCard from '../components/blog/BlogArticleCard.vue';
import { useFeaturedPost } from '../composables/useFeaturedPost';
import { useLatestPosts } from '../composables/useLatestPosts';
// import thumbnail01Comp from '../assets/img/thumbnail-01-comp.jpg'; // Import the thumbnail image
// import avatar from '../assets/img/avatar.png'; // Import the avatar image
// import BlogGridHome from '../components/blog/BlogGridHome.vue';

useHead({ title: 'DGPond.COM' });

const featuredPost = useFeaturedPost();
const latestPosts = useLatestPosts();
const featuredImageSrc = computed(
  () =>
    featuredPost.value?.featuredImage?.src ||
    '/assets/img/featured-blog-comp.jpg', // Use the absolute path
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
