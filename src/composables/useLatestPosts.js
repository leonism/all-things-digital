import { computed } from 'vue';
import postsData from '../blog-data.json'; // Importing blog data from a JSON file.
import { useFeaturedPost } from './useFeaturedPost'; // Importing a utility function to get the featured post.

/**
 * A Vue composition function to retrieve the latest published posts,
 * excluding the featured post, and sorted by date in descending order.
 *
 * @returns {ComputedRef<Array>} A computed property that provides an array of the latest 3 posts.
 */
export function useLatestPosts() {
  // Fetch the featured post using the `useFeaturedPost` utility function.
  const featuredPost = useFeaturedPost();

  // Computed property to dynamically calculate and return the latest posts.
  return computed(() => {
    // Filter the posts to include only those marked as 'published' or without a status.
    const published = postsData.filter(
      (post) => post.status === 'published' || !post.status,
    );

    // Exclude the featured post from the list of published posts, if it exists.
    // Then, sort the remaining posts by date in descending order (newest first).
    // Finally, limit the result to the latest 3 posts.
    return published
      .filter((post) => post.slug !== featuredPost.value?.slug) // Exclude featured post.
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date (newest first).
      .slice(0, 3); // Limit to the top 3 posts.
  });
}
