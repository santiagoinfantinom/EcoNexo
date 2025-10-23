import { COMPONENT_CONFIG, ContrastLevel, ButtonVariant, CardVariant, InputVariant, TitleLevel } from '@/lib/component-config';

export function useGlobalConfig() {
  // Función para obtener clases de contraste
  const getContrastClasses = (element: 'text' | 'background' | 'border', level: ContrastLevel) => {
    return COMPONENT_CONFIG.contrast[element][level];
  };
  
  // Función para obtener clases de botones
  const getButtonClasses = (variant: ButtonVariant) => {
    return COMPONENT_CONFIG.buttons[variant];
  };
  
  // Función para obtener clases de tarjetas
  const getCardClasses = (variant: CardVariant) => {
    return COMPONENT_CONFIG.cards[variant];
  };
  
  // Función para obtener clases de inputs
  const getInputClasses = (variant: InputVariant) => {
    return COMPONENT_CONFIG.inputs[variant];
  };
  
  // Función para obtener clases de etiquetas
  const getLabelClasses = (variant: 'default' | 'checkbox' = 'default') => {
    return COMPONENT_CONFIG.labels[variant];
  };
  
  // Función para obtener clases de títulos
  const getTitleClasses = (level: TitleLevel) => {
    return COMPONENT_CONFIG.titles[level];
  };
  
  // Función para obtener clases de navegación
  const getNavigationClasses = (element: 'container' | 'button') => {
    return COMPONENT_CONFIG.navigation[element];
  };
  
  // Función para obtener clases de calendario
  const getCalendarClasses = (element: keyof typeof COMPONENT_CONFIG.calendar) => {
    return COMPONENT_CONFIG.calendar[element];
  };
  
  // Función para obtener clases de filtros
  const getFilterClasses = (element: 'panel' | 'grid') => {
    return COMPONENT_CONFIG.filters[element];
  };
  
  // Función para obtener clases de eventos
  const getEventClasses = (element: keyof typeof COMPONENT_CONFIG.events) => {
    return COMPONENT_CONFIG.events[element];
  };
  
  // Función para obtener clases de estados vacíos
  const getEmptyClasses = (element: 'container' | 'icon') => {
    return COMPONENT_CONFIG.empty[element];
  };
  
  // Función para combinar clases con clases personalizadas
  const combineClasses = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
  };
  
  return {
    // Funciones individuales
    getContrastClasses,
    getButtonClasses,
    getCardClasses,
    getInputClasses,
    getLabelClasses,
    getTitleClasses,
    getNavigationClasses,
    getCalendarClasses,
    getFilterClasses,
    getEventClasses,
    getEmptyClasses,
    combineClasses,
    
    // Configuración completa para casos avanzados
    config: COMPONENT_CONFIG,
    
    // Funciones de conveniencia para casos comunes
    getTextPrimary: () => getContrastClasses('text', 'primary'),
    getTextSecondary: () => getContrastClasses('text', 'secondary'),
    getTextTertiary: () => getContrastClasses('text', 'tertiary'),
    getBgPrimary: () => getContrastClasses('background', 'primary'),
    getBgSecondary: () => getContrastClasses('background', 'secondary'),
    getBorderMedium: () => getContrastClasses('border', 'medium'),
    getBorderStrong: () => getContrastClasses('border', 'strong'),
  };
}
