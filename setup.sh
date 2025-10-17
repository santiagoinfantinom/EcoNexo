#!/bin/bash

# EcoNexo Configuration Script
echo "🌿 EcoNexo Configuration Script"
echo "================================"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Supabase Configuration (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# PayPal Donation Link (Optional)
NEXT_PUBLIC_PAYPAL_LINK=https://www.paypal.com/donate/?hosted_button_id=ECONEXO_DONATE_BUTTON

# Stripe Payment Link (Optional)
NEXT_PUBLIC_STRIPE_LINK=https://stripe.com/payments/checkout

# Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=econexo.org

# Web Push VAPID Keys (Generated automatically)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJ4aHEURctJPKN4V_QOu2VhV1ulM_vANCGmhu4bFA7bel_ER47tDRZvZmUFaRp7FFMIvOE5_Z04Nj9IwatXke7w
VAPID_PRIVATE_KEY=ABKy3hy-NXjx2dXA1BSm85VM6tTc88zGCJmlAB_FKtk

# Site URL for sitemap and OG tags
NEXT_PUBLIC_SITE_URL=https://econexo.org

# Environment
NODE_ENV=development
EOF
    echo "✅ .env.local created successfully!"
else
    echo "⚠️  .env.local already exists. Please update it manually."
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Go to https://plausible.io and create a free account"
echo "2. Add your domain (econexo.org) to Plausible"
echo "3. Update NEXT_PUBLIC_PLAUSIBLE_DOMAIN in .env.local if needed"
echo "4. Configure Supabase if you want user authentication"
echo "5. Run 'npm run dev' to start the development server"
echo ""
echo "📊 Analytics Events Configured:"
echo "  - save_item: Track when users save/unsave projects/events"
echo "  - register_event: Track event registrations"
echo "  - language_change: Track language switches"
echo "  - map_filter: Track map filter usage"
echo ""
echo "🔔 Web Push Configured:"
echo "  - VAPID keys generated and ready"
echo "  - Users can subscribe to notifications"
echo "  - Remember to configure push server for sending notifications"
