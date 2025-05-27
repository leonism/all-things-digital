import { computed } from 'vue';
import postsData from '../blog-data.json';

export function useFeaturedPost() {
  return computed(() =>
    postsData.find(
      (post) => post.featured && (post.status === 'published' || !post.status),
    ),
  );
}
