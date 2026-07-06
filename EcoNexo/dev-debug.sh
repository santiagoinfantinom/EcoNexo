#!/bin/bash

# EcoNexo Development Debug Script
# This script helps quickly restart the development server with proper cleanup

echo "🔧 EcoNexo Development Debug Helper"
echo "=================================="

# Kill any existing Next.js processes
echo "🛑 Killing existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || echo "No existing processes found"

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next 2>/dev/null || echo "No .next directory found"

# Clear node_modules cache if needed (optional)
# echo "🧹 Clearing node_modules cache..."
# rm -rf node_modules/.cache 2>/dev/null || echo "No cache found"

echo "🚀 Starting development server with verbose logging..."
echo "=================================================="

# Start the development server with error output
cd /Users/santiago/Documents/Projects/EcoNexo && npm run dev 2>&1 | head -50

echo ""
echo "✅ Development server started!"
echo "📱 Open http://localhost:3000 in your browser"
echo "🔍 Check the terminal above for any errors"
echo ""
echo "💡 Tips:"
echo "   - If you see errors, check the console output above"
echo "   - Press Ctrl+C to stop the server"
echo "   - Run this script again to restart with clean cache"
