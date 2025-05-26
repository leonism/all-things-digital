<template>
  <BaseLayout>
    <main class="flex-grow">
      <router-view />
    </main>
    <SearchModal :show-modal="isSearchModalVisible" @close="closeSearchModal" />
  </BaseLayout>
</template>

<script setup>
import { ref } from 'vue';
import BaseLayout from './layouts/BaseLayout.vue';
import SearchModal from './views/SearchModal.vue';

const isSearchModalVisible = ref(false);
// const openSearchModal = () => {
//   isSearchModalVisible.value = true;
// };

const closeSearchModal = () => {
  isSearchModalVisible.value = false;
};
</script>

<style>
/* Global styles can be imported in main.js or here if needed */
</style>
