/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f3f4f6",
        foreground: "#111827",
        blue: '#1fb6ff',
        blue_background: '#E0F7FA',
        brown: '#8B4513',
        brown_background: '#D7B49B',
        default: '#000000', // Couleur par défaut (noir)
        gray: '#A9A9A9',
        gray_background: '#D3D3D3',
        green: '#4CAF50',
        green_background: '#C8E6C9',
        orange: '#FF9800',
        orange_background: '#FFE0B2',
        yellow: '#FFEB3B',
        pink: '#E91E63',
        pink_background: '#F8BBD0',
        purple: '#9C27B0',
        purple_background: '#E1BEE7',
        red: '#F44336',
        red_background: '#FFCDD2',
        yellow_background: '#FFF9C4'
      },
    },
  },
  plugins: [require('daisyui'),],
};
