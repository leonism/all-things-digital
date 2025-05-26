<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <ContentCreditsHeader />
    <article
      class="p-1 mx-auto prose md:prose-md lg:prose-lg prose-p:font-navigation prose-p:text-justify dark:prose-invert"
    >
      <figure class="w-full mb-5">
        <section class="aspect-video w-full">
          <iframe
            class="w-full h-full"
            src="https://www.youtube.com/embed/RGd5cOXpCQw?si=E_JbV8R0snaF_Tzh"
            title="Thank You: A Tribute to the Tech Community"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          >
          </iframe>
        </section>
      </figure>
      <p>
        This site was made possible by the collective brilliance of open-source
        contributors, digital toolmakers, and passionate educators. I am deeply
        grateful for the freely shared knowledge and innovations that power this
        platform.
      </p>
      <p>
        Heartfelt appreciation goes to the creators of Visual Code Studio,
        Node.JS, Tailwind CSS, and other indispensable tools that brought this
        project to life. Thanks as well to Vercel for seamless deployment, and to
        designers behind the icons and fonts that give this site its character.
      </p>
      <p>
        This project stands on the shoulders of countless creators, writers, and
        coders whose work inspired and informed it. A full list of contributors,
        references, and design resources will be included shortly to ensure proper
        acknowledgment.
      </p>
    </article>
  </main>
</template>

<script setup>
import ContentCreditsHeader from '../components/header/ContentCreditsHeader.vue';
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
