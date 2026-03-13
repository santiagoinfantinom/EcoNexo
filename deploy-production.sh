#!/bin/bash

# EcoNexo Production Deployment Script
echo "🚀 EcoNexo Production Deployment"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment Checklist:${NC}"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local not found. Creating from template...${NC}"
    cp env.example .env.local
    echo -e "${GREEN}✅ Created .env.local from template${NC}"
else
    echo -e "${GREEN}✅ .env.local exists${NC}"
fi

# Check if build directory exists
if [ -d ".next" ]; then
    echo -e "${GREEN}✅ Build directory exists${NC}"
else
    echo -e "${YELLOW}⚠️  Building project...${NC}"
    npm run build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build completed successfully${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}🔧 Production Configuration:${NC}"

# Check environment variables
echo "Checking environment variables..."
if grep -q "your_supabase_url_here" .env.local; then
    echo -e "${YELLOW}⚠️  Supabase URL needs to be configured${NC}"
else
    echo -e "${GREEN}✅ Supabase URL configured${NC}"
fi

if grep -q "your_supabase_anon_key_here" .env.local; then
    echo -e "${YELLOW}⚠️  Supabase key needs to be configured${NC}"
else
    echo -e "${GREEN}✅ Supabase key configured${NC}"
fi

if grep -q "NEXT_PUBLIC_SITE_URL" .env.local; then
    echo -e "${GREEN}✅ Site URL configured${NC}"
else
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_SITE_URL needs to be configured in .env.local (e.g. your Vercel URL)${NC}"
fi

echo ""
echo -e "${BLUE}📦 Deployment Options:${NC}"
echo ""
echo "1. Vercel (Recommended)"
echo "   - Automatic deployments from GitHub"
echo "   - Built-in analytics and monitoring"
echo "   - Easy environment variable management"
echo ""
echo "2. GitHub Pages"
echo "   - Free static hosting"
echo "   - Custom domain support"
echo "   - Automatic builds from main branch"
echo ""
echo "3. Netlify"
echo "   - Easy deployment from Git"
echo "   - Form handling and serverless functions"
echo "   - Built-in CDN"
echo ""

echo -e "${BLUE}🚀 Quick Deploy Commands:${NC}"
echo ""
echo "For Vercel:"
echo "  npx vercel --prod"
echo ""
echo "For GitHub Pages:"
echo "  npm run build && npm run export"
echo "  # Then push to gh-pages branch"
echo ""
echo "For Netlify:"
echo "  npx netlify deploy --prod --dir=out"
echo ""

echo -e "${BLUE}📋 Post-deployment Checklist:${NC}"
echo ""
echo "□ Update NEXT_PUBLIC_SITE_URL to production domain"
echo "□ Configure Plausible Analytics for production domain"
echo "□ Set up Supabase production database"
echo "□ Configure Web Push VAPID keys for production"
echo "□ Test all functionality on production"
echo "□ Set up monitoring and error tracking"
echo "□ Configure custom domain (if needed)"
echo "□ Set up SSL certificate"
echo ""

echo -e "${GREEN}✅ Ready for deployment!${NC}"
echo ""
echo "Choose your deployment method and follow the instructions above."
