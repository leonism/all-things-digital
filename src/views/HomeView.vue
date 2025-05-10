<!-- src/views/HomeView.vue -->
<script setup>
import HomeHeader from "@/content/ContentHomeHeader.vue"; // Using @ alias
import FeaturedPost from "@/content/ContentFeaturedPost.vue";
import LatestBlog from "@/content/ContentLatestBlog.vue"; // Assuming this component exists
import BlogGrid from "@/content/ContentBlogGrid.vue"; // This might need rework (see Step 4)

// Placeholder data matching the live site structure (replace with actual data source later)
const featuredPostData = {
  title: "You really think you can fly that thing?", // Example title
  date: "October 27, 2023", // Example date
  imageSrc: "/img/blog/blog-post-1.png", // Example image path (ensure it exists in public/img)
  avatarSrc: "/img/authors/author-1.png", // Example avatar path (ensure it exists)
  tags: ["CSS", "Python", "Machine-Learning"], // Example tags
};

// Placeholder data for the blog grid (replace with actual data source later)
// Note: ContentBlogGrid.vue currently looks like a single article, needs fixing (Step 4)
const blogGridPosts = [
  {
    id: 1,
    title: "Life finds a way.",
    content:
      "Yes, Yes, without the oops! Yeah, but John, if The Pirates of the Caribbean breaks down, the pirates don't eat the tourists.",
    date: "Oct 26, 2023",
    tags: ["CSS", "Python", "Machine-Learning"],
  },
  {
    id: 2,
    title: "Just my luck, no ice.",
    content:
      "They're using our own satellites against us. And the clock is ticking. God help us, we're in the hands of engineers.",
    date: "Oct 25, 2023",
    tags: ["CSS", "Python", "Machine-Learning"],
  },
  // Add more posts as needed
];
</script>

<template>
  <main
    id="mainContent"
    class="max-w-4xl mx-auto">
    <HomeHeader
      mainHeading="All Things Digital"
      subHeading="Data Driven Marketing, Machine Learning, Growth Hacking and Everything Sit in Between." />
    <FeaturedPost
      :title="featuredPostData.title"
      :date="featuredPostData.date"
      :imageSrc="featuredPostData.imageSrc"
      :avatarSrc="featuredPostData.avatarSrc"
      :tags="featuredPostData.tags" />
    <LatestBlog />
    <BlogGrid :posts="blogGridPosts" />
  </main>
</template>

<style scoped>
/* Add component-specific styles here if needed */
</style>
