#!/bin/bash

# 🚀 Script Automático para Configurar EcoNexo en Vercel
# Este script facilita el proceso de conectar el repositorio correcto en Vercel

set -e  # Salir si hay algún error

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 Configuración Automática de EcoNexo en Vercel     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "   Asegúrate de estar en el directorio raíz del proyecto EcoNexo"
    exit 1
fi

echo -e "${GREEN}✅ Directorio correcto detectado${NC}"
echo ""

# Verificar que el repositorio Git está configurado
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: No se encontró el directorio .git${NC}"
    echo "   Este no parece ser un repositorio Git"
    exit 1
fi

echo -e "${GREEN}✅ Repositorio Git detectado${NC}"

# Verificar el repositorio remoto
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$REMOTE_URL" != *"santiagoinfantinom/EcoNexo"* ]]; then
    echo -e "${YELLOW}⚠️  Advertencia: El repositorio remoto no parece ser el correcto${NC}"
    echo "   Remoto actual: $REMOTE_URL"
    echo "   Esperado: santiagoinfantinom/EcoNexo"
    read -p "   ¿Continuar de todos modos? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Repositorio remoto correcto: $REMOTE_URL${NC}"
fi

# Verificar que el branch existe
CURRENT_BRANCH=$(git branch --show-current)
TARGET_BRANCH="2025-11-03-ol3k-5a7de"

if [ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]; then
    echo -e "${YELLOW}⚠️  Branch actual: $CURRENT_BRANCH${NC}"
    echo -e "${BLUE}   Branch objetivo: $TARGET_BRANCH${NC}"
    
    # Verificar si el branch existe
    if git show-ref --verify --quiet refs/heads/$TARGET_BRANCH; then
        echo -e "${GREEN}✅ Branch $TARGET_BRANCH existe localmente${NC}"
    elif git show-ref --verify --quiet refs/remotes/origin/$TARGET_BRANCH; then
        echo -e "${GREEN}✅ Branch $TARGET_BRANCH existe en remoto${NC}"
    else
        echo -e "${RED}❌ Error: Branch $TARGET_BRANCH no existe${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Branch correcto: $CURRENT_BRANCH${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 Verificación de Configuración${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Verificar archivos de configuración
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ vercel.json encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  vercel.json no encontrado (se creará automáticamente)${NC}"
fi

if [ -f "next.config.ts" ]; then
    echo -e "${GREEN}✅ next.config.ts encontrado${NC}"
else
    echo -e "${RED}❌ Error: next.config.ts no encontrado${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔧 Instalación de Vercel CLI${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Verificar si Vercel CLI está instalado
if command -v vercel &> /dev/null; then
    VERCEL_VERSION=$(vercel --version)
    echo -e "${GREEN}✅ Vercel CLI ya está instalado: $VERCEL_VERSION${NC}"
else
    echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
    
    # Intentar instalar localmente primero
    if npm install vercel --save-dev 2>/dev/null; then
        echo -e "${GREEN}✅ Vercel CLI instalado localmente${NC}"
        VERCEL_CMD="npx vercel"
    else
        echo -e "${YELLOW}⚠️  No se pudo instalar Vercel CLI automáticamente${NC}"
        echo "   Puedes instalarlo manualmente con: npm install -g vercel"
        echo "   O usar: npx vercel"
        VERCEL_CMD="npx vercel"
    fi
fi

# Si vercel está disponible globalmente, usarlo
if command -v vercel &> /dev/null; then
    VERCEL_CMD="vercel"
else
    VERCEL_CMD="npx vercel"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📝 Información del Proyecto${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "   ${GREEN}Repositorio:${NC} santiagoinfantinom/EcoNexo"
echo -e "   ${GREEN}Branch objetivo:${NC} $TARGET_BRANCH"
echo -e "   ${GREEN}Dominios:${NC} econexo.io, econexo.ai"
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 Próximos Pasos${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}IMPORTANTE:${NC} Este script prepara todo, pero necesitas:"
echo ""
echo "   1. ${GREEN}Ir a Vercel Dashboard:${NC}"
echo "      https://vercel.com/santiagoinfantinoms-projects/econexo"
echo ""
echo "   2. ${GREEN}Settings → Git → Disconnect${NC}"
echo "      (Desconectar el repositorio incorrecto)"
echo ""
echo "   3. ${GREEN}Connect Git Repository${NC}"
echo "      Buscar: santiagoinfantinom/EcoNexo"
echo ""
echo "   4. ${GREEN}Seleccionar Branch:${NC} $TARGET_BRANCH"
echo ""
echo "   5. ${GREEN}Configurar Variables de Entorno:${NC}"
echo "      - NEXT_PUBLIC_SITE_URL=https://econexo.io"
echo "      - NEXT_PUBLIC_PLAUSIBLE_DOMAIN=econexo.io"
echo "      - NEXT_PUBLIC_SUPABASE_URL=(tu_url)"
echo "      - NEXT_PUBLIC_SUPABASE_ANON_KEY=(tu_key)"
echo ""
echo "   6. ${GREEN}Deploy${NC}"
echo ""

# Preguntar si quiere usar Vercel CLI
read -p "¿Quieres intentar conectar usando Vercel CLI ahora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}🔐 Autenticación con Vercel${NC}"
    echo "   (Necesitarás iniciar sesión en tu navegador)"
    echo ""
    
    if $VERCEL_CMD login; then
        echo ""
        echo -e "${GREEN}✅ Autenticación exitosa${NC}"
        echo ""
        
        # Intentar linkear el proyecto
        echo -e "${BLUE}🔗 Conectando proyecto...${NC}"
        echo ""
        
        # Verificar si ya está linkeado
        if [ -f ".vercel/project.json" ]; then
            echo -e "${YELLOW}⚠️  Proyecto ya está linkeado${NC}"
            read -p "   ¿Quieres re-linkear? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                $VERCEL_CMD link --yes
            fi
        else
            $VERCEL_CMD link --yes
        fi
        
        echo ""
        echo -e "${GREEN}✅ Proyecto conectado${NC}"
        echo ""
        
        # Preguntar si quiere hacer deploy
        read -p "¿Quieres hacer deploy ahora? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo -e "${BLUE}🚀 Iniciando deploy...${NC}"
            echo ""
            $VERCEL_CMD --prod
        fi
    else
        echo -e "${RED}❌ Error en la autenticación${NC}"
        echo "   Por favor, sigue los pasos manuales descritos arriba"
    fi
else
    echo ""
    echo -e "${YELLOW}📋 Sigue los pasos manuales descritos arriba${NC}"
    echo ""
    echo -e "${BLUE}💡 Tip:${NC} Puedes ejecutar este script de nuevo cuando estés listo"
fi

echo ""
echo -e "${GREEN}✅ Script completado${NC}"
echo ""
echo -e "${BLUE}📚 Documentación adicional:${NC}"
echo "   - VERCEL_PASO_A_PASO.md (guía detallada)"
echo "   - VERCEL_FIX.md (instrucciones de fix)"
echo ""

