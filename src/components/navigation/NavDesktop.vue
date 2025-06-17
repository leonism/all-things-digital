<template>
  <!-- start the desktop nav // items-center justify-center -->
  <nav id="desktopNav" class="z-50 flex flex-row items-center self-center justify-center flex-grow">
    <ul
      class="hidden text-base font-semibold font-navigation text-pink-heading leading-tight md:flex md:justify-between dark:text-white">
      <li>
        <router-link to="/"
          class="block px-3 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white">Home</router-link>
      </li>
      <li>
        <router-link to="/blog"
          class="block px-3 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white">Blog</router-link>
      </li>
      <li class="relative" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
        <!-- Category dropdown trigger -->
        <button
          class="flex items-center px-3 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-slate-100 hover:text-slate-900"
          :class="{
            'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white': $route.path.startsWith( 'blog/category' )
          }" @click="toggleDropdown">
          Category
          <svg class="w-4 h-4 ml-1 transition-transform duration-200" :class="{ 'rotate-180': showDropdown }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div v-show="showDropdown"
          class="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
          <router-link to="/category"
            class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-pink-heading dark:hover:text-pink-heading transition-colors duration-200"
            @click="showDropdown = false">
            All Categories
          </router-link>
          <div class="border-t border-slate-200 dark:border-slate-600 my-1"></div>
          <router-link v-for=" category in categories " :key="category.slug" :to="`/blog/category/${category.slug}`"
            class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-pink-heading dark:hover:text-pink-heading transition-colors duration-200"
            @click="showDropdown = false">
            <span class="flex items-center">
              <span class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: category.color }"></span>
              {{ category.name }}
            </span>
          </router-link>
        </div>
      </li>
      <li>
        <router-link to="/about"
          class="block px-3 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white">About</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import categoriesData from '../../data/categories.json';

const route = useRoute();
const showDropdown = ref( false );
const categories = ref( categoriesData );

const toggleDropdown = () =>
{
  showDropdown.value = !showDropdown.value;
};

// Close dropdown when clicking outside
const handleClickOutside = ( event ) =>
{
  if ( !event.target.closest( '.relative' ) )
  {
    showDropdown.value = false;
  }
};

onMounted( () =>
{
  document.addEventListener( 'click', handleClickOutside );
} );

onUnmounted( () =>
{
  document.removeEventListener( 'click', handleClickOutside );
} );
</script>

<style scoped></style>
