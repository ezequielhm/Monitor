import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        blue: {
          50: '#ebf8ff',
          100: '#bee3f8',
          200: '#90cdf4',
          300: '#63b3ed',
          400: '#4299e1',
          500: '#3182ce', // Chakra's blue.500
          600: '#2b6cb0',
          700: '#2c5282',
          800: '#2a4365',
          900: '#1A365D',
        },
        gray: {
          50: '#f7fafc',
          100: '#edf2f7',
          200: '#e2e8f0',
          300: '#cbd5e0',
          400: '#a0aec0',
          500: '#718096', // Chakra's gray.500
          600: '#4a5568',
          700: '#2d3748',
          800: '#1a202c',
          900: '#171923',
        },
        green: {
          500: '#48bb78',
          600: '#38a169',
          700: '#2f855a',
        },
        red: {
          500: '#f56565',
          600: '#e53e3e',
          700: '#c53030',
        },
        yellow: {
          500: '#ecc94b',
          600: '#d69e2e',
        },
        // Puedes añadir más según lo que uses
      },
      borderRadius: {
        md: '0.375rem',   // Chakra default
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        18: '4.5rem', // extra útil
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      screens: {
        '3xl': '1920px',
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
