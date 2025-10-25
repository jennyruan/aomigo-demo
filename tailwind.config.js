/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#FFF5E6',
          100: '#FFE8CC',
          200: '#FFD199',
          300: '#FFBA66',
          400: '#FFA333',
          500: '#FF6B35',
          600: '#E55A24',
          700: '#CC4913',
          800: '#B23802',
          900: '#992700',
        },
        cream: {
          50: '#FFF5E6',
          100: '#FFF0D9',
          200: '#FFE8C2',
          300: '#FFE0AB',
          400: '#FFD894',
          500: '#FFD07D',
        },
        purple: {
          50: '#F4EFFA',
          100: '#E9DFF5',
          200: '#D3BFEB',
          300: '#BD9FE1',
          400: '#A77FD7',
          500: '#915FCD',
          600: '#6A4C93',
          700: '#533A72',
          800: '#3C2851',
          900: '#251630',
        },
        brown: {
          50: '#F8F6F4',
          100: '#EBE8E5',
          200: '#D7D1CB',
          300: '#C3BAB1',
          400: '#AFA397',
          500: '#9B8C7D',
          600: '#7A6F63',
          700: '#3D2E2E',
          800: '#2E2222',
          900: '#1F1616',
        },
      },
      fontFamily: {
        sans: ['Fredoka', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
};
