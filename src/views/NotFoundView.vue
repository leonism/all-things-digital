<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4"
  >
    <div class="max-w-2xl w-full text-center space-y-6">
      <!-- Animated 404 number -->
      <div class="relative">
        <div
          class="text-[10rem] sm:text-[12rem] md:text-[14rem] font-extrabold text-gray-200 dark:text-gray-700 opacity-80 select-none"
        >
          404
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <h1 id="mainHeading" class="gradient-headers">Page Not Found</h1>
        </div>
      </div>

      <!-- Message -->
      <p
        class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto"
      >
        Oops! The page you're looking for has vanished into the digital void.
      </p>

      <!-- Illustration -->
      <div class="py-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="240"
          height="240"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mx-auto text-gray-400 dark:text-gray-500"
        >
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          ></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <router-link
          to="/"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Return Home
        </router-link>
        <button
          @click="goBack"
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Go Back
        </button>
      </div>

      <!-- Additional help -->
      <p class="text-sm text-gray-500 dark:text-gray-400 pt-8">
        Still lost?
        <a
          href="/contact"
          class="text-blue-500 hover:underline dark:text-blue-400"
          >Contact support</a
        >
      </p>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
/* Animation for the 404 text */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.relative > div:first-child {
  animation: float 3s ease-in-out infinite;
}

/* Smooth transitions for dark mode */
main,
button,
a {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
