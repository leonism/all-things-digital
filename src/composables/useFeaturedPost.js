import { computed } from 'vue';
import postsData from '../blog-data.json'; // Importing blog data from a JSON file.

/**
 * A Vue composition function to retrieve the featured post.
 *
 * @returns {ComputedRef<Object|null>} A computed property that provides the featured post,
 * or `null` if no valid featured post exists.
 */
export function useFeaturedPost() {
  // Computed property to dynamically find and return the featured post.
  return computed(() =>
    postsData.find(
      (post) =>
        post.featured && // Check if the post is marked as featured.
        (post.status === 'published' || !post.status), // Ensure the post is published or has no status.
    ),
  );
}
