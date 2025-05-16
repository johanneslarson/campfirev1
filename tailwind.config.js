/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Altform', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        altform: ['Altform', 'sans-serif'],
      },
      colors: {
        primary: "#ed5a24",
        primaryDark: "#af3f16",
        primaryLight: "#ed7d24",
        accent: "#f1ead1",
        dark: "#131211",
        "dark-lighter": "#1e1c1a",
        "dark-light": "#2a2826",
        gray: {
          200: "#f1ead1", // Using Campfire's accent color for text
          300: "#d9d3bc",
          600: "#535353",
          700: "#404040", 
          800: "#282828", 
          900: "#1E1C1B", 
        },
        accentDark: "#131211"
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'campfire': '0.5rem',
      },
      gridTemplateColumns: {
        'cards': 'repeat(auto-fill, minmax(200px, 1fr))',
      },
      animation: {
        'gradient-flow': 'gradient 15s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ]
}; 