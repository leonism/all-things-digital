// Import required modules for Vite configuration
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";
import imagemin from "vite-plugin-imagemin";
import htmlMinifier from "vite-plugin-html-minifier";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { resolve } from "path";

/**
 * Vite configuration for the project.
 *
 * This config sets up:
 * - Project root directory
 * - Build output settings
 * - PostCSS plugins (Tailwind CSS and Autoprefixer)
 * - Images, HTML, CSS, and JavaScript compressions using Vite plugins
 * - EJS templating for HTML modularity
 */
export default defineConfig({
  // Set the project root directory to './src'
  root: "./src",

  // Build configuration
  build: {
    // Output directory for built files (relative to project root)
    outDir: "../dist",
    // Clear the output directory before each build
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/about.html"),
        contact: resolve(__dirname, "src/contact.html"),
        blog: resolve(__dirname, "src/blog.html"),
        category: resolve(__dirname, "src/category.html"),
      },
    },
  },

  // CSS processing configuration
  css: {
    // PostCSS configuration
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },

  // Plugins configuration
  plugins: [
    // Image minification
    imagemin({
      pngquant: {
        quality: [0.7, 0.9],
        speed: 4,
      },
    }),
    // HTML minification
    htmlMinifier({
      minify: true,
      collapseWhitespace: true,
      keepClosingSlash: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    }),
    // EJS templating for HTML
    ViteEjsPlugin(),
    // Latest Tailwind 4.1 for Vite needs this line
    tailwindcss(),
  ],

  server: {
    watch: {
      usePolling: true,
    },
  },
});
