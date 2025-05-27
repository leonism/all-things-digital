import { computed } from 'vue';
import postsData from '@/data/blog-data.json';

export function useBlogPosts() {
  const featuredPost = computed(() =>
    postsData.find(
      (post) => post.featured && (post.status === 'published' || !post.status),
    ),
  );

  const latestPosts = computed(() => {
    const published = postsData.filter(
      (post) => post.status === 'published' || !post.status,
    );
    return published
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter((post) => post.slug !== featuredPost.value?.slug)
      .slice(0, 3);
  });

  return {
    featuredPost,
    latestPosts,
  };
}
