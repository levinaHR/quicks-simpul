/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F80ED',
        'primary-gray': {
          50: '#E0E0E0',
          100: '#828282',
          200: '#4F4F4F',
        },
        'primary-white': '#F2F2F2',
        'i-red': '#EB5757',
        'i-orange': '#F8B76B',
        'i-yellow': '#EB5757',
        'i-purple': '#8785FF',
        'i-green': '#43B78D',
        'ci-yellow': '#E5A443',
        'ci-purple': '#9B51E0',
        'ci-green': '#43B78D',
        'c-yellow': '#FCEED3',
        'c-purple': '#EEDCFF',
        'c-green': '#D2F2EA',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
});
