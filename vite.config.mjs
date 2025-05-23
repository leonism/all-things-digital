// Import the 'defineConfig' function from Vite to provide type-safe configuration.
import { defineConfig } from 'vite';
// Import the Tailwind CSS plugin for Vite to integrate Tailwind CSS processing.
import tailwindcss from '@tailwindcss/vite';
// Import Autoprefixer to parse CSS and add vendor prefixes to CSS rules.
import autoprefixer from 'autoprefixer';
// Import the Vite plugin for image minification.
import viteImagemin from 'vite-plugin-imagemin';
// Import the Vite plugin for HTML minification to reduce the size of HTML files.
import htmlMinifier from 'vite-plugin-html-minifier';
// Import the Vite plugin for EJS templating, allowing dynamic data in HTML.
import { ViteEjsPlugin } from 'vite-plugin-ejs';
// Import the 'resolve' function from the 'path' module for resolving file paths.
import { resolve } from 'node:path';
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
      input: {
        main: resolve(__dirname, 'src/index.html'), // Main entry point (homepage).
        about: resolve(__dirname, 'src/about.html'), // About page entry point.
        contact: resolve(__dirname, 'src/contact.html'), // Contact page entry point.
        blog: resolve(__dirname, 'src/blog.html'), // Blog listing page entry point.
        blogpost: resolve(__dirname, 'src/blog-post.html'), // Single blog post template entry point.
        category: resolve(__dirname, 'src/category.html'), // Category page entry point.
        credits: resolve(__dirname, 'src/credits.html'), // Credits page entry point.
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
    // vue(), // Example: Enable Vue plugin if using Vue.js.
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
