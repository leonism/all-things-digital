// Import required modules for Vite configuration
import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

/**
 * Vite configuration for the project.
 *
 * This config sets up:
 * - Project root directory
 * - Build output settings
 * - PostCSS plugins (Tailwind CSS and Autoprefixer)
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
})
