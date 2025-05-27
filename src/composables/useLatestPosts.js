import { computed } from 'vue';
import postsData from '../blog-data.json';
import { useFeaturedPost } from './useFeaturedPost';

export function useLatestPosts() {
  const featuredPost = useFeaturedPost();

  return computed(() => {
    const published = postsData.filter(
      (post) => post.status === 'published' || !post.status,
    );
    return published
      .filter((post) => post.slug !== featuredPost.value?.slug)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  });
}
