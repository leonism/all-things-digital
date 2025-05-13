<!-- src/components/ContentFeaturedPost.vue -->
<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  imageSrc: {
    type: String,
    required: true,
  },
  avatarSrc: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section
    id="featuredPost"
    class="mb-5">
    <!-- Featured Post Image -->
    <figure
      id="splashPicture"
      class="flex justify-center rounded-lg">
      <a :href="`/blog-post.html`">
        <img
          :src="imageSrc"
          :alt="title"
          class="dark:mask-b-from-10% dark:mask-b-to-90% shadow-lg rounded-lg" />
      </a>
    </figure>

    <!-- Post Metadata -->
    <div class="flex items-center">
      <!-- Author Avatar -->
      <div
        class="mt-5 mb-5 p-1 flex shrink-0 basis-auto items-center self-start rounded-full bg-linear-to-br from-indigo-400 to-pink-600 drop-shadow-lg md:inline-block">
        <img
          :src="avatarSrc"
          alt="Author avatar"
          class="h-12 w-12 md:h-17 md:w-17 rounded-full" />
      </div>

      <!-- Post Title and Date -->
      <div
        id="postTitleDate"
        class="ml-3">
        <h3
          class="text-left text-wrap text-balance text-pretty font-navigation text-md/5 line-clamp-2 text-slate-700 dark:text-white leading-5 md:text-xl/5 md:leading-6">
          <a href="./blog-post.html">
            {{ title }}
          </a>
        </h3>
        <p
          class="flex text-center text-xs text-white-muted dark:text-gray-500 mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-3.5 h-3.5 mr-1">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <time :datetime="date">
            {{ date }}
          </time>
          <span class="hidden md:inline-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-3.5 h-3.5 mx-1">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <template
              v-for="(tag, index) in tags"
              :key="index">
              <a :href="`/blog-post.html#${tag.toLowerCase()}`">{{ tag }}</a
              ><span v-if="index < tags.length - 1">, </span>
            </template>
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Scoped styles for this component */
</style>
