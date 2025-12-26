/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // Primary Liturgical Purple - Calm and reverent
        primary: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
          950: '#3B0764',
        },
        
        // Soft Lavender accents - gentle and peaceful
        lavender: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C4B5FD',
          500: '#A78BFA',
          600: '#8B5CF6',
          700: '#7C3AED',
          800: '#6D28D9',
          900: '#5B21B6',
          950: '#4C1D95',
        },

        // Sacred Gold - for festive occasions (Christmas, Easter)
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },

        // Soft Rose - for special occasions
        rose: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519',
        },

        // Peaceful Blue - for hope and Advent
        peaceful: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },

        // Sacred White - purity and light
        sacred: {
          50: '#FFFFFF',
          100: '#FEFEFE',
          200: '#FCFCFC',
          300: '#F9F9F9',
          400: '#F5F5F5',
          500: '#F0F0F0',
        },

        // Gentle backgrounds with lavender tint
        background: {
          50: '#FFFFFF',     // Pure white
          100: '#FDFCFE',    // Very light lavender tint
          200: '#FAF8FC',    // Light purple-gray
          300: '#F7F3FA',    // Soft lavender
          400: '#F0EBF5',    // Medium lavender-gray
          500: '#E8E0F0',    // Deeper lavender-gray
        },

        // Text colors optimized for purple theme
        text: {
          primary: '#2D1B4E',    // Deep purple for main text
          secondary: '#4A3764',  // Medium purple for secondary text
          tertiary: '#6B5580',   // Light purple for tertiary text
          accent: '#7E22CE',     // Purple for accents
          muted: '#A89BB3',      // Very light for disabled text
        },

        // Border colors for light theme
        border: {
          light: '#F7F3FA',      // Very light borders
          default: '#F0EBF5',    // Default borders
          medium: '#E8E0F0',     // Medium borders
          dark: '#C4B5D0',       // Darker borders
          accent: '#C084FC',     // Purple accent borders
        },

        // Success, warning, error states - softened
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },

      // Custom gradients - gentle and reverent
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #A855F7 0%, #9333EA 50%, #7E22CE 100%)',
        'lavender-gradient': 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 50%, #D8B4FE 100%)',
        'sacred-gradient': 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 50%, #E9D5FF 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 50%, #FBBF24 100%)',
        'peaceful-gradient': 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)',
        'reverent-gradient': 'linear-gradient(180deg, #FAF5FF 0%, #F3E8FF 50%, #E9D5FF 100%)',
        'heavenly-gradient': 'linear-gradient(135deg, #A855F7 0%, #C084FC 25%, #E9D5FF 75%, #FFFFFF 100%)',
      },

      // Custom shadows with purple tones - very soft
      boxShadow: {
        'primary': '0 4px 20px rgba(168, 85, 247, 0.12)',
        'primary-lg': '0 10px 30px rgba(168, 85, 247, 0.18)',
        'lavender': '0 4px 20px rgba(192, 132, 252, 0.15)',
        'lavender-lg': '0 10px 30px rgba(192, 132, 252, 0.22)',
        'gold': '0 4px 20px rgba(251, 191, 36, 0.15)',
        'gold-lg': '0 10px 30px rgba(251, 191, 36, 0.22)',
        'soft': '0 2px 10px rgba(168, 85, 247, 0.06)',
        'medium': '0 4px 20px rgba(168, 85, 247, 0.09)',
        'strong': '0 8px 30px rgba(168, 85, 247, 0.12)',
        'gentle': '0 1px 3px rgba(168, 85, 247, 0.08)',
      },

      // Typography - elegant and readable
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Merriweather', 'Georgia', 'serif'],
        'serif': ['Crimson Text', 'Georgia', 'serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // Custom spacing for better rhythm
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      // Gentle animations
      animation: {
        'gentle-float': 'gentle-float 10s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'glow-soft': 'glow-soft 4s ease-in-out infinite',
      },

      // Custom keyframes - peaceful movements
      keyframes: {
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-2px) translateX(1px)' },
          '66%': { transform: 'translateY(1px) translateX(-1px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.97)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'glow-soft': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.15)',
            transform: 'scale(1.01)'
          },
        },
      },

      // Border radius extensions
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Backdrop blur extensions
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },

      // Z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Plugin for custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        // Glass morphism utilities - softer for church
        '.glass': {
          'backdrop-filter': 'blur(12px)',
          'background': 'rgba(250, 245, 255, 0.7)',
          'border': '1px solid rgba(168, 85, 247, 0.15)',
        },
        '.glass-strong': {
          'backdrop-filter': 'blur(16px)',
          'background': 'rgba(250, 245, 255, 0.85)',
          'border': '1px solid rgba(168, 85, 247, 0.2)',
        },
        
        // Text shadow utilities - very subtle
        '.text-shadow-sm': {
          'text-shadow': '0 1px 2px rgba(45, 27, 78, 0.08)',
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(45, 27, 78, 0.12)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 8px rgba(45, 27, 78, 0.15)',
        },

        // Custom button styles - reverent and gentle
        '.btn-primary': {
          'background': 'linear-gradient(135deg, #A855F7 0%, #9333EA 50%, #7E22CE 100%)',
          'border': 'none',
          'color': 'white',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-1px)',
            'box-shadow': '0 8px 25px rgba(168, 85, 247, 0.25)',
          },
        },
        
        '.btn-lavender': {
          'background': 'linear-gradient(135deg, #E9D5FF 0%, #D8B4FE 50%, #C084FC 100%)',
          'border': 'none',
          'color': '#4A3764',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-1px)',
            'box-shadow': '0 8px 25px rgba(192, 132, 252, 0.3)',
          },
        },

        '.btn-gold': {
          'background': 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 50%, #FBBF24 100%)',
          'border': 'none',
          'color': '#78350F',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-1px)',
            'box-shadow': '0 8px 25px rgba(251, 191, 36, 0.3)',
          },
        },

        '.btn-outline-primary': {
          'background': 'transparent',
          'border': '2px solid #A855F7',
          'color': '#7E22CE',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'background': '#FAF5FF',
            'border-color': '#7E22CE',
            'color': '#6B21A8',
            'transform': 'translateY(-1px)',
          },
        },

        '.btn-outline-lavender': {
          'background': 'transparent',
          'border': '2px solid #C084FC',
          'color': '#7E22CE',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'background': '#FAF5FF',
            'border-color': '#A855F7',
            'color': '#6B21A8',
            'transform': 'translateY(-1px)',
          },
        },

        // Sacred card style
        '.card-sacred': {
          'background': 'linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 100%)',
          'border': '1px solid rgba(168, 85, 247, 0.1)',
          'border-radius': '1rem',
          'padding': '1.5rem',
          'box-shadow': '0 4px 20px rgba(168, 85, 247, 0.08)',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'box-shadow': '0 8px 30px rgba(168, 85, 247, 0.12)',
            'transform': 'translateY(-2px)',
          },
        },

        // Peaceful overlay
        '.overlay-peaceful': {
          'background': 'linear-gradient(180deg, rgba(250, 245, 255, 0.9) 0%, rgba(243, 232, 255, 0.95) 100%)',
          'backdrop-filter': 'blur(8px)',
        },
      }
      
      addUtilities(newUtilities)
    },
  ],
}