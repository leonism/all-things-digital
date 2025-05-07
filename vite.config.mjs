// Import required modules for Vite configuration
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";
// import imagemin from "vite-plugin-imagemin"; // Original import
import imageminImport from "vite-plugin-imagemin"; // Renamed for clarity
import htmlMinifier from "vite-plugin-html-minifier";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { resolve } from "path";
// For Vue support, if you haven't already (based on previous interactions):
// import vue from "@vitejs/plugin-vue";
// import { fileURLToPath, URL } from 'node:url';

// Resolve the actual plugin function, handling potential CJS/ESM interop issues
const imagemin = imageminImport.default || imageminImport;

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
        blogpost: resolve(__dirname, "src/blog-post.html"),
        category: resolve(__dirname, "src/category.html"),
        credits: resolve(__dirname, "src/credits.html"),
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

  // Add resolve alias configuration if not already present from previous steps
  // resolve: {
  //   alias: {
  //     '@': fileURLToPath(new URL('./src', import.meta.url))
  //   }
  // },

  // Plugins configuration
  plugins: [
    // vue(), // If using Vue
    // Image minification
    imagemin({ // Now 'imagemin' should correctly refer to the plugin function
      gifsicle: { interlaced: true }, // Example: keep or add other optimizers
      mozjpeg: { quality: 80 },    // Example: for JPEGs
      pngquant: {
        quality: [0.7, 0.9],
        speed: 4,
      },
      svgo: { // Example: for SVGs
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false }
        ]
      },
      webp: { // Add WebP configuration
        quality: 75, // Adjust quality as needed (0-100)
      },
      // Optionally, add AVIF configuration if you installed imagemin-avif
      // avif: {
      //   quality: 50, // Adjust quality as needed
      // },
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
