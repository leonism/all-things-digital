/**
 * PostCSS Configuration File
 *
 * Defines plugins to transform CSS:
 * - TailwindCSS: Utility-first CSS framework
 * - Autoprefixer: Adds vendor prefixes to CSS rules
 *
 * These plugins will process CSS in the order they are defined.
 */
// module.exports = {
//   plugins: [
// TailwindCSS - Processes Tailwind directives and generates utility classes
// require('tailwindcss'),

// Autoprefixer - Automatically adds vendor prefixes for better browser compatibility
// require('autoprefixer'),
// Note: No configuration object is passed as we're using default settings
//   ],
// }

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
