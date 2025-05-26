<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <ContentBlogHeader />
    <div v-if="posts.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <BlogArticleCard
        v-for="post in posts"
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
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No blog posts found.</p>
      <p>
        Make sure you have Markdown files in `/src/content/posts/` and run `node
        scripts/generate-blog-data.js`.
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import ContentBlogHeader from '../components/header/ContentBlogHeader.vue';
import BlogArticleCard from '../components/blog/BlogArticleCard.vue';
import postsData from '../blog-data.json';
// import SearchInput from '../components/SearchInput.vue'; // If implementing inline search

const posts = ref([]);
// const searchQuery = ref(''); // If implementing inline search

// Set meta tags for the main blog list page
useHead({
  title: 'Blog | DGPond.COM', // Updated title
  meta: [
    {
      name: 'description',
      content: 'Read the latest articles and insights on our blog.',
    }, // Customize description
    { property: 'og:title', content: 'Blog | DGPond.COM' },
    {
      property: 'og:description',
      content: 'Read the latest articles and insights on our blog.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://yourdomain.com/blog' }, // <<<--- IMPORTANT: Replace with your actual domain
    { property: 'og:image', content: '/images/default-og-image.png' }, // <<<--- IMPORTANT: Replace with your default OG image path
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Blog | DGPond.COM' },
    {
      name: 'twitter:description',
      content: 'Read the latest articles and insights on our blog.',
    },
    { name: 'twitter:image', content: '/images/default-og-image.png' }, // <<<--- IMPORTANT: Replace with your default Twitter image path
  ],
  link: [
    { rel: 'canonical', href: 'https://yourdomain.com/blog' }, // <<<--- IMPORTANT: Replace with your actual domain
  ],
});

onMounted(() => {
  posts.value = postsData.filter(
    (post) => !post.status || post.status === 'published',
  );
});

// const updateSearchQuery = (query) => { // If implementing inline search
//   searchQuery.value = query;
//   // Add filtering logic here based on searchQuery.value
// };

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error('Error formatting date:', dateString, e);
    return dateString;
  }
};
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
