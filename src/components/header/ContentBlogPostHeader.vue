<template>
  <header id="mainHeading" class="text-center">
    <h1
      class="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] subpixel-antialiased font-extrabold font-navigation tracking-tight text-transparent bg-clip-text drop-shadow-lg bg-linear-to-br from-indigo-400 to-pink-600"
    >
      {{ title }}
    </h1>
    <h2
      id="subHeading"
      class="text-shadow-2xs mt-1 mb-2 text-xl subpixel-antialiased font-bold leading-tight text-center md:font-extrabold md:text-3xl text-slate-600/90 dark:text-white"
    >
      {{ subtitle }}
    </h2>
  </header>
  <aside class="mx-auto text-center">
    <p
      class="inline-flex mb-5 text-xs mx-auto text-slate-500 dark:text-muted-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-3.5 h-3.5 mr-1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
      <time :datetime="date">{{ formattedDate }}</time>
      <span class="inline-flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-3.5 h-3.5 mx-1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
      </span>
      <span class="sr-only">Tags:</span>
      <template v-for="(tag, index) in tags" :key="tag">
        <a href="#" rel="tag">{{ tag }}</a><span v-if="index < tags.length - 1">, </span>
      </template>
    </p>
  </aside>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    default: () => [],
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
