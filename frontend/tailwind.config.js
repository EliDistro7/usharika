/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // Respects system preference
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#f3f1ff',
          100: '#ebe5ff', 
          200: '#d9ceff',
          300: '#bea6ff',
          400: '#9f75ff',
          500: '#843dff',
          600: '#7c1aff',
          700: '#6b46c1', // Light theme color
          800: '#553c9a', // Dark theme color
          900: '#4c1d95',
          950: '#2e1065',
        },
        
        // Secondary purple shades
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c2d92',
          800: '#6b1b73',
          900: '#581c87',
          950: '#3b0764',
        },

        // Yellow accent colors
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },

        // Green accent colors
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },

        // Light backgrounds with subtle tints
        background: {
          50: '#fefefe',     // Pure white
          100: '#fdfdfd',    // Off-white
          200: '#fafafb',    // Very light gray
          300: '#f7f8fa',    // Light gray with purple hint
          400: '#f3f4f7',    // Medium light gray
          500: '#eef0f4',    // Neutral gray
        },

        // Text colors optimized for light backgrounds
        text: {
          primary: '#1f2937',    // Dark gray for main text
          secondary: '#6b7280',  // Medium gray for secondary text
          tertiary: '#9ca3af',   // Light gray for tertiary text
          accent: '#6b46c1',     // Purple for accents
          muted: '#d1d5db',      // Very light for disabled text
        },

        // Border colors for light theme
        border: {
          light: '#f3f4f6',      // Very light borders
          default: '#e5e7eb',    // Default borders
          medium: '#d1d5db',     // Medium borders
          dark: '#9ca3af',       // Darker borders
          accent: '#c084fc',     // Purple accent borders
        },

        // Success, warning, error states
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
        },
        
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },

      // Custom gradients
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #6b46c1 0%, #9333ea 50%, #a855f7 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #f97316 100%)',
        'accent-gradient': 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
        'light-gradient': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
        'hero-gradient': 'linear-gradient(135deg, #6b46c1 0%, #9333ea 25%, #a855f7 50%, #eab308 75%, #22c55e 100%)',
      },

      // Custom shadows with brand colors
      boxShadow: {
        'primary': '0 4px 20px rgba(107, 70, 193, 0.15)',
        'primary-lg': '0 10px 30px rgba(107, 70, 193, 0.2)',
        'yellow': '0 4px 20px rgba(234, 179, 8, 0.15)',
        'yellow-lg': '0 10px 30px rgba(234, 179, 8, 0.2)',
        'green': '0 4px 20px rgba(34, 197, 94, 0.15)',
        'green-lg': '0 10px 30px rgba(34, 197, 94, 0.2)',
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 30px rgba(0, 0, 0, 0.12)',
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
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Glass morphism utilities
        '.glass': {
          'backdrop-filter': 'blur(16px)',
          'background': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-strong': {
          'backdrop-filter': 'blur(24px)',
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
          'background': 'linear-gradient(135deg, #6b46c1 0%, #9333ea 50%, #a855f7 100%)',
          'border': 'none',
          'color': 'white',
          'font-weight': '600',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 25px rgba(107, 70, 193, 0.3)',
          },
        },
        
        '.btn-secondary': {
          'background': 'linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #f97316 100%)',
          'border': 'none',
          'color': 'white',
          'font-weight': '600',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 25px rgba(234, 179, 8, 0.3)',
          },
        },

        '.btn-success': {
          'background': 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
          'border': 'none',
          'color': 'white',
          'font-weight': '600',
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-2px)',
            'box-shadow': '0 8px 25px rgba(34, 197, 94, 0.3)',
          },
        },
      }
      
      addUtilities(newUtilities)
    },
  ],
}