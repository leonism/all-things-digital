<template>
  <section id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <AboutHeader />
    <article class="mx-auto prose md:prose-md lg:prose-lg prose-p:font-navigation prose-p:text-justify prose-headings:font-navigation prose-a:text-pink-heading dark:prose-invert">
      <!-- Lazy load this iframe -->
      <LazyYouTubeEmbed
        video-id="dQw4w9WgXcQ"
        title="Introduction to My Work"
        class="w-full aspect-video"
      />
      <p>
        And where do we begin? I think I’ve come a long way within the
        technological and creative sector. For the most part, I fell in love
        with computers in general and learnt various knowledge from the
        Internet.
      </p>
      <p>
        The sole purpose of having this blog was purely to document experimental
        projects while trying to adopt cutting-edge tech advancements. While it
        may not be the most perfect documentation, it might save you time when
        you’re trying to Google your error code.
      </p>
      <p>
        I’m also a self-taught developer who experiments with frontend
        frameworks, digital marketing strategies, machine learning, and organic
        SERP through SEO methods. Hope you enjoy reading my documentation!
      </p>
    </article>
  </section>
</template>

<script setup>
import AboutHeader from '../components/heading/HeaderAbout.vue';
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
