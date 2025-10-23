# EcoNexo OAuth Configuration

## Temporary Supabase Configuration
For immediate OAuth functionality, I'll create a temporary Supabase project configuration.

## Google OAuth Setup Instructions
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "EcoNexo OAuth"
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Name: EcoNexo
   - Authorized JavaScript origins: 
     - https://econexo-nhxz8185i-santiagoinfantinoms-projects.vercel.app
     - https://econexo-platform.vercel.app
   - Authorized redirect URIs:
     - https://your-project.supabase.co/auth/v1/callback
5. Copy Client ID and Client Secret

## Microsoft OAuth Setup Instructions
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application:
   - Name: EcoNexo
   - Supported account types: Accounts in any organizational directory and personal Microsoft accounts
   - Redirect URI: https://your-project.supabase.co/auth/v1/callback
3. Create client secret
4. Copy Application ID and Client Secret

## Supabase Project Setup
1. Create new project at [Supabase](https://supabase.com)
2. Go to Authentication > Providers
3. Enable Google and Microsoft providers
4. Add the Client IDs and Secrets from above
5. Set Site URL to: https://econexo-nhxz8185i-santiagoinfantinoms-projects.vercel.app

## Environment Variables for Vercel
Add these to Vercel environment variables:
- NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
- SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

## Database Schema
The profiles table will automatically store OAuth data including:
- Full name, email, avatar
- Google-specific data (verified email, locale, etc.)
- Microsoft-specific data (tenant ID, UPN, etc.)
- Additional metadata for data import
