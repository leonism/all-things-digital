<template>
  <section
    id="mainWrapper"
    class="max-w-4xl sm:mx-5 md:mx-10 lg:mx-auto"
    role="main"
  >
    <!-- Category Header Section -->
    <section class="mb-10 text-center">
      <HeaderCategory :categoryName="displayCategoryName" />
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
        Total Categories: {{ allCategories.length }}
      </p>
    </section>

    <!-- Fluid Category Grid -->
    <section v-if="!categoryParam" class="mb-16">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="category in allCategories"
          :key="category"
          class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-1 hover:p-0.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/80 dark:hover:bg-gray-700/70 border border-gray-100/50 dark:border-gray-700/50 hover:border-indigo-200/30 dark:hover:border-indigo-500/20"
        >
          <!-- Category Header -->
          <div class="p-5 pb-0 cursor-pointer" @click="goToCategory(category)">
            <div class="flex items-center justify-between">
              <h3
                class="text-2xl font-bold text-gray-800 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
              >
                {{ category }}
              </h3>
              <span
                class="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full dark:bg-indigo-900/20 dark:text-indigo-300"
              >
                {{
                  blogData.filter((post) => post.category === category).length
                }}
                posts
              </span>
            </div>
          </div>

          <!-- Featured Posts -->
          <div class="p-5 pt-3">
            <div class="space-y-4">
              <article
                v-for="post in getLatestPostsByCategory(category)"
                :key="post.slug"
                class="relative bg-white/70 dark:bg-gray-700/40 rounded-xl p-0.5 hover:p-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white dark:hover:bg-gray-600/50 cursor-pointer"
                @click.stop="goToPost(post.slug)"
              >
                <!-- Featured Image -->
                <div class="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    :src="
                      post.featuredImage?.src ||
                      '/assets/img/thumbnail-01-comp.jpg'
                    "
                    :alt="post.featuredImage?.alt || post.title"
                    class="object-cover w-full h-full transition-transform duration-500 hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
                  ></div>
                  <div class="absolute bottom-3 left-3">
                    <span
                      class="px-2.5 py-1 text-xs font-medium text-white bg-black/30 backdrop-blur-sm rounded-full"
                    >
                      {{ formatDate(post.date) }}
                    </span>
                  </div>
                </div>

                <!-- Post Content -->
                <div class="p-4">
                  <h4
                    class="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug"
                  >
                    {{ post.title }}
                  </h4>
                  <p
                    class="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed"
                  >
                    {{ post.excerpt || post.description }}
                  </p>

                  <!-- Tags -->
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    <span
                      v-for="(tag, index) in post.tags?.slice(0, 2)"
                      :key="index"
                      class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100/70 rounded-full dark:text-gray-200 dark:bg-gray-600/50"
                    >
                      {{ tag }}
                    </span>
                    <span
                      v-if="post.tags?.length > 2"
                      class="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      +{{ post.tags.length - 2 }} more
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <!-- View All Button -->
          <div class="p-4 text-center">
            <button
              @click.stop="goToCategory(category)"
              class="text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 inline-flex items-center"
            >
              View all {{ category }} posts
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Posts Grid -->
    <section v-if="paginatedPosts.length" aria-label="Blog articles">
      <BlogArticleCard
        v-for="post in paginatedPosts"
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

      <!-- Fluid Pagination -->
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-change="goToPageLocal"
      />
    </section>

    <!-- Empty State -->
    <section
      v-else
      class="p-8 text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50"
      role="alert"
    >
      <p class="mb-4 text-lg text-gray-600 dark:text-gray-300">
        No posts found in this category.
      </p>
      <router-link
        to="/blog"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-500 transition-colors duration-200 bg-indigo-50/70 rounded-lg dark:text-indigo-400 dark:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
      >
        Back to Blog List
      </router-link>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import blogData from '../blog-data.json';
import HeaderCategory from '../components/heading/HeaderCategory.vue';
import Pagination from '../components/common/Pagination.vue';
import { usePagination } from '../composables/usePagination';

interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  lastModified?: string;
  author?: {
    name: string;
    role?: string;
    image?: string;
    link?: string;
  };
  category?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: {
    src: string;
    alt?: string;
  };
  contentHtml: string;
  seoTitle?: string;
  excerpt?: string;
  description?: string;
  metaRobots?: string;
  canonicalUrl?: string;
  schema?: any;
  status?: 'published' | 'draft' | string;
}

const route = useRoute();
const router = useRouter();
const categoryParam = route.params.category;
const postsPerPage = 3;
const allPosts = ref<BlogPost[]>([]);

const { currentPage, totalPages, goToPage } = usePagination(
  computed(() => allPosts.value.length),
  postsPerPage,
);

const displayCategoryName = computed(() => {
  return categoryParam
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    : 'All Categories';
});

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage;
  return allPosts.value.slice(startIndex, startIndex + postsPerPage);
});

const allCategories = computed(() => {
  const categories = new Set();
  blogData.forEach((post) => {
    if (post.category) categories.add(post.category);
  });
  return Array.from(categories).sort();
});

function getLatestPostsByCategory(category) {
  return blogData
    .filter((post) => post.category === category)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
}

function goToCategory(category) {
  router.push(`/blog/category/${category.toLowerCase()}`);
}

function goToPost(slug) {
  router.push(`/blog/${slug}`);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const goToPageLocal = (page: number) => {
  goToPage(page);
  if (categoryParam) {
    router.push({
      name: 'category-archive',
      params: { category: categoryParam, page: String(page) },
    });
  } else {
    router.push({ name: 'blog-categories-list', params: { page: String(page) } });
  }
};

onMounted(() => {
  const category = categoryParam;
  const page = Number(route.params.page) || 1;

  const filtered = blogData.filter(
    (post) =>
      (!post.status || post.status === 'published') &&
      (!category || (post.category && post.category.toLowerCase() === category.toLowerCase()))
  );

  allPosts.value = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (page > 1 && page <= totalPages.value) {
    currentPage.value = page;
  } else {
    currentPage.value = 1;
  }
});
</script>

<style>
/* Fluid scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Organic scrollbars */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.6);
}

/* Smooth transitions */
* {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}
</style>
