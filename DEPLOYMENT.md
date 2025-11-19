# Deployment Guide

## Prerequisites
- **GitHub Account**: To host the code.
- **Vercel Account**: To deploy the frontend.
- **Supabase Account**: To host the database.

## 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in the Supabase dashboard.
3. Copy the contents of `supabase-migration.sql` from this repository.
4. Paste it into the SQL Editor and run it. This will create the necessary tables (`tduel_trading_sessions`, `tduel_trades`, etc.) and policies.

## 2. Environment Variables
You need the following environment variables from your Supabase project settings:
- `NEXT_PUBLIC_SUPABASE_URL`: Your project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your project's anonymous API key.

## 3. Deploy to Vercel
1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click "Add New Project".
3. Import your GitHub repository.
4. In the **Environment Variables** section, add the Supabase variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

## 4. Verify Deployment
1. Open your deployed Vercel URL.
2. Check if the landing page loads correctly.
3. Click "Start Trading" and verify that a session starts.
4. Execute a trade and check your Supabase dashboard (`tduel_trades` table) to verify data is being saved.

## Troubleshooting
- **Tabs not working?** Ensure you are using the latest deployment.
- **Data not saving?** Check your environment variables in Vercel and ensure RLS policies in Supabase allow public access (or configured authentication).
