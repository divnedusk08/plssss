/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60a5fa', // blue-400
          DEFAULT: '#2563EB', // blue-600
          dark: '#1e40af', // blue-800
        },
        accent: {
          light: '#fef9c3', // yellow-100
          DEFAULT: '#FBBF24', // yellow-400
          dark: '#b45309', // yellow-700
        },
        background: '#F3F4F6', // gray-100
        text: '#1F2937', // gray-800
      },
    },
  },
  plugins: [],
} 