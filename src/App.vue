<template>
  <BaseLayout @open-search="openSearchModal">
    <main class="flex-grow">
      <router-view />
    </main>
    <!-- Only loads when first opened -->
    <EnhancedSearchModal
      v-if="isSearchModalVisible"
      :show-modal="isSearchModalVisible"
      @close="closeSearchModal"
    />
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import BaseLayout from './layouts/BaseLayout.vue';

// Lazy load the heavy search modal
const EnhancedSearchModal = defineAsyncComponent(() =>
  import('./components/search/EnhancedSearchModal.vue')
);

const isSearchModalVisible = ref(false);
const openSearchModal = () => {
  isSearchModalVisible.value = true;
};

const closeSearchModal = () => {
  isSearchModalVisible.value = false;
};

// Global keyboard shortcut for search
const handleGlobalKeydown = (event) => {
  if (event.key === '/' && !isSearchModalVisible.value) {
    // Prevent typing '/' in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
      return;
    }
    event.preventDefault();
    openSearchModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<style>
/* Global styles can be imported in main.js or here if needed */
</style>
