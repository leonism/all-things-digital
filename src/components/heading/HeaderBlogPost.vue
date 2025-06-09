<template>
  <header id="mainHeading" class="text-center">
    <div class="relative w-full h-96 overflow-hidden rounded-lg shadow-lg mb-8">
      <img
        :src="featuredImage"
        alt="Featured Image"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
      ></div>
      <div
        class="absolute bottom-4 left-4 z-10 flex items-center text-white text-shadow-md"
      >
        <AvatarAuthor :imageSrc="authorAvatar" :imageAlt="authorName" />
        <div class="flex flex-col">
          <span class="text-lg font-semibold">{{ authorName }}</span>
          <div class="flex items-center text-sm text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-3.5 h-3.5 mr-1"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v3.75a.75.75 0 00.75.75h3.75a.75.75 0 000-1.5h-3v-3.75z"
                clip-rule="evenodd"
              />
            </svg>
            <time :datetime="date">{{ formattedDate }}</time>
            <span class="mx-2"> | </span>
            <span class="text-sm text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-3.5 h-3.5 mr-1"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v3.75a.75.75 0 00.75.75h3.75a.75.75 0 000-1.5h-3v-3.75z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ category }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <h1 id="mainHeading" class="gradient-headers">
      {{ title }}
    </h1>
    <h2
      id="subHeading"
      class="text-shadow-2xs mt-1 mb-2 text-xl subpixel-antialiased font-bold leading-tight text-center md:font-extrabold md:text-3xl text-slate-600/90 dark:text-white"
    >
      {{ subtitle }}
    </h2>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import AvatarAuthor from '../common/AvatarAuthor.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  authorName: {
    type: String,
    required: true,
  },
  authorAvatar: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: '/assets/img/featured-blog.jpg',
  },
});

const formattedDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(props.date).toLocaleDateString('en-US', options);
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
