// Import the 'defineConfig' function from Vite to provide type-safe configuration.
import { defineConfig } from "vite";
// Import the Tailwind CSS plugin for Vite to integrate Tailwind CSS processing.
import tailwindcss from "@tailwindcss/vite";
// Import Autoprefixer to parse CSS and add vendor prefixes to CSS rules.
import autoprefixer from "autoprefixer";
// Import the Vite plugin for image minification.
// Assuming the latest version exports a default function, common for Vite plugins.
import viteImagemin from "vite-plugin-imagemin";
// Import the Vite plugin for HTML minification to reduce the size of HTML files.
import htmlMinifier from "vite-plugin-html-minifier";
// Import the Vite plugin for EJS templating, allowing dynamic data in HTML.
import { ViteEjsPlugin } from "vite-plugin-ejs";
// Import the 'resolve' function from the 'path' module for resolving file paths.
// Added dirname
import { resolve, dirname } from "path";
// Added fileURLToPath
import { fileURLToPath } from "url";
// Add this line to import the Vue plugin
import vue from "@vitejs/plugin-vue";

const __filename = fileURLToPath(import.meta.url); // Define __filename
const __dirname = dirname(__filename); // Define __dirname

/**
 * Vite configuration for the project.
 *
 * This configuration object defines settings for Vite's development server,
 * build process, CSS processing, and plugins.
 */
export default defineConfig({
  // Set the project root directory. All paths will be resolved relative to this.
  root: "./src",

  // Configuration for the build process.
  build: {
    // Specifies the output directory for built files, relative to the project root.
    outDir: "../dist", // Corrected: relative to project root, not src/
    // If true, Vite will clear the output directory before each build.
    emptyOutDir: true,
    // Advanced Rollup options for customizing the build.
    rollupOptions: {
      // Defines multiple entry points for the application.
      input: {
        main: resolve(__dirname, "src/index.html"), // Main entry point (homepage).
        about: resolve(__dirname, "src/about.html"), // About page entry point.
        contact: resolve(__dirname, "src/contact.html"), // Contact page entry point.
        blog: resolve(__dirname, "src/blog.html"), // Blog listing page entry point.
        blogpost: resolve(__dirname, "src/blog-post.html"), // Single blog post template entry point.
        category: resolve(__dirname, "src/category.html"), // Category page entry point.
        credits: resolve(__dirname, "src/credits.html"), // Credits page entry point.
      },
    },
  },

  // Configuration for CSS processing.
  css: {
    // Configuration for PostCSS.
    postcss: {
      // An array of PostCSS plugins to be used.
      plugins: [
        tailwindcss, // Integrates Tailwind CSS.
        autoprefixer, // Adds vendor prefixes for CSS properties.
      ],
    },
  },

  // Configuration for Vite plugins.
  plugins: [
    vue(), // Add this line to enable the Vue plugin

    // Image minification plugin configuration.
    (viteImagemin.default || viteImagemin)({
      // Configuration for GIF optimization using gifsicle.
      gifsicle: {
        interlaced: true, // Creates interlaced GIFs.
      },
      // Configuration for JPEG optimization using mozjpeg.
      mozjpeg: {
        quality: 80, // Sets JPEG quality (0-100, higher is better quality but larger file).
      },
      // Configuration for PNG optimization using pngquant.
      pngquant: {
        quality: [0.7, 0.9], // Sets PNG quality range (0-1, lower is more compression).
        speed: 4, // Sets pngquant speed/quality trade-off (1=slowest/best, 11=fastest/worst).
      },
      // Configuration for SVG optimization using SVGO.
      svgo: {
        plugins: [
          // Removes the viewBox attribute (can be problematic, use with caution).
          { name: "removeViewBox" },
          // Example: disable removing empty attributes.
          { name: "removeEmptyAttrs", active: false },
        ],
      },
      // Configuration for WebP image format conversion and optimization.
      webp: {
        quality: 75, // Sets WebP quality (0-100).
      },
      // Optionally, add AVIF configuration if you installed imagemin-avif (currently commented out).
      avif: {
        // Adjust AVIF quality as needed.
        quality: 50,
      },
    }),

    // HTML minification plugin configuration.
    htmlMinifier({
      // Enables minification.
      minify: true,
      // Removes whitespace in HTML.
      collapseWhitespace: true,
      // Keeps closing slashes on void elements (e.g., <img />).
      keepClosingSlash: true,
      // Removes HTML comments.
      removeComments: true,
      // Removes redundant attributes (e.g., type="text" on input).
      removeRedundantAttributes: true,
      // Removes type="text/javascript" from script tags.
      removeScriptTypeAttributes: true,
      // Removes type="text/css" from link and style tags.
      removeStyleLinkTypeAttributes: true,
      // Uses the short HTML5 doctype (<!DOCTYPE html>).
      useShortDoctype: true,
    }),

    // EJS templating plugin, allowing use of EJS syntax in .html files.
    ViteEjsPlugin(),

    // For Tailwind CSS v4+ with its Vite plugin, this is the correct way.
    tailwindcss(),
  ],

  // Configuration for the Vite development server.
  server: {
    // Configuration for file watching.
    watch: {
      // Enables polling for file changes. Useful in some environments (e.g., Docker, WSL)
      // where filesystem events might not work reliably. Can be CPU intensive.
      usePolling: true,
    },
  },
  // Add alias resolution
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // Points '@' to the 'src' directory in your project root
    },
  },
});
