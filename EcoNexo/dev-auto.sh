#!/bin/bash

# EcoNexo Complete Development Automation Script
# Este script automatiza completamente el proceso de desarrollo

echo "🚀 EcoNexo Complete Development Automation"
echo "=========================================="

# Función para mostrar el estado actual
show_status() {
    echo ""
    echo "📊 Estado actual del proyecto:"
    echo "=============================="
    
    # Verificar si el servidor está corriendo
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Servidor de desarrollo: FUNCIONANDO"
        echo "🌐 URL: http://localhost:3000"
    else
        echo "❌ Servidor de desarrollo: NO FUNCIONANDO"
    fi
    
    # Verificar archivos importantes
    if [ -f "src/lib/i18n.ts" ]; then
        echo "✅ Archivo i18n.ts: EXISTE"
    else
        echo "❌ Archivo i18n.ts: NO EXISTE"
    fi
    
    if [ -f "src/components/ErrorBoundary.tsx" ]; then
        echo "✅ ErrorBoundary: EXISTE"
    else
        echo "❌ ErrorBoundary: NO EXISTE"
    fi
    
    echo ""
}

# Función para limpiar y reiniciar
clean_restart() {
    echo "🧹 Limpiando y reiniciando servidor..."
    
    # Matar procesos existentes
    pkill -f "next dev" 2>/dev/null || true
    
    # Limpiar cache
    rm -rf .next 2>/dev/null || true
    
    # Reiniciar servidor
    echo "🚀 Iniciando servidor de desarrollo..."
    npm run dev &
    
    # Esperar a que el servidor esté listo
    echo "⏳ Esperando a que el servidor esté listo..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Servidor listo en http://localhost:3000"
            return 0
        fi
        sleep 1
        echo -n "."
    done
    
    echo ""
    echo "❌ El servidor no se inició correctamente"
    return 1
}

# Función para verificar traducciones
check_translations() {
    echo "🔍 Verificando traducciones..."
    
    if [ -f "smart-fix-translations-v2.sh" ]; then
        echo "✅ Script de traducciones: EXISTE"
        
        # Ejecutar verificación
        ./smart-fix-translations-v2.sh 2>/dev/null | grep -q "claves faltantes"
        if [ $? -eq 0 ]; then
            echo "⚠️  Hay claves de traducción faltantes"
            echo "💡 Ejecuta: ./smart-fix-translations-v2.sh --apply"
        else
            echo "✅ Todas las traducciones están completas"
        fi
    else
        echo "❌ Script de traducciones: NO EXISTE"
    fi
}

# Función para mostrar ayuda
show_help() {
    echo ""
    echo "📖 Comandos disponibles:"
    echo "========================"
    echo "  $0 status     - Mostrar estado actual"
    echo "  $0 restart    - Limpiar y reiniciar servidor"
    echo "  $0 fix         - Arreglar traducciones automáticamente"
    echo "  $0 dev         - Iniciar desarrollo completo"
    echo "  $0 help        - Mostrar esta ayuda"
    echo ""
    echo "🔧 Scripts adicionales:"
    echo "======================"
    echo "  ./dev-debug.sh                    - Debug rápido del servidor"
    echo "  ./smart-fix-translations-v2.sh    - Arreglar traducciones"
    echo "  ./smart-fix-translations-v2.sh --apply  - Aplicar traducciones"
    echo ""
}

# Función principal de desarrollo
dev_mode() {
    echo "🚀 Modo desarrollo completo activado"
    echo "====================================="
    
    # Verificar estado
    show_status
    
    # Arreglar traducciones si es necesario
    if [ -f "smart-fix-translations-v2.sh" ]; then
        echo ""
        echo "🔧 Verificando traducciones..."
        ./smart-fix-translations-v2.sh 2>/dev/null | grep -q "claves faltantes"
        if [ $? -eq 0 ]; then
            echo "⚠️  Detectadas claves faltantes. ¿Arreglar automáticamente? (y/n)"
            read -r response
            if [[ "$response" =~ ^[Yy]$ ]]; then
                ./smart-fix-translations-v2.sh --apply
            fi
        fi
    fi
    
    # Limpiar y reiniciar
    clean_restart
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 ¡Desarrollo listo!"
        echo "==================="
        echo "🌐 Aplicación: http://localhost:3000"
        echo "📱 Perfil: http://localhost:3000/perfil/"
        echo "🎯 Eventos: http://localhost:3000/eventos/"
        echo "💼 Trabajos: http://localhost:3000/trabajos/"
        echo ""
        echo "💡 Consejos:"
        echo "  - Usa Ctrl+C para detener el servidor"
        echo "  - Ejecuta '$0 status' para verificar el estado"
        echo "  - Ejecuta '$0 fix' para arreglar traducciones"
    fi
}

# Función para arreglar traducciones
fix_translations() {
    echo "🔧 Arreglando traducciones automáticamente..."
    
    if [ -f "smart-fix-translations-v2.sh" ]; then
        ./smart-fix-translations-v2.sh --apply
    else
        echo "❌ Script de traducciones no encontrado"
        echo "💡 Asegúrate de que smart-fix-translations-v2.sh existe"
    fi
}

# Función principal
main() {
    case "${1:-help}" in
        "status")
            show_status
            ;;
        "restart")
            clean_restart
            ;;
        "fix")
            fix_translations
            ;;
        "dev")
            dev_mode
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@"
