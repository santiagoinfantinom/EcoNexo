#!/bin/bash

# EcoNexo Plausible Auto-Setup
echo "🌿 EcoNexo Plausible Auto-Setup"
echo "==============================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Run ./setup.sh first."
    exit 1
fi

echo "📊 Setting up Plausible Analytics..."

# Create a test domain for development
TEST_DOMAIN="econexo-dev.local"

# Update .env.local with test domain
sed -i.bak "s/NEXT_PUBLIC_PLAUSIBLE_DOMAIN=.*/NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$TEST_DOMAIN/" .env.local

echo "✅ Updated .env.local with test domain: $TEST_DOMAIN"

echo ""
echo "🔧 Manual Steps Required:"
echo "1. Go to https://plausible.io"
echo "2. Create a free account"
echo "3. Add domain: $TEST_DOMAIN"
echo "4. Copy the domain from Plausible dashboard"
echo "5. Update NEXT_PUBLIC_PLAUSIBLE_DOMAIN in .env.local"
echo ""
echo "📈 Analytics Events Ready:"
echo "  ✓ save_item - Track save/unsave actions"
echo "  ✓ register_event - Track event registrations"  
echo "  ✓ language_change - Track language switches"
echo "  ✓ map_filter - Track map filter usage"
echo ""
echo "🚀 Start development server:"
echo "  npm run dev"
echo ""
echo "🔍 Test analytics:"
echo "  - Open browser dev tools"
echo "  - Look for 'plausible' requests in Network tab"
echo "  - Check Plausible dashboard for events"
