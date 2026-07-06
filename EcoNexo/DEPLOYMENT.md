# EcoNexo - Deployment Configuration

## Vercel Deployment Steps

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import the EcoNexo repository

2. **Configure Environment Variables**
   Add these variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_PAYPAL_LINK=https://www.paypal.com/donate/?hosted_button_id=ECONEXO_DONATE_BUTTON
   NEXT_PUBLIC_STRIPE_LINK=https://stripe.com/payments/checkout
   NODE_ENV=production
   ```

3. **Deploy Settings**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Custom Domain (Optional)**
   - Add your custom domain in Vercel dashboard
   - Configure DNS records as instructed

## GitHub Repository Setup

The repository is already configured with:
- ✅ Comprehensive README.md
- ✅ Proper .gitignore
- ✅ Vercel configuration (vercel.json)
- ✅ Environment variables example (env.example)
- ✅ All features implemented and tested

## Features Ready for Production

- 🗺️ Interactive Map with European projects
- 📅 Calendar with event management
- 💼 Green Jobs section
- 💬 Community Chat with conduct rules
- 👤 User Profile with comprehensive information
- 🌍 Multi-language support (ES, EN, DE)
- 🌙 Dark mode support
- 📱 Responsive design
- 💚 PayPal donation integration

## Next Steps

1. Merge the `docs/social-features` branch to `main`
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy to production
5. Test all features in production environment
