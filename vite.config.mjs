import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import autoprefixer from 'autoprefixer';
import viteImagemin from 'vite-plugin-imagemin';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Markdown from 'unplugin-vue-markdown/vite';
import viteCompression from 'vite-plugin-compression';
import { imageFormatsPlugin } from './scripts/generate-modern-formats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Vite configuration for an advanced Vue + Tailwind CSS + Markdown project.
 * Includes:
 * - Image optimization
 * - Dual compression (Brotli + Gzip)
 * - Modern image format generation (WebP & AVIF)
 * - Precise asset structuring
 * - Full HTML, JS, CSS, and image compression
 */
export default defineConfig({
  // Module resolution and aliases
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': resolve(__dirname, 'src'),
    },
  },

  // Base paths
  base: '/',
  root: './src',
  publicDir: '../public',

  // Build output configuration
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
      output: {
        // Structured asset file naming
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

  // CSS processing (includes autoprefixer)
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },

  plugins: [
    /**
     * Custom plugin for generating modern image formats (WebP & AVIF).
     * Placed first to handle source images early.
     */
    imageFormatsPlugin(),

    /**
     * Vue plugin supporting .vue and .md files as Vue components.
     */
    vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    }),

    /**
     * Markdown plugin to enable .md files as Vue components.
     */
    Markdown({}),

    /**
     * Image optimization using imagemin.
     * Compresses and optimizes image assets during build.
     * Note: AVIF handled separately via imageFormatsPlugin.
     */
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
      webp: {
        quality: 45,
      },
      // AVIF removed here; handled via custom plugin
    }),

    /**
     * Tailwind CSS plugin for utility-first styling.
     */
    tailwindcss(),

    /**
     * Brotli compression plugin — produces .br files for all final assets.
     * Now includes HTML, JS, CSS, and images.
     */
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 0, // Compress all files regardless of size
      algorithm: 'brotliCompress',
      ext: '.br',
      filter: /\.(js|css|html|svg|woff|woff2|ttf|eot|json|jpg|jpeg|gif|png|ico|webp|avif)$/i,
      deleteOriginFile: false,
    }),

    /**
     * Gzip compression plugin — produces .gz files for compatibility.
     */
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 0,
      algorithm: 'gzip',
      ext: '.gz',
      filter: /\.(js|css|html|svg|woff|woff2|ttf|eot|json|jpg|jpeg|gif|png|ico|webp|avif)$/i,
      deleteOriginFile: false,
    }),
  ],

  // Local dev server config
  server: {
    watch: {
      usePolling: true,
    },
  },
});
