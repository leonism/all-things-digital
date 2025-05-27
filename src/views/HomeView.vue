<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <HeaderHome />
    <BlogFeaturedPost
      v-if="featuredPost"
      :imageSrc="
        featuredPost.featuredImage?.src || '/assets/img/featured-blog-comp.jpg'
      "
      :imageAlt="featuredPost.featuredImage?.alt || featuredPost.title"
      :title="featuredPost.title"
      :postLink="`/blog/${featuredPost.slug}`"
      :date="featuredPost.date"
      :category="category"
      :categoryLink="categoryLink"
      :tags="featuredPost.tags"
      :authorImageSrc="featuredPost.author?.image || '/assets/img/avatar.png'"
      :authorImageAlt="featuredPost.author?.name || 'Author profile photo'"
      :authorLink="featuredPost.author?.link || '/about'"
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
import { useHead } from '@unhead/vue';
import { useBlogPosts } from '@/composables/useBlogPosts';
import HeaderHome from '@/components/header/HeaderHome.vue';
import BlogFeaturedPost from '@/components/blog/BlogFeaturedPost.vue';
import BlogLatestPost from '@/components/blog/BlogLatestPost.vue';
import BlogGridHome from '@/components/blog/BlogGridHome.vue';
import BlogArticleCard from '@/components/blog/BlogArticleCard.vue';

const { featuredPost, latestPosts } = useBlogPosts();

useHead({
  title: 'DGPond.COM',
});

// Category fallback logic
const category = computed(
  () =>
    featuredPost.value?.category ||
    featuredPost.value?.categories?.[0] ||
    'Uncategorized',
);

const categoryLink = computed(
  () => `/blog/category/${category.value.toLowerCase()}`,
);
</script>
