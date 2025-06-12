<template>
  <section
    id="comments-section"
    class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700"
    role="region"
    aria-labelledby="comments-heading"
  >
    <h2 id="comments-heading" class="text-2xl font-bold mb-4 dark:text-white">
      Comments
    </h2>
    <div class="comments-content">
      <p class="text-gray-500 dark:text-gray-400">
        (Comment system integration pending user configuration)
      </p>
      <!-- Future comment system integration will go here -->
      <!-- This could include:
           - Comment form
           - Comment list
           - Comment moderation
           - Social login integration
      -->
    </div>
  </section>
</template>

<script setup lang="ts">
// Props for future extensibility
interface Props {
  postSlug?: string;
  postTitle?: string;
  allowComments?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  postSlug: '',
  postTitle: '',
  allowComments: true,
});

// Future: Add comment system logic here
// - Load comments for the post
// - Handle comment submission
// - Manage comment state
</script>

<style scoped>
/* Future: Add comment-specific styles here */
.comments-content {
  /* Placeholder for comment styling */
}
</style>