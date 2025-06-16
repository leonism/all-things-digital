<template>
  <section id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <HeaderContact />
    <Suspense>
      <template #default>
        <LazyContactForm />
      </template>
      <template #fallback>
        <LoadingStates type="contact-form" />
      </template>
    </Suspense>
  </section>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import HeaderContact from '../components/heading/HeaderContact.vue';
import LoadingStates from '../components/common/LoadingStates.vue';

const LazyContactForm = defineAsyncComponent( () =>
  import( '../components/forms/ContactForm.vue' )
);
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
