# Supabase Configuration for EcoNexo OAuth

## Project Setup
1. Create a new Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Configure OAuth providers in Authentication > Providers

## Google OAuth Setup
1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized JavaScript origins: https://econexo-nhxz8185i-santiagoinfantinoms-projects.vercel.app
   - Authorized redirect URIs: https://your-project.supabase.co/auth/v1/callback
5. Copy Client ID and Client Secret to Supabase

## Microsoft OAuth Setup
1. Go to Azure Portal (https://portal.azure.com)
2. Register a new application
3. Set redirect URI: https://your-project.supabase.co/auth/v1/callback
4. Create client secret
5. Copy Application ID and Client Secret to Supabase

## Environment Variables
Add to Vercel environment variables:
- NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
- SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

## Database Schema
Create profiles table to store user data:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
