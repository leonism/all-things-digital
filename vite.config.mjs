// Import required modules for Vite configuration
import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";
import imagemin from "vite-plugin-imagemin";
import htmlMinifier from "vite-plugin-html-minifier";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  // Set the project root directory to './src'
  root: "./src",

  // Build configuration
  build: {
    // Output directory for built files (relative to project root)
    outDir: "../dist",
    // Clear the output directory before each build
    emptyOutDir: true,
  },

  // CSS processing configuration
  css: {
    // PostCSS configuration
    postcss: {
      plugins: [tailwindcss, autoprefixer],
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
    // Plugin EJS templating for HTML // <-- Remove
    // ViteEjsPlugin(), // <-- Remove
    // Latest Tailwind 4.1 for Vite needs this line
    tailwindcss(),
  ],

  server: {
    watch: {
      usePolling: true,
    },
  },
});
