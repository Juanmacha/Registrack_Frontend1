/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors :{
        yellowCustom: '#F3D259',
      },
    },
  },
  plugins: [],
};
