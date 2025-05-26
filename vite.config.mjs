// Import the 'defineConfig' function from Vite to provide type-safe configuration.
import { defineConfig } from 'vite';
// Import the Vue plugin for Vite
import vue from '@vitejs/plugin-vue';
// Import the Tailwind CSS plugin for Vite to integrate Tailwind CSS processing.
import tailwindcss from '@tailwindcss/vite';
// Import Autoprefixer to parse CSS and add vendor prefixes to CSS rules.
import autoprefixer from 'autoprefixer';
// Import the Vite plugin for image minification.
import viteImagemin from 'vite-plugin-imagemin';
// Import the Vite plugin for HTML minification to reduce the size of HTML files.
import htmlMinifier from 'vite-plugin-html-minifier';
// Import the 'resolve' function from the 'path' module for resolving file paths.
import { resolve, dirname } from 'node:path';
// Import the 'resolve' function from the 'url' module for resolving file paths.
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Import the viteCompression plugin for Vite.
import viteCompression from 'vite-plugin-compression';

/**
 * Vite configuration for the project.
 *
 * This configuration object defines settings for Vite's development server,
 * build process, CSS processing, and plugins.
 */
export default defineConfig({
  // Set root dir to './src', meaning Vite will look for source files in the 'src' folder.
  root: './src',

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // Configuration for the build process.
  build: {
    // Built files will be placed in '../dist' (i.e., a 'dist' folder at the same level as 'src').
    outDir: '../dist',
    // If true, Vite will clear the output directory before each build.
    emptyOutDir: true,
    // Disable inlining for font files
    assetsInlineLimit: 0,
    // Advanced Rollup options for customizing the build.
    rollupOptions: {
      // Defines multiple entry points for the application.
      // NOTE: This will need to change significantly for a Vue SPA.
      // We will likely have a single entry point (src/main.js) that mounts the Vue app.
      // HTML files will be served by Vue Router.
      input: {
        // Keep index.html as the main entry for now, Vue will mount here.
        main: resolve(__dirname, 'src/index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.(woff2?|ttf|eot|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
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
    // Enable the Vue plugin
    vue(),

    // Add the compression plugin here
    viteCompression({
      verbose: true, // Optional: Show compressed files in console
      disable: false, // Enable compression
      threshold: 10240, // Only compress files larger than 10KB
      algorithm: 'gzip', // Compression algorithm (can also use 'brotliCompress')
      ext: '.gz', // File extension for compressed files
      filter: /\.(js|css|html|svg|woff|woff2|ttf|eot|json)$/i, // Regex to target font files and other assets
      deleteOriginFile: false, // Keep original files
    }),

    // Image minification plugin configuration.
    viteImagemin({
      // Configuration for GIF optimization using gifsicle.
      gifsicle: {
        optimizationLevel: 7, // Sets GIF optimization level (0-3, higher is more optimized).
        interlaced: true, // Creates interlaced GIFs.
      },
      optipng: {
        optimizationLevel: 7, // Sets PNG optimization level (0-7, higher is more optimized).
      },
      // Configuration for JPEG optimization using mozjpeg.
      mozjpeg: {
        quality: 20, // Sets JPEG quality (0-100, higher is better quality but larger file).
      },
      // Configuration for PNG optimization using pngquant.
      pngquant: {
        quality: [0.7, 0.9], // Sets PNG quality range (0-1, lower is more compression).
        speed: 1, // Sets pngquant speed/quality trade-off (1=slowest/best, 11=fastest/worst).
      },
      // Configuration for SVG optimization using SVGO.
      svgo: {
        plugins: [
          { name: 'removeViewBox' }, // Removes the viewBox attribute (can be problematic, use with caution).
          { name: 'removeEmptyAttrs', active: false }, // Example: disable removing empty attributes.
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
    // NOTE: This might conflict with Vue's handling of index.html, may need adjustment.
    htmlMinifier({
      minify: true, // Enables minification.
      collapseWhitespace: true, // Removes whitespace in HTML.
      keepClosingSlash: true, // Keeps closing slashes on void elements
      removeComments: true, // Removes HTML comments.
      removeRedundantAttributes: true, // Removes redundant attributes (e.g., type="text" on input).
      removeScriptTypeAttributes: true, // Removes type="text/javascript" from script tags.
      removeStyleLinkTypeAttributes: true, // Removes type="text/css" from link and style tags.
      useShortDoctype: true, // Uses the short HTML5 doctype (<!DOCTYPE html>).
      removeEmptyAttributes: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
    }),

    // EJS templating plugin, allowing use of EJS syntax in .html files.
    // NOTE: This will likely be removed once the migration to Vue is complete.
    // ViteEjsPlugin(),

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
