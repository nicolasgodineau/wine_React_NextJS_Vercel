/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // Active le mode sombre basé sur les préférences système
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#660708',  // Couleur pour H1
        secondary: '#4c0519',  // Couleur pour H2
        secondaryLight: '#6d1422',
        tertiary: '#BA181B',   // Couleur pour H3
        quaternary: '#E5383B', // Couleur pour H4
        paragraph: '#333333',   // Gris foncé pour les paragraphes
        link: '#D13F52',         // Couleur douce pour les liens
        linkHover: '#16a085',    // Couleur au survol pour les liens
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
        red: '#4c0519',
        red_background: '#FFCDD2',
        yellow_background: '#FFF9C4'
      },
      fontSize: {
        small: ".7rem",
        h1: '2.25rem', // Taille personnalisée pour H1
        h2: '1.875rem', // Taille personnalisée pour H2
        h3: '1.5rem',   // Taille personnalisée pour H3
        h4: '1.25rem',   // Taille personnalisée pour H4
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semi: 600,
        bold: 700,
      },
    },
  },
  plugins: [],
};
/* idée de palette 
https://coolors.co/palette/0b090a-161a1d-660708-a4161a-ba181b-e5383b-b1a7a6-d3d3d3-f5f3f4-ffffff


bg-white pour #FFFFFF
bg-neutral-100 pour #F5F3F4
bg-neutral-300 pour #D3D3D3
bg-neutral-400 pour #B1A7A6
bg-red-500 pour #E5383B
bg-red-700 pour #BA181B
bg-red-800 pour #A4161A
bg-red-900 pour #660708
bg-neutral-900 pour #161A1D
bg-black pour #0B090A
*/