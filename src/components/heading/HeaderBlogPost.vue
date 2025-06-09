<template>
  <header class="article-header">
    <figure class="featured-image">
      <img
        :src="featuredImage"
        :alt="`Featured image for ${title}`"
        width="1200"
        height="600"
        loading="eager"
      />
      <figcaption class="image-meta">
        <AvatarAuthor :imageSrc="authorAvatar" :imageAlt="authorName" />
        <div class="meta-content">
          <span class="author-name">{{ authorName }}</span>
          <div class="meta-details">
            <time :datetime="date">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="14"
                height="14"
              >
                <path
                  fill="currentColor"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v3.75a.75.75 0 00.75.75h3.75a.75.75 0 000-1.5h-3v-3.75z"
                />
              </svg>
              {{ formattedDate }}
            </time>
            <span aria-hidden="true"> | </span>
            <span class="category">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="14"
                height="14"
              >
                <path
                  fill="currentColor"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v3.75a.75.75 0 00.75.75h3.75a.75.75 0 000-1.5h-3v-3.75z"
                />
              </svg>
              {{ category }}
            </span>
          </div>
        </div>
      </figcaption>
    </figure>

    <div class="header-content">
      <h1>{{ title }}</h1>
      <h2 v-if="subtitle">{{ subtitle }}</h2>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import AvatarAuthor from '../common/AvatarAuthor.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  authorName: {
    type: String,
    required: true,
  },
  authorAvatar: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: '/assets/img/featured-blog.jpg',
  },
});

const formattedDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(props.date).toLocaleDateString('en-US', options);
});
</script>

<style scoped>
.article-header {
  --text-color: theme('colors.slate.600');
  --text-color-dark: theme('colors.white');
  --meta-color: theme('colors.gray.300');
  --gradient-from: theme('colors.black' / 70%);
  --shadow-color: theme('colors.black' / 10%);
  margin-bottom: 2rem;
}

.featured-image {
  position: relative;
  width: 100%;
  height: 24rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px var(--shadow-color);
  margin-bottom: 2rem;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--gradient-from),
    transparent,
    transparent
  );
}

.image-meta {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.meta-content {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 1.125rem;
  font-weight: 600;
}

.meta-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--meta-color);
}

.meta-details svg {
  margin-right: 0.25rem;
}

.header-content {
  text-align: center;
}

.header-content h1 {
  font-size: 2.25rem;
  line-height: 1.2;
  background: linear-gradient(to right, #4f46e5, #10b981);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header-content h2 {
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--text-color);
}

@media (min-width: 768px) {
  .header-content h1 {
    font-size: 3rem;
  }

  .header-content h2 {
    font-size: 1.75rem;
    font-weight: 800;
  }
}

@media (prefers-color-scheme: dark) {
  .header-content h2 {
    color: var(--text-color-dark);
  }
}
</style>
