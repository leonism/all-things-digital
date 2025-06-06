<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <HeaderCategory :categoryName="displayCategoryName" />
    <div
      v-if="paginatedPosts.length"
      class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
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
      />
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No posts found in this category.</p>
      <router-link
        to="/blog"
        class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block"
        >Back to Blog List</router-link
      >
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="goToPageLocal(currentPage - 1)"
      >
        Previous
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="goToPageLocal(page)"
      >
        {{ page }}
      </button>
      <button
        :disabled="currentPage === totalPages"
        @click="goToPageLocal(currentPage + 1)"
      >
        Next
      </button>
    </div>
    <div v-if="!categoryParam" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="category in allCategories"
        :key="category"
        :to="`/category/${getTagSlug(category)}`"
        class="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {{ category }}
      </router-link>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
/* Basic styling for pagination */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem; /* Space between buttons */
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-radius: 0.25rem; /* Rounded corners */
}

.pagination button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #007bff; /* Example active color */
  color: white;
  border-color: #007bff;
}

/* Dark mode styles for pagination */
.dark .pagination button {
  background-color: #333;
  border-color: #555;
  color: #eee;
}

.dark .pagination button:hover:not(:disabled) {
  background-color: #555;
}

.dark .pagination button.active {
  background-color: #0056b3; /* Example active color in dark mode */
  border-color: #0056b3;
}
</style>
