# Vue 3 Migration and Blog Integration Plan

This document details the step-by-step plan for migrating the existing project to Vue 3 and implementing the requested blog features, based on the previously discussed outline.

## Phase 1: Project Setup and Vue 3 Migration

1.  **Install Dependencies:** Add Vue 3 and related libraries to the project using npm or yarn.
    ```bash
    npm install vue@next vue-router@next
    npm install -D @vitejs/plugin-vue
    ```
2.  **Configure Vite:** Update `vite.config.mjs` to include the Vue plugin (`@vitejs/plugin-vue`) and ensure it coexists or replaces the EJS plugin configuration as needed.
3.  **Establish Vue App Structure:** Create the core Vue application files:
    *   `src/main.js`: Initialize the Vue app instance, integrate Vue Router, and mount the app.
    *   `src/App.vue`: The root Vue component, potentially containing the main layout structure and `<router-view>`.
    *   `src/router/index.js`: Define application routes using Vue Router, including initial placeholders for blog routes.
4.  **Component Migration:** Systematically convert existing EJS templates and associated JavaScript into Vue single-file components (`.vue`).
    *   Start with shared layout components (header, footer, navigation).
    *   Convert individual page structures into Vue components.
    *   Refactor any EJS-specific logic or data passing into Vue's props, data, computed properties, and methods.
    *   Ensure the EJS plugin is eventually removed or its usage minimized to only essential parts if any remain during transition.
5.  **TailwindCSS Integration:** Verify that TailwindCSS utility classes and custom configurations (`tailwind.config.js`, `postcss.config.js`) work seamlessly within the `.vue` components. Adjust setup if necessary.

## Phase 2: Blog Content Structure and Data Processing

1.  **Content Directory:** Create a dedicated directory for blog posts, e.g., `src/content/posts/`.
2.  **Markdown Frontmatter Standard:** Define a consistent YAML frontmatter structure for all blog posts (e.g., `title`, `date`, `author`, `categories: []`, `tags: []`, `description`). Create example `.md` files using this structure.
3.  **Markdown Processing:**
    *   Evaluate and select a suitable Vite plugin for Markdown processing (e.g., `vite-plugin-md`, `vite-ssg`, or a custom solution).
    *   Configure the chosen plugin or develop a script within the Vite build process (`vite.config.mjs` or a separate script) to:
        *   Read all `.md` files from the content directory.
        *   Parse the frontmatter metadata.
        *   Convert Markdown content to HTML.
        *   Generate a single JSON file (e.g., `blog-data.json`) containing an array of all post objects (metadata + HTML content) during the build.
4.  **Blog Routing:** Update `src/router/index.js` to define dynamic routes for the blog:
    *   `/blog`: Main blog listing page.
    *   `/blog/:slug`: Individual blog post page (using a unique slug derived from the filename or title).
    *   `/blog/category/:categoryName`: Page listing posts for a specific category.
    *   `/blog/tag/:tagName`: Page listing posts for a specific tag.

## Phase 3: Blog Feature Implementation (Vue Components)

1.  **Core Blog Components:** Develop the necessary Vue components:
    *   `BlogList.vue`: Fetches/imports the `blog-data.json` and displays a list of posts, potentially with pagination.
    *   `BlogPost.vue`: Displays a single post based on the `:slug` route parameter, rendering the HTML content and metadata.
    *   `CategoryArchive.vue` / `TagArchive.vue`: Filter and display posts based on the `:categoryName` or `:tagName` route parameters.
2.  **Client-Side Search:**
    *   Install a search library: `npm install fuse.js`.
    *   Create a `BlogSearch.vue` component.
    *   Implement logic within this component to load the `blog-data.json` and use Fuse.js to search through post titles, descriptions, and potentially content based on user input.
    *   Display search results dynamically.
3.  **SEO Implementation:**
    *   Integrate `vue-meta` or use Vue 3's Teleport feature for dynamic updates.
    *   In `BlogPost.vue`, `CategoryArchive.vue`, `TagArchive.vue`, etc., dynamically set page `<title>` and `<meta name="description">` based on post/category/tag data.
    *   Generate Open Graph (OG) meta tags dynamically within relevant components.
    *   Embed JSON-LD structured data (`BlogPosting` schema) within `BlogPost.vue` using post metadata.
4.  **Sitemap & RSS Generation:**
    *   Utilize a Vite plugin (like `vite-plugin-sitemap`) or extend the build script to generate `sitemap.xml` based on defined routes and blog post data.
    *   Similarly, configure a plugin or script to generate an `rss.xml` feed from the blog post data during the build.
5.  **Comment System:**
    *   Choose a third-party comment platform (Giscus recommended for GitHub projects).
    *   Create a `Comments.vue` component.
    *   Embed the chosen comment system within `BlogPost.vue`, passing necessary identifiers (like post slug or URL).

## Phase 4: Testing, Refinement, and Deployment

1.  **Testing:** Conduct thorough testing across different browsers and devices:
    *   Verify all routes work correctly.
    *   Test blog post rendering, category/tag filtering, and pagination.
    *   Validate search functionality.
    *   Check dynamic SEO tags (titles, descriptions, OG, JSON-LD) using browser developer tools and online validators.
    *   Confirm `sitemap.xml` and `rss.xml` are generated correctly and are valid.
    *   Test the comment system integration.
2.  **Refinement:** Address any bugs, improve performance, refine styling based on the existing design, and optimize the user experience.
3.  **Build Verification:** Run the production build (`npm run build`) and preview (`npm run preview`) to ensure the static output is correct and optimized.
4.  **Deployment:** Deploy the generated `dist` folder to the hosting provider.
