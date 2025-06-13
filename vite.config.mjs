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
import Markdown from 'unplugin-vue-markdown/vite';
// Import imagemin plugins for WebP generation
import imageminWebp from 'imagemin-webp';
// Import imagemin plugins for AVIF generation
import imageminAvif from 'imagemin-avif';
// Import the viteCompression plugin for Vite.
import viteCompression from 'vite-plugin-compression';
// Import custom plugins for AVIF/webp generation
import { imageFormatsPlugin } from './scripts/generate-modern-formats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Vite configuration for the project.
 *
 * This configuration object defines settings for Vite's development server,
 * build process, CSS processing, and plugins.
 */
export default defineConfig({
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/',
  root: './src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.(woff2?|ttf|eot|otf)$/.test(String(assetInfo.name))) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(String(assetInfo.name))) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  css: {
    postcss: {},
  },
  plugins: [
    imageFormatsPlugin(), // Keep this first
    vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    }),
    Markdown({}),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
      filter:
        /\.(js|css|html|svg|woff|woff2|ttf|eot|json|jpg|jpeg|gif|png|ico)$/i,
      deleteOriginFile: false,
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 3,
        interlaced: true,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 50,
      },
      pngquant: {
        quality: [0.7, 0.9],
        speed: 1,
      },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
      // Generate WebP versions
      webp: {
        quality: 75,
      },
      // Generate AVIF versions
      avif: {
        quality: 50,
      },
    }),
    tailwindcss(),
  ],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
