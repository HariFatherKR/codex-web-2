/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Inter Variable'", "'Pretendard Variable'", 'Inter', 'sans-serif'],
        body: ["'Inter Variable'", "'Pretendard Variable'", 'Inter', 'sans-serif'],
      },
      colors: {
        midnight: '#0f172a',
        coral: '#f97316',
        mist: '#e2e8f0',
      },
      boxShadow: {
        soft: '0 10px 40px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
