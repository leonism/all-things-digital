// Import the 'defineConfig' function from Vite to provide type-safe configuration.
import { defineConfig } from "vite";
// Import the Tailwind CSS plugin for Vite to integrate Tailwind CSS processing.
import tailwindcss from "@tailwindcss/vite";
// Import Autoprefixer to parse CSS and add vendor prefixes to CSS rules.
import autoprefixer from "autoprefixer";
// Import the Vite plugin for image minification.
import viteImagemin from "vite-plugin-imagemin";
// Import the Vite plugin for HTML minification to reduce the size of HTML files.
import htmlMinifier from "vite-plugin-html-minifier";
// Import the Vite plugin for EJS templating, allowing dynamic data in HTML.
import { ViteEjsPlugin } from "vite-plugin-ejs";
// Import the 'resolve' function from the 'path' module for resolving file paths.
import { resolve } from "node:path";

/**
 * Vite configuration for the project.
 *
 * This configuration object defines settings for Vite's development server,
 * build process, CSS processing, and plugins.
 */
export default defineConfig({
  // Set root dir to './src', meaning Vite will look for source files in the 'src' folder.
  root: "./src",

  // Configuration for the build process.
  build: {
    // Specifies the output directory for built files, relative to the project root.
    // Here, built files will be placed in '../dist' (i.e., a 'dist' folder at the same level as 'src').
    outDir: "../dist",
    // If true, Vite will clear the output directory before each build.
    emptyOutDir: true,
    // Advanced Rollup options for customizing the build.
    rollupOptions: {
      // Defines multiple entry points for the application.
      // Each key-value pair represents an HTML file that will be processed as an entry point.
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
    // vue(), // Example: Enable Vue plugin if using Vue.js.

    // Image minification plugin configuration.
    (viteImagemin.default || viteImagemin)({
      // Attempt to use .default if viteImagemin itself is not the function
      // Configuration for GIF optimization using gifsicle.
      gifsicle: {
        interlaced: true, // Creates interlaced GIFs.
      },
      // Configuration for JPEG optimization using mozjpeg.
      mozjpeg: {
        quality: 40, // Sets JPEG quality (0-100, higher is better quality but larger file).
      },
      // Configuration for PNG optimization using pngquant.
      pngquant: {
        quality: [0.7, 0.9], // Sets PNG quality range (0-1, lower is more compression).
        speed: 4, // Sets pngquant speed/quality trade-off (1=slowest/best, 11=fastest/worst).
      },
      // Configuration for SVG optimization using SVGO.
      svgo: {
        plugins: [
          { name: "removeViewBox" }, // Removes the viewBox attribute (can be problematic, use with caution).
          { name: "removeEmptyAttrs", active: false }, // Example: disable removing empty attributes.
        ],
      },
      // Configuration for WebP image format conversion and optimization.
      webp: {
        quality: 75, // Sets WebP quality (0-100).
      },
      // Optionally, add AVIF configuration if you installed imagemin-avif (currently commented out).
      avif: {
        quality: 50, // Adjust AVIF quality as needed.
      },
    }),

    // HTML minification plugin configuration.
    htmlMinifier({
      minify: true, // Enables minification.
      collapseWhitespace: true, // Removes whitespace in HTML.
      keepClosingSlash: true, // Keeps closing slashes on void elements (e.g., <img />).
      removeComments: true, // Removes HTML comments.
      removeRedundantAttributes: true, // Removes redundant attributes (e.g., type="text" on input).
      removeScriptTypeAttributes: true, // Removes type="text/javascript" from script tags.
      removeStyleLinkTypeAttributes: true, // Removes type="text/css" from link and style tags.
      useShortDoctype: true, // Uses the short HTML5 doctype (<!DOCTYPE html>).
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
});
