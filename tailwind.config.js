/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d8e1ee',
          200: '#b0c0d8',
          300: '#889fc4',
          400: '#5a739e',
          500: '#3d567f',
          600: '#2b4068',
          700: '#1d304f',
          800: '#142236',
          900: '#0d1828',
          950: '#080f1c',
          975: '#050a14',
        },
        lime: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
        },
        accent: {
          blue: '#38bdf8',
          coral: '#fb7185',
          amber: '#fbbf24',
          violet: '#a78bfa',
          teal: '#2dd4bf',
        },
        success: '#22c55e',
        warning: '#fbbf24',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'count-up': 'countUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 12px rgba(163, 230, 53, 0.2)' },
          '50%': { opacity: '0.85', boxShadow: '0 0 20px rgba(163, 230, 53, 0.35)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0d1828 0%, #142236 50%, #0d1828 100%)',
        'gradient-card': 'linear-gradient(165deg, rgba(29, 48, 79, 0.25) 0%, rgba(10, 16, 28, 0.4) 100%)',
        'gradient-lime': 'linear-gradient(135deg, #bef264 0%, #84cc16 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(29, 48, 79, 0.15) 0%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
