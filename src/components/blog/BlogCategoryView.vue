<template>
  <div class="mainWrapper max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold mb-8 dark:text-white">
      Category: {{ displayCategoryName }}
    </h1>
    <div v-if="allPosts.length" aria-label="Blog articles">
      <BlogPostCard
        v-for="post in allPosts"
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
        :authorName="post.author?.name || 'Unknown Author'"
        :category="post.category"
        role="article"
      />
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No posts found in the category "{{ displayCategoryName }}".</p>
      <router-link
        to="/blog"
        class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block"
        >Back to Blog List</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import BlogPostCard from '../common/BlogPostCard.vue';
import postsData from '../../blog-data.json';

// Define interface that matches the actual blog-data.json structure
interface BlogDataPost {
  slug: string;
  title: string;
  seoTitle: string;
  date: string;
  lastModified: string;
  author: {
    name: string;
    role: string;
    image: string;
    link?: string;
  };
  category: string;
  tags: string[];
  featuredImage: {
    src: string;
    alt: string;
    caption: string;
  };
  excerpt?: string;
  description?: string;
  readingTime?: string;
  status?: string;
  featured?: boolean;
  priority?: string;
  metaRobots?: string;
  canonicalUrl?: string;
}

const posts = postsData as BlogDataPost[];

const getCategorySlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

const route = useRoute();
const router = useRouter();
const categorySlug = ref(
  Array.isArray(route.params.category)
    ? route.params.category[0]
    : route.params.category,
);

const allPosts = ref<BlogDataPost[]>([]);

// Convert slug back to display name
const displayCategoryName = computed(() => {
  if (!categorySlug.value) return '';
  return categorySlug.value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

// Computed properties for meta tags
const pageTitle = computed(
  () =>
    `Category: ${displayCategoryName.value || 'Archive'} - All Things Digital`,
);
const pageDescription = computed(
  () => `Posts in the ${displayCategoryName.value || 'archive'} category.`,
);
const canonicalUrl = computed(() => {
  const base = 'https://yourdomain.com';
  return categorySlug.value
    ? `${base}/blog/category/${categorySlug.value}`
    : `${base}/blog`;
});

// Watcher to update meta tags whenever the 'categorySlug' ref changes.
watch(
  categorySlug,
  (newCategorySlug) => {
    if (newCategorySlug) {
      useHead({
        title: pageTitle.value,
        meta: [
          { name: 'description', content: pageDescription.value },
          { property: 'og:title', content: pageTitle.value },
          { property: 'og:description', content: pageDescription.value },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: canonicalUrl.value },
          { property: 'og:image', content: '/images/default-og-image.png' },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: pageTitle.value },
          { name: 'twitter:description', content: pageDescription.value },
          { name: 'twitter:image', content: '/images/default-og-image.png' },
          { name: 'robots', content: 'index, follow' },
        ],
        link: [{ rel: 'canonical', href: canonicalUrl.value }],
      });
    } else {
      useHead({ title: 'Category Archive' });
    }
  },
  { immediate: true },
);

onMounted(() => {
  // Get all unique categories from posts
  const categoryNames: string[] = [];
  posts.forEach((post: BlogDataPost) => {
    if (!categoryNames.includes(post.category)) {
      categoryNames.push(post.category);
    }
  });

  // Find the actual category name from posts data
  const actualCategoryName = categoryNames.find(
    (name: string) => getCategorySlug(name) === categorySlug.value,
  );

  if (actualCategoryName) {
    // Filter posts by category
    allPosts.value = posts.filter(
      (post: BlogDataPost) => post.category === actualCategoryName,
    );
  } else {
    // If category not found, redirect to 404 or blog list
    router.push('/blog');
  }
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error('Error formatting date:', dateString, e);
    return dateString;
  }
};
</script>
