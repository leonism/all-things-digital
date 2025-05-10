// Add custom drop-shadow utilities in tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx,html}", // Scan Vue, JS, HTML files in src
    "./src/index.html", // Explicitly include if not covered by glob
  ],
  theme: {
    extend: {
      dropShadow: {
        "custom-lg": [
          "0 10px 8px rgba(0, 0, 0, 0.1)",
          "0 4px 3px rgba(0, 0, 0, 0.06)", // Layered shadows for depth
        ],
      },
    },
  },
};
