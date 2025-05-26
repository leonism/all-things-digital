<template>
  <div class="p-6 md:p-8">
    <div
      class="prose dark:prose-invert max-w-none"
      v-html="post.contentHtml"
    ></div>

    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div v-if="post.categories && post.categories.length" class="mb-4">
        <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300"
          >Categories:</span
        >
        <router-link
          v-for="category in post.categories"
          :key="category"
          :to="{
            name: 'category-archive',
            params: { category: category },
          }"
          class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
        >
          {{ category }}
        </router-link>
      </div>
      <div v-if="post.tags && post.tags.length">
        <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300"
          >Tags:</span
        >
        <router-link
          v-for="tag in post.tags"
          :key="tag"
          :to="{ name: 'tag-archive', params: { tag: tag } }"
          class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
        >
          #{{ tag }}
        </router-link>
      </div>
    </div>

    <div
      id="comments-section"
      class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-2xl font-bold mb-4 dark:text-white">Comments</h2>
      <p class="text-gray-500 dark:text-gray-400">
        (Comment system integration pending user configuration)
      </p>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
/* Styles for Tailwind Typography */
.prose :where(code):not(:where([class~='not-prose'] *))::before,
.prose :where(code):not(:where([class~='not-prose'] *))::after {
  content: '';
}
</style>
