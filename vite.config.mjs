// Import required modules for Vite configuration
import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import imagemin from 'vite-plugin-imagemin'
import html from 'vite-plugin-html-minifier'

/**
 * Vite configuration for the project.
 *
 * This config sets up:
 * - Project root directory
 * - Build output settings
 * - PostCSS plugins (Tailwind CSS and Autoprefixer)
 * - Images, HTML, CSS and Javascript compressions using Vite plugins
 */
export default defineConfig({
  // Set the project root directory to './src'
  root: './src',

  // Build configuration
  build: {
    // Output directory for built files (relative to project root)
    outDir: '../dist',
    // Clear the output directory before each build
    emptyOutDir: true,
    //
    rollupOptions: {
      input: {
        main: './src/index.html',
        about: './src/about.html',
        contact: './src/contact.html',
        blog: './src/blog.html',
        category: './src/category.html',
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
  // images processing configuration
  plugins: [
    imagemin({
      pngquant: {
        quality: [0.7, 0.9],
        speed: 4,
      },
    }),
    // html processing configuration
    html({
      minify: true,
      collapseWhitespace: true,
      keepClosingSlash: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    },
  },
})
