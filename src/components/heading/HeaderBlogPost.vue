<template>
  <header id="mainHeading" class="text-center">
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
  <aside class="mx-auto text-center">
    <div class="flex flex-row items-center justify-center mb-3">
      <img
        :src="authorAvatar"
        alt="Author Avatar"
        class="w-15 h-15 mr-2 rounded-full"
      />
      <span class="text-xs text-slate-500 dark:text-muted-white">
        {{ authorName }}
      </span>
    </div>
    <p
      class="inline-flex mb-5 text-xs mx-auto text-slate-500 dark:text-muted-white"
    >
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
      <span class="text-xs text-slate-500 dark:text-muted-white">
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
});

const formattedDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(props.date).toLocaleDateString('en-US', options);
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
