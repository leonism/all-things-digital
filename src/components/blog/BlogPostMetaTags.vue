<script setup>
import { watch, computed } from 'vue';
import { useHead } from '@unhead/vue';

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
});

// Computed properties for meta tags
const pageTitle = computed(
  () => props.post?.seoTitle || props.post?.title || 'Blog Post',
);
const pageDescription = computed(
  () => props.post?.excerpt || 'Read this blog post.',
);
const ogImage = computed(
  () => props.post?.featuredImage?.src || '/images/default-og-image.png',
); // Add a default OG image path
const canonicalUrl = computed(() => {
  // Construct canonical URL - replace with your actual domain
  const base = 'https://yourdomain.com'; // <<<--- IMPORTANT: Replace with your actual domain
  return props.post ? `${base}/blog/${props.post.slug}` : base;
});

// Update meta tags using useHead
watch(
  () => props.post,
  (currentPost) => {
    if (currentPost) {
      useHead({
        title: pageTitle.value,
        meta: [
          { name: 'description', content: pageDescription.value },
          // Open Graph
          { property: 'og:title', content: pageTitle.value },
          { property: 'og:description', content: pageDescription.value },
          { property: 'og:type', content: 'article' },
          { property: 'og:url', content: canonicalUrl.value },
          { property: 'og:image', content: ogImage.value },
          { property: 'article:published_time', content: currentPost.date },
          {
            property: 'article:modified_time',
            content: currentPost.lastModified || currentPost.date,
          },
          // Twitter Card
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: pageTitle.value },
          { name: 'twitter:description', content: pageDescription.value },
          { name: 'twitter:image', content: ogImage.value },
          // Robots
          {
            name: 'robots',
            content: currentPost.metaRobots || 'index, follow',
          },
        ],
        link: [
          {
            rel: 'canonical',
            href: currentPost.canonicalUrl || canonicalUrl.value,
          },
        ],
        // Add JSON-LD script if available in post data
        script: currentPost.schema
          ? [
              {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(currentPost.schema),
              },
            ]
          : [],
      });
    } else {
      useHead({ title: 'Post Not Found' });
    }
  },
  { immediate: true },
);
</script>
