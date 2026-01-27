# Deployment Instructions - Rueda Rola Invoice

This project is optimized for deployment on **Vercel**. Follow these steps to go live.

## 1. Prerequisites

- A [Vercel Account](https://vercel.com/signup).
- A [Supabase Project](https://supabase.com/) (which you already have).

## 2. Connect to Vercel

1.  Navigate to the project directory in your terminal.
2.  Run `npx vercel` (or just `vercel` if installed globally).
3.  Follow the prompts:
    - **Set up and deploy?**: `Y`
    - **Which scope?**: Select your team or personal account.
    - **Link to existing project?**: `N`
    - **Project Name**: `rueda-rola-invoice` (or your preference).
    - **Directory**: `./` (default).
    - **Build Command**: `next build` (default).
    - **Output Directory**: `.next` (default).
    - **Development Command**: `next dev` (default).

## 3. Environment Variables (CRITICAL)

Before the deployment completes (or immediately after), you MUST set the environment variables in the Vercel Dashboard.

1.  Go to your Vercel Dashboard -> Select Project -> **Settings** -> **Environment Variables**.
2.  Add the following variables (copy values from your local `.env.local` or Supabase dashboard):

| Key                             | Value Source                                          |
| :------------------------------ | :---------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase Project Settings -> API -> URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings -> API -> `anon` public key |

3.  **Redeploy**: If you added variables _after_ the initial deploy failed (or built with empty values), go to **Deployments** -> **Redeploy**.

## 4. Verification

- Open the production URL provided by Vercel.
- Create a test invoice.
- Verify "Save" works (connects to Supabase).
- Verify "History" works.
- Verify "Export PDF" works.

## Troubleshooting

- **Build Fails**: Check the "Build Logs" in Vercel. Ensure `npm run build` passes locally.
- **Supabase Error**: Check browser console. 99% of the time, the Environment Variables are missing or incorrect in Vercel.
