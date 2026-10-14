/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Delhi Tourism brand palette
        primary: {
          50:  '#fdf8ee',
          100: '#faefd6',
          200: '#f4daab',
          300: '#ecbe75',
          400: '#e29c3f',
          500: '#d4821e',   // warm gold
          600: '#bc671a',
          700: '#9c4e18',
          800: '#7e3f1a',
          900: '#683518',
          950: '#3a1a0b',
        },
        accent: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e5fe',
          300: '#7cd0fd',
          400: '#37b7f8',
          500: '#0d9de9',
          600: '#017cc7',
          700: '#0263a1',
          800: '#065485',
          900: '#0a456f',
          950: '#072c4a',
        },
        surface: {
          light:  '#faf9f7',
          warm:   '#f5f0e8',
          dark:   '#1a1208',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
