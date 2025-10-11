#!/bin/bash

# 🚀 EcoNexo - Script de Deploy Automático
echo "🚀 Iniciando Deploy Automático de EcoNexo"
echo "=========================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📋 1. Verificando estado del repositorio${NC}"
git status

echo -e "${BLUE}📦 2. Añadiendo cambios${NC}"
git add .

echo -e "${BLUE}💾 3. Creando commit${NC}"
git commit -m "🚀 Deploy automático - $(date '+%Y-%m-%d %H:%M:%S')"

echo -e "${BLUE}📤 4. Subiendo a GitHub${NC}"
git push origin Jugando-con-las-esteticas

echo -e "${BLUE}🌐 5. Deploying a Vercel${NC}"
npx vercel --prod

echo -e "${GREEN}✅ Deploy completado exitosamente!${NC}"
echo ""
echo "🌐 URLs de EcoNexo:"
echo "  - Web: https://eco-nexo-68vbhh7ev-santiagoinfantinoms-projects.vercel.app"
echo "  - GitHub: https://github.com/santiagoinfantinom/EcoNexo"
echo ""
echo "📱 Próximos pasos:"
echo "  1. Probar la app web en producción"
echo "  2. Generar APK para Android"
echo "  3. Configurar dominio personalizado"
echo "  4. Lanzar en tiendas de apps"
echo ""
echo "🎉 ¡EcoNexo está vivo en producción! 🌍🌱"
