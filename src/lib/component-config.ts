export const COMPONENT_CONFIG = {
  // Configuración de contraste mejorado
  contrast: {
    text: {
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-700 dark:text-gray-300',
      tertiary: 'text-gray-600 dark:text-gray-400',
      muted: 'text-gray-500 dark:text-gray-500'
    },
    background: {
      primary: 'bg-white dark:bg-gray-900',
      secondary: 'bg-gray-50 dark:bg-gray-800',
      tertiary: 'bg-gray-100 dark:bg-gray-700',
      card: 'bg-white dark:bg-gray-900 shadow-sm'
    },
    border: {
      light: 'border-gray-200 dark:border-gray-700',
      medium: 'border-gray-300 dark:border-gray-600',
      strong: 'border-gray-400 dark:border-gray-500'
    }
  },
  
  // Configuración de botones
  buttons: {
    primary: 'bg-green-600 text-white hover:bg-green-700 shadow-md transition-all',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all',
    outline: 'border border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
  },
  
  // Configuración de tarjetas
  cards: {
    default: 'border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all',
    elevated: 'border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900 shadow-md transition-all',
    flat: 'rounded-lg p-4 bg-gray-50 dark:bg-gray-800 transition-all'
  },
  
  // Configuración de inputs
  inputs: {
    default: 'w-full px-3 py-2 border border-gray-500 dark:border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all',
    select: 'px-3 py-2 border border-gray-400 dark:border-gray-500 rounded-md text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 capitalize shadow-sm transition-all'
  },
  
  // Configuración de etiquetas
  labels: {
    default: 'block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1',
    checkbox: 'text-sm font-medium text-gray-800 dark:text-gray-200'
  },
  
  // Configuración de títulos
  titles: {
    h1: 'text-3xl font-bold text-gray-900 dark:text-white',
    h2: 'text-xl font-semibold text-gray-900 dark:text-white',
    h3: 'text-lg font-semibold text-gray-900 dark:text-white',
    h4: 'text-base font-semibold text-gray-900 dark:text-white'
  },
  
  // Configuración de navegación
  navigation: {
    container: 'flex items-center justify-between mb-4 text-gray-900 dark:text-white',
    button: 'p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors'
  },
  
  // Configuración de calendario
  calendar: {
    weekDays: 'p-2 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800',
    dayCell: 'min-h-[80px] p-1 border border-gray-300 dark:border-gray-600',
    dayCellActive: 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700',
    dayCellInactive: 'bg-gray-100 dark:bg-gray-800',
    dayNumber: 'text-sm font-semibold text-gray-900 dark:text-gray-100',
    dayNumberToday: 'text-green-700 dark:text-green-300',
    eventText: 'text-xs text-gray-800 dark:text-gray-200'
  },
  
  // Configuración de filtros
  filters: {
    panel: 'bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
  },
  
  // Configuración de eventos
  events: {
    card: 'border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-all',
    title: 'font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors',
    location: 'text-sm text-gray-700 dark:text-gray-300',
    details: 'flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400',
    actions: 'flex gap-2'
  },
  
  // Configuración de estados vacíos
  empty: {
    container: 'text-center py-8 text-gray-800 dark:text-gray-200',
    icon: 'text-lg mb-2'
  }
} as const;

// Tipos para TypeScript
export type ContrastLevel = 'primary' | 'secondary' | 'tertiary' | 'muted';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type CardVariant = 'default' | 'elevated' | 'flat';
export type InputVariant = 'default' | 'select';
export type TitleLevel = 'h1' | 'h2' | 'h3' | 'h4';
