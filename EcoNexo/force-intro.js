// Script para forzar mostrar el intro
console.log('🔧 Forzando intro a aparecer...');

// Limpiar localStorage
localStorage.removeItem('econexo-intro-shown');
localStorage.removeItem('econexo:locale');
localStorage.removeItem('econexo-language-set');
localStorage.removeItem('econexo-preferred-language');

console.log('✅ localStorage limpiado');

// Recargar página
location.reload();
