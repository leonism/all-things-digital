<template>
  <section id="mainWrapper" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <AboutHeader />

    <article class="mt-12 md:mt-16">
      <!-- Introduction Section with Video -->
      <div class="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 mb-12 md:mb-16 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl shadow-lg">
        <div class="md:w-1/2 flex-shrink-0">
          <!-- Lazy load this iframe -->
          <LazyYouTubeEmbed
            video-id="dQw4w9WgXcQ"
            title="Introduction to My Work"
            class="w-full aspect-video rounded-lg shadow-md overflow-hidden"
          />
        </div>
        <div class="md:w-1/2 prose prose-lg md:prose-xl dark:prose-invert prose-p:font-navigation prose-p:text-justify prose-headings:font-navigation prose-a:text-pink-heading">
          <h3 class="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-200 mb-4 !mt-0">And where do we begin?</h3>
          <p>
            I think I’ve come a long way within the technological and creative sector. For the most part, I fell in love with computers in general and learnt various knowledge from the Internet.
          </p>
        </div>
      </div>

      <!-- Purpose & Approach Section -->
      <div class="mb-12 md:mb-16 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
        <h3 class="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-200 mb-6 text-center">Purpose & Approach</h3>
        <div class="grid md:grid-cols-2 gap-8 items-start">
          <div class="prose dark:prose-invert prose-p:font-navigation prose-p:text-slate-600 dark:prose-p:text-slate-300">
            <div class="flex items-start mb-4">
              <svg class="w-8 h-8 text-indigo-500 dark:text-indigo-400 mr-4 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              <p class="!mt-0">
                The sole purpose of having this blog was purely to document experimental projects while trying to adopt cutting-edge tech advancements.
              </p>
            </div>
          </div>
          <div class="prose dark:prose-invert prose-p:font-navigation prose-p:text-slate-600 dark:prose-p:text-slate-300">
            <div class="flex items-start mb-4">
              <svg class="w-8 h-8 text-pink-500 dark:text-pink-400 mr-4 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a4 4 0 00-5.656 0M14 10l-2.121-2.121a2 2 0 00-2.828 0L4 12.828V18h5.172L14 10zM12 15h6"></path></svg>
              <p class="!mt-0">
                While it may not be the most perfect documentation, it might save you time when you’re trying to Google your error code.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills & Passion Section -->
      <div class="p-6 bg-gradient-to-br from-indigo-500 to-pink-500 dark:from-indigo-700 dark:to-pink-700 rounded-2xl shadow-xl text-white">
        <h3 class="text-2xl md:text-3xl font-semibold mb-6 text-center">Skills & Passion</h3>
        <div class="prose prose-invert max-w-none prose-p:font-navigation prose-p:text-indigo-100 dark:prose-p:text-indigo-200">
          <p class="text-center text-lg">
            I’m a self-taught developer who experiments with frontend frameworks, digital marketing strategies, machine learning, and organic SERP through SEO methods. Hope you enjoy reading my documentation!
          </p>
        </div>
        <div class="mt-8 text-center">
          <router-link
            to="/blog"
            class="inline-block bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300 transform hover:scale-105"
          >
            Explore My Blog
          </router-link>
        </div>
      </div>

    </article>
  </section>
</template>

<script setup>
import AboutHeader from '../components/heading/HeaderAbout.vue';
import LazyYouTubeEmbed from '../components/common/LazyYouTubeEmbed.vue'; // Assuming you have this or similar
</script>

<style scoped>
/* Add any additional scoped styles if needed */
</style>
