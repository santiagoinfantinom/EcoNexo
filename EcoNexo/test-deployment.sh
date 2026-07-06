#!/bin/bash

# 🧪 EcoNexo Testing Script
echo "🧪 Iniciando Testing Completo de EcoNexo..."
echo "=============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Función para mostrar warnings
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo -e "${BLUE}📋 1. Testing de Build de Producción${NC}"
echo "----------------------------------------"

# Test 1: Build de producción
echo "🔨 Ejecutando build de producción..."
npm run build > build.log 2>&1
BUILD_EXIT_CODE=$?
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    show_result 0 "Build de producción exitoso"
    echo "📊 Tamaño del bundle:"
    du -sh out/ 2>/dev/null || echo "Directorio out/ no encontrado"
else
    show_result 1 "Build de producción falló"
    echo "📄 Últimas líneas del log:"
    tail -20 build.log
fi

echo ""
echo -e "${BLUE}📱 2. Testing de Build Móvil${NC}"
echo "--------------------------------"

# Test 2: Build móvil
echo "📱 Ejecutando build móvil..."
npm run mobile:build > mobile-build.log 2>&1
MOBILE_BUILD_EXIT_CODE=$?
if [ $MOBILE_BUILD_EXIT_CODE -eq 0 ]; then
    show_result 0 "Build móvil exitoso"
    
    # Test 3: Sync de Capacitor
    echo "🔄 Sincronizando con Capacitor..."
    npm run mobile:sync > mobile-sync.log 2>&1
    SYNC_EXIT_CODE=$?
    if [ $SYNC_EXIT_CODE -eq 0 ]; then
        show_result 0 "Sync de Capacitor exitoso"
    else
        show_result 1 "Sync de Capacitor falló"
        echo "📄 Log de sync:"
        tail -10 mobile-sync.log
    fi
else
    show_result 1 "Build móvil falló"
    echo "📄 Log de build móvil:"
    tail -20 mobile-build.log
fi

echo ""
echo -e "${BLUE}🌐 3. Testing de APIs${NC}"
echo "------------------------"

# Test 4: APIs funcionando
echo "🔌 Probando APIs..."

# Test API de proyectos
PROJECTS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/projects 2>/dev/null || echo "000")
if [ "$PROJECTS_RESPONSE" = "200" ]; then
    show_result 0 "API de proyectos responde correctamente"
else
    show_warning "API de proyectos no disponible (código: $PROJECTS_RESPONSE)"
fi

# Test API de eventos
EVENTS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/events 2>/dev/null || echo "000")
if [ "$EVENTS_RESPONSE" = "200" ]; then
    show_result 0 "API de eventos responde correctamente"
else
    show_warning "API de eventos no disponible (código: $EVENTS_RESPONSE)"
fi

echo ""
echo -e "${BLUE}📁 4. Testing de Archivos Críticos${NC}"
echo "------------------------------------"

# Test 5: Archivos críticos existen
CRITICAL_FILES=(
    "package.json"
    "next.config.ts"
    "capacitor.config.ts"
    "public/manifest.json"
    "public/sw.js"
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/components/MobileFeatures.tsx"
    "src/components/ServiceWorkerRegistration.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        show_result 0 "Archivo $file existe"
    else
        show_result 1 "Archivo $file NO existe"
    fi
done

echo ""
echo -e "${BLUE}📦 5. Testing de Dependencias${NC}"
echo "--------------------------------"

# Test 6: Dependencias instaladas
echo "📦 Verificando dependencias críticas..."

CRITICAL_DEPS=(
    "@capacitor/core"
    "@capacitor/android"
    "@capacitor/ios"
    "@capacitor/camera"
    "@capacitor/geolocation"
    "@capacitor/push-notifications"
    "next"
    "react"
    "leaflet"
)

for dep in "${CRITICAL_DEPS[@]}"; do
    if npm list "$dep" > /dev/null 2>&1; then
        show_result 0 "Dependencia $dep instalada"
    else
        show_result 1 "Dependencia $dep NO instalada"
    fi
done

echo ""
echo -e "${BLUE}🔧 6. Testing de Configuración${NC}"
echo "--------------------------------"

# Test 7: Configuración válida
echo "⚙️ Verificando configuraciones..."

# Verificar next.config.ts
if grep -q "output: 'export'" next.config.ts; then
    show_result 0 "Next.js configurado para exportación estática"
else
    show_result 1 "Next.js NO configurado para exportación estática"
fi

# Verificar capacitor.config.ts
if grep -q "webDir: 'out'" capacitor.config.ts; then
    show_result 0 "Capacitor configurado correctamente"
else
    show_result 1 "Capacitor NO configurado correctamente"
fi

# Verificar manifest.json
if [ -f "public/manifest.json" ] && grep -q "EcoNexo" public/manifest.json; then
    show_result 0 "Manifest PWA configurado"
else
    show_result 1 "Manifest PWA NO configurado"
fi

echo ""
echo -e "${BLUE}📊 7. Resumen de Testing${NC}"
echo "=============================="

# Contar errores críticos
CRITICAL_ERRORS=0

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    ((CRITICAL_ERRORS++))
fi

if [ $MOBILE_BUILD_EXIT_CODE -ne 0 ]; then
    ((CRITICAL_ERRORS++))
fi

# Verificar archivos críticos faltantes
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        ((CRITICAL_ERRORS++))
    fi
done

echo "📈 Resultados:"
echo "  - Build de producción: $([ $BUILD_EXIT_CODE -eq 0 ] && echo "✅ OK" || echo "❌ FALLO")"
echo "  - Build móvil: $([ $MOBILE_BUILD_EXIT_CODE -eq 0 ] && echo "✅ OK" || echo "❌ FALLO")"
echo "  - Sync Capacitor: $([ $SYNC_EXIT_CODE -eq 0 ] && echo "✅ OK" || echo "❌ FALLO")"
echo "  - APIs: $([ "$PROJECTS_RESPONSE" = "200" ] && echo "✅ OK" || echo "⚠️ WARNING")"
echo "  - Archivos críticos: $([ $CRITICAL_ERRORS -eq 0 ] && echo "✅ OK" || echo "❌ FALLO")"

echo ""
if [ $CRITICAL_ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡EcoNexo está listo para deployment!${NC}"
    echo ""
    echo "📋 Próximos pasos:"
    echo "  1. Probar en dispositivo móvil real"
    echo "  2. Configurar variables de entorno de producción"
    echo "  3. Deploy a Vercel/Netlify"
    echo "  4. Subir APK a Google Play Store"
    echo "  5. Subir IPA a Apple App Store (cuando Xcode esté disponible)"
else
    echo -e "${RED}⚠️  Hay $CRITICAL_ERRORS errores críticos que deben resolverse antes del deployment${NC}"
    echo ""
    echo "🔧 Acciones recomendadas:"
    echo "  1. Revisar logs de build"
    echo "  2. Verificar archivos faltantes"
    echo "  3. Reinstalar dependencias si es necesario"
    echo "  4. Ejecutar 'npm run lint' para ver errores de código"
fi

echo ""
echo -e "${BLUE}📄 Archivos de log generados:${NC}"
echo "  - build.log"
echo "  - mobile-build.log"
echo "  - mobile-sync.log"

echo ""
echo "🧪 Testing completado - $(date)"
