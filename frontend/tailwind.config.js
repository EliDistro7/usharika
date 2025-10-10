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
        // Primary brand colors - Soft Teal/Cyan
        primary: {
          50: '#E8F6FC',
          100: '#D1EDF9',
          200: '#A3DBF3',
          300: '#75C9ED',
          400: '#5DADE2',
          500: '#3B8BC7',
          600: '#2E7AB5',
          700: '#25648F',
          800: '#1F5A85',
          900: '#1A4A6D',
          950: '#0F2A3D',
        },
        
        // Secondary - Warm Orange/Amber
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FFB84D',
          500: '#F59E0B',
          600: '#EF8E00',
          700: '#D97706',
          800: '#B45309',
          900: '#92400E',
          950: '#78350F',
        },

        // Soft Blue accents
        blue: {
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

        // Green accent colors - softer than before
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },

        // Light backgrounds with blue tint
        background: {
          50: '#FFFFFF',     // Pure white
          100: '#F8FCFE',    // Very light blue tint
          200: '#F0F8FC',    // Light blue-gray
          300: '#E8F4F8',    // Soft blue
          400: '#D4E9F2',    // Medium blue-gray
          500: '#C0DEE8',    // Deeper blue-gray
        },

        // Text colors optimized for teal theme
        text: {
          primary: '#1E3A5F',    // Dark blue-gray for main text
          secondary: '#4A6B85',  // Medium blue-gray for secondary text
          tertiary: '#7A93A8',   // Light blue-gray for tertiary text
          accent: '#2E7AB5',     // Teal for accents
          muted: '#B8C9D6',      // Very light for disabled text
        },

        // Border colors for light theme
        border: {
          light: '#E8F4F8',      // Very light borders
          default: '#D4E9F2',    // Default borders
          medium: '#B8C9D6',     // Medium borders
          dark: '#7A93A8',       // Darker borders
          accent: '#5DADE2',     // Teal accent borders
        },

        // Success, warning, error states
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        
        warning: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#F59E0B',
          600: '#EF8E00',
          700: '#D97706',
        },
        
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },

      // Custom gradients
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #3B8BC7 0%, #2E7AB5 50%, #5DADE2 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #FFB84D 0%, #F59E0B 50%, #EF8E00 100%)',
        'accent-gradient': 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)',
        'light-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #F0F8FC 50%, #E8F4F8 100%)',
        'hero-gradient': 'linear-gradient(135deg, #3B8BC7 0%, #5DADE2 25%, #FFB84D 75%, #F59E0B 100%)',
        'soft-blue': 'linear-gradient(180deg, #E8F6FC 0%, #F0F8FC 100%)',
      },

      // Custom shadows with brand colors
      boxShadow: {
        'primary': '0 4px 20px rgba(59, 139, 199, 0.15)',
        'primary-lg': '0 10px 30px rgba(59, 139, 199, 0.25)',
        'orange': '0 4px 20px rgba(245, 158, 11, 0.2)',
        'orange-lg': '0 10px 30px rgba(245, 158, 11, 0.3)',
        'green': '0 4px 20px rgba(34, 197, 94, 0.15)',
        'green-lg': '0 10px 30px rgba(34, 197, 94, 0.25)',
        'soft': '0 2px 10px rgba(59, 139, 199, 0.08)',
        'medium': '0 4px 20px rgba(59, 139, 199, 0.12)',
        'strong': '0 8px 30px rgba(59, 139, 199, 0.18)',
        'soft-sm': '0 1px 3px rgba(0, 0, 0, 0.05)',
      },

      // Typography
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
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

      // Animation extensions
      animation: {
        'gentle-float': 'gentle-float 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },

      // Custom keyframes
      keyframes: {
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-3px) translateX(2px)' },
          '66%': { transform: 'translateY(2px) translateX(-2px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
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
        // Glass morphism utilities
        '.glass': {
          'backdrop-filter': 'blur(10px)',
          'background': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-strong': {
          'backdrop-filter': 'blur(16px)',
          'background': 'rgba(255, 255, 255, 0.15)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
        },
        
        // Text shadow utilities
        '.text-shadow-sm': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 8px rgba(0, 0, 0, 0.3)',
        },

        // Custom button styles
        '.btn-primary': {
          'background': 'linear-gradient(135deg, #3B8BC7 0%, #2E7AB5 50%, #5DADE2 100%)',
          'border': 'none',
          'color': 'white',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 25px rgba(59, 139, 199, 0.3)',
          },
        },
        
        '.btn-secondary': {
          'background': 'linear-gradient(135deg, #FFB84D 0%, #F59E0B 50%, #EF8E00 100%)',
          'border': 'none',
          'color': 'white',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 25px rgba(245, 158, 11, 0.35)',
          },
        },

        '.btn-success': {
          'background': 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)',
          'border': 'none',
          'color': 'white',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 25px rgba(34, 197, 94, 0.3)',
          },
        },

        '.btn-outline-primary': {
          'background': 'transparent',
          'border': '2px solid #3B8BC7',
          'color': '#2E7AB5',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'background': '#3B8BC7',
            'color': 'white',
            'transform': 'translateY(-2px)',
          },
        },

        '.btn-outline-secondary': {
          'background': 'transparent',
          'border': '2px solid #F59E0B',
          'color': '#EF8E00',
          'font-weight': '600',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'background': '#F59E0B',
            'color': 'white',
            'transform': 'translateY(-2px)',
          },
        },
      }
      
      addUtilities(newUtilities)
    },
  ],
}