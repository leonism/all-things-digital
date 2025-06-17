<template>
  <!-- start the darkmode button -->
  <section
    id="darkModeButton"
    class="flex z-10 transition transform hover:-rotate-12 ml-auto mr-2 drop-shadow-2xl dark:drop-shadow-2xl"
  >
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      class="flex items-center text-pink-heading justify-center w-10 h-10 bg-white rounded-full shadow-sm dark:bg-white"
      role="button"
      :aria-pressed="isDarkMode.toString()"
      tabindex="0"
      @click="toggleDarkMode"
      @keydown.enter="toggleDarkMode"
      @keydown.space="toggleDarkMode"
    >
      <!-- Sun Icon (Visible in Light Mode) -->
      <svg
        v-if="!isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 font-bold cursor-pointer sun text-pink-heading"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
      <!-- Moon Icon (Visible in Dark Mode) -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 cursor-pointer moon text-pink-heading/80"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isDarkMode = ref(false);

// Function to apply the theme based on the isDarkMode state
const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

// Function to toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  applyTheme();
};

// Check local storage or system preference on component mount
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    isDarkMode.value = savedTheme === "dark";
  } else {
    // Optional: Check system preference if no theme is saved
    isDarkMode.value =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  // Apply the theme immediately on load
  applyTheme();
});
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>

