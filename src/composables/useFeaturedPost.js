import { computed } from 'vue';
import postsData from '../blog-data.json'; // Importing blog data from a JSON file.

/**
 * A Vue composition function to retrieve the featured post.
 *
 * @returns {ComputedRef<Object|null>} A computed property that provides the featured post,
 * or `null` if no valid featured post exists.
 */
export function useFeaturedPost() {
  return computed(() => {
    const publishedPosts = postsData.filter(
      (post) => post.status === 'published' || !post.status
    );
    // Return the first published post as featured, or find one marked as featured
    return publishedPosts.find(post => post.featured) || publishedPosts[0] || null;
  });
}
