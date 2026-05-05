/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}", // FE 폴더 내의 모든 js/jsx 파일을 탐색
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}