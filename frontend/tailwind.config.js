/** @type {import('tailwindcss').Config} */
// NOTE: Tailwind v4 reads theme config from @theme in index.css, not this file.
// This file is kept for compatibility but theme tokens are defined in src/index.css.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}
