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
// Import the 'resolve' function from the 'path' module for resolving file paths.
import { resolve, dirname } from 'node:path';
// Import the 'resolve' function from the 'url' module for resolving file paths.
import { fileURLToPath } from 'node:url';
// Import for markdown parsing
// import Markdown from 'vite-plugin-md';

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
  // Explicitly set the base public path for the application.
  // This is important for correct asset resolution in production builds,
  // especially when deploying to a subpath or ensuring root-relative paths work.
  base: '/',

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
      // NOTE: This will need to change significantly for a Vue SPA.
      // We will likely have a single entry point (src/main.js) that mounts the Vue app.
      // HTML files will be served by Vue Router.
      input: {
        // Keep index.html as the main entry for now, Vue will mount here.
        main: resolve(__dirname, 'src/index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          // Use assetInfo.name and ensure it's a string for the regex test
          if (/\.(woff2?|ttf|eot|otf)$/.test(String(assetInfo.name))) {
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
        autoprefixer, // Adds vendor prefixes for CSS properties.
      ],
    },
  },

  // Configuration for Vite plugins.
  plugins: [
    // Enable the Vue plugin
    // Add this to your plugins array
    vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    }),
    // Markdown({
    //   wrapperComponent: 'BaseLayout.vue', // Optional, or use your own
    //   markdownItOptions: { html: true },
    // }),

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
        quality: 50, // Sets JPEG quality (0-100, higher is better quality but larger file).
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
