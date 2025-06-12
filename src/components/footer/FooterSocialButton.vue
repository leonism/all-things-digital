<template>
  <div
    id="socialButtons"
    class="mx-auto mb-5 mt-5 md:mb-7 md:mt-7 max-w-2xl px-4 sm:px-6 lg:px-8"
  >
    <ul
      class="flex flex-nowrap items-center justify-center gap-3 md:gap-4 lg:gap-5"
    >
      <!-- Twitter -->
      <li>
        <a
          href="https://twitter.com/gerryleonugroho"
          title="Twitter Account"
          target="_blank" rel="noopener noreferrer"
          class="group relative flex h-12 w-12 items-center justify-center border border-gray-300 dark:border-none rounded-full bg-broken-white shadow-sm transition-all duration-300 hover:bg-blue-400 hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:hover:bg-blue-500"
        >
          <!-- SVG content omitted for brevity, assumed correct -->
          <svg width="22" height="22" fill="currentColor" class="text-gray-600 transition-colors duration-300 group-hover:text-white dark:text-gray-400" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z"></path></svg>
          <span class="absolute -bottom-6 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 dark:text-gray-300">Twitter</span>
        </a>
      </li>
      <!-- GitHub -->
      <li>
        <a
          href="https://github.com/leonism/All-things-digital/"
          title="Github Account"
          target="_blank" rel="noopener noreferrer"
          class="group relative flex h-12 w-12 items-center justify-center border border-gray-300 dark:border-none rounded-full bg-broken-white shadow-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:hover:bg-gray-600"
        >
          <!-- SVG content omitted for brevity, assumed correct -->
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="text-gray-600 transition-colors duration-300 group-hover:text-white dark:text-gray-400" viewBox="0 0 1792 1792"><path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path></svg>
          <span class="absolute -bottom-6 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 dark:text-gray-300">GitHub</span>
        </a>
      </li>
      <!-- LinkedIn -->
      <li>
        <a
          href="#"
          title="LinkedIn Account"
          target="_blank" rel="noopener noreferrer"
          class="group relative flex h-12 w-12 items-center justify-center border border-gray-300 dark:border-none rounded-full bg-broken-white shadow-sm transition-all duration-300 hover:bg-blue-600 hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:hover:bg-blue-700"
        >
          <!-- SVG content omitted for brevity, assumed correct -->
          <svg width="22" height="22" fill="currentColor" class="text-gray-600 transition-colors duration-300 group-hover:text-white dark:text-gray-400" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M477 625v991h-330v-991h330zm21-306q1 73-50.5 122t-135.5 49h-2q-82 0-132-49t-50-122q0-74 51.5-122.5t134.5-48.5 133 48.5 51 122.5zm1166 729v568h-329v-530q0-105-40.5-164.5t-126.5-59.5q-63 0-105.5 34.5t-63.5 85.5q-11 30-11 81v553h-329q2-399 2-647t-1-296l-1-48h329v144h-2q20-32 41-56t56.5-52 87-43.5 114.5-15.5q171 0 275 113.5t104 332.5z"></path></svg>
          <span class="absolute -bottom-6 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 dark:text-gray-300">LinkedIn</span>
        </a>
      </li>
      <!-- DEV.to -->
      <li>
        <a
          href="https://dev.to/gerryleonugroho"
          title="DEV.TO Account"
          target="_blank" rel="noopener noreferrer"
          class="group relative flex h-12 w-12 items-center justify-center border border-gray-300 dark:border-none rounded-full bg-broken-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:hover:bg-gray-900"
        >
          <!-- SVG content omitted for brevity, assumed correct -->
          <svg width="22" height="22" fill="currentColor" class="text-gray-600 transition-colors duration-300 group-hover:text-white dark:text-gray-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.413 21.223H2.965V6.91H7.41v14.313zM14.729 21.223h-4.446V2.777h4.446v18.446zm7.292 0h-4.446V11.358h4.446v9.865zm0-12.64H17.57V2.777h4.451v5.806z"></path></svg>
          <span class="absolute -bottom-6 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 dark:text-gray-300">DEV.TO</span>
        </a>
      </li>
      <li>
        <router-link
          to="/rss.xml"
          title="RSS Feed"
          class="group relative flex h-12 w-12 items-center justify-center border border-gray-300 dark:border-none rounded-full bg-broken-white shadow-sm transition-all duration-300 hover:bg-orange-500 hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:hover:bg-orange-600"
        >
          <!-- SVG content omitted for brevity, assumed correct -->
          <svg width="22" height="22" fill="currentColor" class="text-gray-600 transition-colors duration-300 group-hover:text-white dark:text-gray-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 17.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-2-7v3a13 13 0 0 1 13 13h3c0-8.837-7.163-16-16-16zm0-5v3c9.941 0 18 8.059 18 18h3c0-11.598-9.402-21-21-21z"></path></svg>
          <span class="absolute -bottom-6 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 dark:text-gray-300">RSS</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
// No specific script logic needed for this simple component yet
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
