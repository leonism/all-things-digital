<template>
  <div id="mainWrapper" class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 dark:text-white">Tag: #{{ tagName }}</h1>
    <div v-if="allPosts.length" aria-label="Blog articles">
      <BlogArticleCard
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
        role="article"
      />
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No posts found with the tag "#{{ tagName }}".</p>
      <router-link
        to="/blog"
        class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block"
        >Back to Blog List</router-link
      >
    </div>
    <div v-if="!tagName" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="tag in allTags"
        :key="String(tag)"
        class="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <router-link :to="`/blog/tag/${getTagSlug(tag)}`">
          #{{ tag }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import postsData from '../../blog-data.json';
import BlogArticleCard from '../common/BlogArticleCard.vue';

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
const getTagSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

const route = useRoute();
const router = useRouter();
const tagName = ref(
  Array.isArray(route.params.tag) ? route.params.tag[0] : route.params.tag,
);

const allPosts = ref<BlogDataPost[]>([]);
// Computed properties for meta tags
const pageTitle = computed(
  () => `Tag: #${tagName.value || 'Archive'} - All Things Digital`,
);
const pageDescription = computed(
  () => `Posts tagged with #${tagName.value || 'archive'}.`,
);
const canonicalUrl = computed(() => {
  const base = 'https://allthingsdigital.netlify.app';
  return tagName.value
    ? `${base}/blog/tag/${getTagSlug(tagName.value)}`
    : `${base}/blog`;
});

// Watcher to update meta tags whenever the 'tagName' ref changes.
watch(
  tagName,
  (newTagName) => {
    if (newTagName) {
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
      useHead({ title: 'Tag Archive' });
    }
  },
  { immediate: true },
);

onMounted(() => {
  const tag = route.params.tag;
  console.log('Current tag from route:', tag, typeof tag);

  const filtered = posts.filter((post: BlogDataPost) => {
    if (!post.status || post.status === 'published') {
      if (post.tags) {
        const lowerCaseTags = post.tags.map((t: string) => t.toLowerCase());
        if (
          Array.isArray(tag)
            ? lowerCaseTags.includes(tag[0].toLowerCase())
            : lowerCaseTags.includes(tag.toLowerCase())
        ) {
          console.log('Post included:', post);
          return true;
        }
      }
    }
    return false;
  });
  console.log('Filtered posts for tag:', filtered);

  allPosts.value = filtered;
});

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error('Error formatting date:', dateString, e);
    return dateString;
  }
};

const allTags = computed(() => {
  const tags = new Set<string>();
  posts.forEach((post: BlogDataPost) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
});
</script>
