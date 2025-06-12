<template>
  <header class="space-y-6">
    <!-- Image container with dynamic masking and parallax effect -->
    <figure
      class="relative w-full h-80 md:h-[28rem] overflow-hidden rounded-t-[1rem] shadow-2xl group isolate"
    >
      <!-- Dynamic image with conditional masking and parallax -->
      <img
        :src="processedFeaturedImage"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-[1.02] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="{
          'mask-image-[radial-gradient(ellipse_80%_70%_at_50%_30%,black_50%,transparent_80%)] dark:mask-image-[radial-gradient(ellipse_80%_70%_at_50%_30%,black_30%,transparent_70%)]': true,
          'backdrop-blur-[1px]': true,
        }"
        style="view-transition-name: featured-image"
      />

      <!-- Animated gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 dark:opacity-60"
        :class="{
          'group-hover:via-black/90 transition-all duration-700': true,
        }"
      ></div>

      <!-- Floating particles effect (purely decorative) -->
      <div
        aria-hidden="true"
        class="absolute inset-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none"
        :style="{
          'background-image': 'radial-gradient(white 1px, transparent 1px)',
          'background-size': '20px 20px',
          'mask-image':
            'linear-gradient(to bottom, transparent 10%, black 40%)',
        }"
      ></div>

      <!-- Author info - right aligned with fancy border effect -->
      <figcaption
        class="absolute bottom-6 right-6 z-10 flex items-center gap-3 text-white text-end"
      >
        <div class="flex flex-col items-end">
          <div class="flex items-center gap-3">
            <div class="flex flex-col items-end">
              <p class="text-lg font-semibold tracking-tight drop-shadow-lg">
                {{ authorName }}
              </p>
              <div class="flex items-center gap-2 text-sm text-white/80">
                <time
                  :datetime="date"
                  class="flex items-center justify-end gap-1"
                >
                  <ClockIcon class="w-3.5 h-3.5" />
                  {{ formattedDate }}
                </time>
                <span class="w-1 h-1 rounded-full bg-white/50"></span>
                <span class="flex items-center justify-end gap-1">
                  <CategoryIcon class="w-3.5 h-3.5" />
                  {{ category }}
                </span>
              </div>
            </div>
            <AvatarAuthor
              :imageSrc="authorAvatar"
              :imageAlt="`${authorName}'s avatar`"
              class="ring-2 ring-white/30 hover:ring-white/80 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            />
          </div>

          <!-- Decorative slash effect with animation -->
          <div
            class="w-full mt-3 h-px bg-gradient-to-l from-transparent via-white/50 to-transparent relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-[length:20px_2px] bg-repeat-space bg-[linear-gradient(45deg,transparent_45%,white_50%,transparent_55%)] animate-slash-pattern"
            ></div>
          </div>
        </div>
      </figcaption>
    </figure>

    <!-- Text content with animated gradient and tighter spacing -->
    <div class="px-4 space-y-3 max-w-4xl mx-auto">
      <h1
        class="text-4xl md:text-6xl font-bold text-center leading-tight text-balance bg-clip-text text-transparent bg-[length:200%_200%] bg-gradient-to-r from-slate-800 via-slate-600 to-slate-500 dark:from-slate-100 dark:via-slate-300 dark:to-slate-200 animate-gradient-shift"
        style="view-transition-name: article-title"
      >
        {{ title }}
      </h1>

      <h2
        v-if="subtitle"
        class="text-xl md:text-2xl font-medium text-center text-slate-600 dark:text-slate-300/90 text-pretty leading-snug"
        style="view-transition-name: article-subtitle"
      >
        {{ subtitle }}
      </h2>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AvatarAuthor from '../common/AvatarAuthor.vue';
import { useCloudinary } from '@/composables/useCloudinary';

interface Props {
  title: string;
  subtitle?: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  category: string;
  featuredImage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  featuredImage: '/assets/img/featured-blog.jpg',
});

// Use Cloudinary for hero image optimization
const { getResponsiveUrl } = useCloudinary();

// Generate optimized hero image with appropriate dimensions
const processedFeaturedImage = computed(() => {
  if (!props.featuredImage) return '/assets/img/featured-blog.jpg';

  return getResponsiveUrl(props.featuredImage, 1200, 600, {
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:good',
  });
});

const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const ClockIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="shrink-0">
      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v3.75a.75.75 0 00.75.75h3.75a.75.75 0 000-1.5h-3v-3.75z" clip-rule="evenodd" />
    </svg>
  `,
};

const CategoryIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="shrink-0">
      <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
    </svg>
  `,
};
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
