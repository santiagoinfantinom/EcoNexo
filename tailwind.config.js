/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colores de contraste mejorados
        'contrast': {
          'text-primary': '#111827',
          'text-secondary': '#374151',
          'text-tertiary': '#6b7280',
          'text-muted': '#9ca3af',
          'bg-primary': '#ffffff',
          'bg-secondary': '#f9fafb',
          'bg-tertiary': '#f3f4f6',
          'bg-quaternary': '#e5e7eb',
        },
        'dark-contrast': {
          'text-primary': '#f9fafb',
          'text-secondary': '#d1d5db',
          'text-tertiary': '#9ca3af',
          'text-muted': '#6b7280',
          'bg-primary': '#111827',
          'bg-secondary': '#1f2937',
          'bg-tertiary': '#374151',
          'bg-quaternary': '#4b5563',
        },
        // Colores de estado mejorados
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',
      },
      boxShadow: {
        'contrast-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'contrast-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'contrast-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
    },
  },
  plugins: [
    // Plugin para utilidades de contraste
    function({ addUtilities }) {
      const newUtilities = {
        '.text-contrast-high': {
          color: 'var(--text-primary)',
        },
        '.dark .text-contrast-high': {
          color: 'var(--dark-text-primary)',
        },
        '.text-contrast-medium': {
          color: 'var(--text-secondary)',
        },
        '.dark .text-contrast-medium': {
          color: 'var(--dark-text-secondary)',
        },
        '.text-contrast-low': {
          color: 'var(--text-tertiary)',
        },
        '.dark .text-contrast-low': {
          color: 'var(--dark-text-tertiary)',
        },
        '.bg-contrast-primary': {
          backgroundColor: 'var(--bg-primary)',
        },
        '.dark .bg-contrast-primary': {
          backgroundColor: 'var(--dark-bg-primary)',
        },
        '.bg-contrast-secondary': {
          backgroundColor: 'var(--bg-secondary)',
        },
        '.dark .bg-contrast-secondary': {
          backgroundColor: 'var(--dark-bg-secondary)',
        },
        '.border-contrast-medium': {
          borderColor: 'var(--border-medium)',
        },
        '.dark .border-contrast-medium': {
          borderColor: 'var(--border-strong)',
        },
        '.transition-smooth': {
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
