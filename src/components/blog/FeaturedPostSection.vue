<template>
  <ContentFeaturedPost
    v-if="featuredPost"
    :imageSrc="
      featuredPost.featuredImage?.src || '/assets/img/featured-blog-comp.jpg'
    "
    :imageAlt="featuredPost.featuredImage?.alt || featuredPost.title"
    :title="featuredPost.title"
    :postLink="`/blog/${featuredPost.slug}`"
    :date="featuredPost.date"
    :category="
      featuredPost.category ||
      (featuredPost.categories && featuredPost.categories[0]) ||
      'Uncategorized'
    "
    :categoryLink="`/blog/category/${(featuredPost.category || (featuredPost.categories && featuredPost.categories[0]) || 'uncategorized').toLowerCase()}`"
    :tags="featuredPost.tags"
    :authorImageSrc="featuredPost.author?.image || '/assets/img/avatar.png'"
    :authorImageAlt="featuredPost.author?.name || 'Author profile photo'"
    :authorLink="featuredPost.author?.link || '/about'"
  />
</template>

<script setup>
import { computed } from 'vue';
import ContentFeaturedPost from '../../content/ContentFeaturedPost.vue';
import postsData from '../../blog-data.json';

const featuredPost = computed(() => {
  return postsData.find(
    (post) => post.featured && (post.status === 'published' || !post.status),
  );
});
</script>
