// Import the 'defineConfig' function from Vite to provide type-safe configuration.
import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
// Import Autoprefixer to parse CSS and add vendor prefixes to CSS rules.
import autoprefixer from "autoprefixer";
// Import the Vite plugin for image minification.
// Assuming the latest version exports a default function, common for Vite plugins.
import viteImagemin from "vite-plugin-imagemin";
// Import the Vite plugin for HTML minification to reduce the size of HTML files.
import htmlMinifier from "vite-plugin-html-minifier";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  // Set the project root directory. All paths will be resolved relative to this.
  // Here, it's set to './src', meaning Vite will look for source files in the 'src' folder.
  root: "./src",

  // Configuration for the build process.
  build: {
    // Specifies the output directory for built files, relative to the project root.
    // Here, built files will be placed in '../dist' (i.e., a 'dist' folder at the same level as 'src').
    outDir: "../dist",
    // If true, Vite will clear the output directory before each build.
    emptyOutDir: true,
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

  // Add resolve alias configuration
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // Define '@' to point to the 'src' directory
    },
  },

  // Plugins configuration
  plugins: [
    // Plugin Vue for Vite
    vue(),
    // Image minification
    viteImagemin({
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
    // Plugin EJS templating for HTML // <-- Remove
    // ViteEjsPlugin(), // <-- Remove
    // Latest Tailwind 4.1 for Vite needs this line
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
