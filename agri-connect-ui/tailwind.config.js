module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#16A34A', // primary green
          dark: '#15803D',    // hover/dark
          light: '#86EFAC',   // subtle accents
        },
        accent: {
          DEFAULT: '#F59E0B', // amber
          dark: '#D97706',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 6px 24px rgba(16, 185, 129, 0.08)',
      },
    },
  },
  plugins: [],
};
