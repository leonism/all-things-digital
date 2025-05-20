// Add custom drop-shadow utilities in tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      dropShadow: {
        'custom-lg': [
          '0 10px 8px rgba(0, 0, 0, 0.1)',
          '0 4px 3px rgba(0, 0, 0, 0.06)', // Layered shadows for depth
        ],
      },
    },
  },
};
