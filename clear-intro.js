// Script para limpiar localStorage y forzar la introducción
console.log('🧹 Limpiando localStorage...');

// Limpiar todas las claves relacionadas con la introducción
localStorage.removeItem('econexo-intro-shown');
localStorage.removeItem('econexo-language-set');
localStorage.removeItem('econexo-preferred-language');
localStorage.removeItem('econexo:locale');

console.log('✅ localStorage limpiado');
console.log('🔄 Recargando página...');

// Recargar la página
window.location.reload();