<template>
  <div class="text-center py-16">
    <h2 class="text-2xl font-semibold dark:text-white">Post not found</h2>
    <p class="text-gray-500 dark:text-gray-400 mt-2">
      The requested blog post could not be found.
    </p>
    <router-link
      to="/blog"
      class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block"
    >
      &larr; Back to Blog List
    </router-link>
  </div>
</template>
