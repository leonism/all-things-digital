<template>
  <!-- Main wrapper with blog page styling -->
  <section
    id="mainWrapper"
    class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto"
    role="main"
  >
    <!-- Blog-style Header Section -->
    <header class="py-12">
      <HeaderCategory :categoryName="displayCategoryName" />
    </header>

    <!-- Blog-style Content Section -->
    <section class="pb-8">
      <!-- Category Posts Display -->
      <div v-if="categoryParam && categoryPosts.length > 0" class="space-y-8">
        <BlogArticleCard
          v-for="post in categoryPosts"
          :key="post.slug"
          :imageSrc="post.featuredImage.src"
          :imageAlt="post.featuredImage.alt || post.title"
          :title="post.title"
          :postLink="`/category/${post.slug}`"
          :date="post.date"
          :excerpt="post.excerpt || post.description"
          :tags="post.tags"
          :authorImageSrc="post.author.image"
          :authorImageAlt="post.author.name"
          :authorLink="post.author.link"
          :authorName="post.author.name"
          :category="post.category"
        />
      </div>

      <!-- All Categories Display -->
      <div v-else-if="!categoryParam" class="space-y-8">
        <article
          v-for="(category, index) in sortedCategories"
          :key="category"
          class="group overflow-hidden rounded-2xl shadow-xl border border-transparent bg-broken-white dark:bg-postcard transition-all duration-500 hover:shadow-2xl cursor-pointer"
          @click="navigateToCategory(category)"
        >
          <!-- Category Header -->
          <header class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-indigo-100 dark:bg-indigo-900/50 rounded-full p-3">
                <svg
                  class="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
                  ></path>
                </svg>
              </div>
              <span
                class="text-slate-500 dark:text-gray-400 text-sm font-medium"
              >
                {{ getPostsByCategory(category).length }} posts
              </span>
            </div>
            <h3 class="text-xl font-bold text-slate-700 dark:text-white mb-2">
              {{ category }}
            </h3>
          </header>

          <!-- Featured Posts Preview -->
          <section class="px-6 pb-4">
            <div class="space-y-3">
              <div
                v-for="post in getLatestPosts(category, 2)"
                :key="post.slug"
                class="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
              >
                <h4
                  class="text-slate-700 dark:text-white font-medium text-xl line-clamp-1"
                >
                  {{ post.title }}
                </h4>
                <p class="text-slate-500 dark:text-gray-400 text-xs mt-1">
                  {{ formatDate(post.date) }}
                </p>
                <p
                  class="text-slate-600 prose dark:text-gray-300 text-md line-clamp-2 mt-1"
                >
                  {{ post.excerpt }}
                </p>
              </div>
            </div>
          </section>

          <!-- Show More Indicator -->
          <div v-if="getPostsByCategory(category).length > 2" class="px-6 pb-4">
            <div class="text-slate-500 dark:text-gray-400 text-xs text-center">
              +{{ getPostsByCategory(category).length - 2 }} more posts
            </div>
          </div>

          <!-- View All Button -->
          <footer class="p-6 pt-0">
            <button
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
              aria-label="Explore category"
            >
              Explore Category
            </button>
          </footer>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="max-w-md mx-auto">
          <svg
            class="mx-auto h-12 w-12 text-slate-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-slate-900 dark:text-white">
            No articles found
          </h3>
          <p class="mt-2 text-slate-500 dark:text-gray-400">
            No articles found in the {{ categoryParam }} category.
          </p>
          <div class="mt-6">
            <router-link
              to="/blog"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Browse all articles
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import HeaderCategory from '../components/heading/HeaderCategory.vue';
import BlogArticleCard from '../components/home/BlogArticleCard.vue';
import postsData from '../blog-data.json';

interface BlogPost {
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
  content: string;
  excerpt?: string;
  description?: string;
  status?: string;
  contentHtml: string;
  toc?: any;
  readingTime?: string;
  featured?: boolean;
  priority?: string;
  metaRobots?: string;
  canonicalUrl?: string;
}

const route = useRoute();
const router = useRouter();

// Reactive variables
const blogDataRef = ref<BlogPost[]>(postsData as BlogPost[]);
const allPosts = ref<BlogPost[]>([]);
const categoryParam = computed(() => route.params.category as string);

// Computed properties
const publishedPosts = computed(() =>
  allPosts.value.filter((post) => !post.status || post.status === 'published'),
);

const allCategories = computed(() => {
  const categories = publishedPosts.value.map((post) => post.category);
  return [...new Set(categories)].sort();
});

const sortedCategories = computed(() => {
  return allCategories.value.sort((a, b) => {
    const aCount = getPostsByCategory(a).length;
    const bCount = getPostsByCategory(b).length;
    return bCount - aCount; // Sort by post count descending
  });
});

const displayCategoryName = computed(() => {
  if (!categoryParam.value) return 'All Categories';
  return (
    categoryParam.value.charAt(0).toUpperCase() + categoryParam.value.slice(1)
  );
});

const categoryPosts = computed(() => {
  if (!categoryParam.value) return [];
  return publishedPosts.value.filter(
    (post) => post.category.toLowerCase() === categoryParam.value.toLowerCase(),
  );
});

// Functions
const getPostsByCategory = (category: string): BlogPost[] => {
  return publishedPosts.value.filter((post) => post.category === category);
};

const getLatestPosts = (category: string, limit: number): BlogPost[] => {
  return getPostsByCategory(category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

const navigateToCategory = (category: string) => {
  router.push(`blog/category/${category.toLowerCase()}`);
};

const navigateToPost = (slug: string) => {
  router.push(`/blog/${slug}`);
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Lifecycle
onMounted(() => {
  // Filter and sort posts
  allPosts.value = blogDataRef.value
    .filter((post) => !post.status || post.status === 'published')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
</script>

<style scoped>
/* Fluid scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Organic scrollbars */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Smooth transitions */
* {
  transition: all 0.3s ease;
}
</style>
