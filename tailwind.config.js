/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        card: '#121214',
        foreground: '#fafafa',
        primary: '#EAB308',
        'primary-foreground': '#000000',
        muted: '#1f1f22',
        'muted-foreground': '#a1a1aa',
        border: '#27272a'
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px 2px rgba(234, 179, 8, 0.4)' },
          '50%': { opacity: '.7', boxShadow: '0 0 5px 0px rgba(234, 179, 8, 0.1)' },
        }
      }
    },
  },
  plugins: [],
}
