# DFW Daily News Deployment Guide

This document outlines the step-by-step instructions for deploying all three components of the DFW Daily News platform using free-tier services.

## 1. Setup GitHub & The Automation Engine (GitHub Actions)
The "Hands-Off News Engine" relies on GitHub Actions to run the Node.js script twice a week.

### Steps:
1. Ensure your local code is fully committed.
2. Push your `main` branch to a new repository on GitHub.
3. In your GitHub repository, navigate to **Settings** > **Secrets and variables** > **Actions**.
4. Click **New repository secret** and add the following exactly as they appear in `automation/.env`:
   - `FIRECRAWL_API_KEY`
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. *Verification:* Once added, you can test the script manually by going to the **Actions** tab in GitHub, clicking **DFW News Engine Automation**, and clicking the **Run workflow** button.

---

## 2. Deploy the Frontend (Vercel)
The Astro frontend will be hosted on Vercel utilizing their free Hobby tier.

### Steps:
1. Log in or create an account at [Vercel.com](https://vercel.com/) and link your GitHub account.
2. Click **Add New...** > **Project**.
3. Import your `dffwdaily` GitHub repository.
4. On the Configuration screen, expand the **Framework Preset** dropdown and select `Astro` (it may auto-detect this).
5. **CRITICAL:** Set the **Root Directory** to `frontend`.
6. Expand **Environment Variables** and add your frontend keys (e.g., `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` if your frontend requires them to fetch articles).
7. Click **Deploy**.
8. *Verification:* Once Vercel finishes building (usually < 2 minutes), visit your assigned `*.vercel.app` URL to review the live site!

---

## 3. Deploy the Backend CMS (Render)
Payload CMS requires an active Node.js server. Since Vercel is best optimized for the frontend (serverless functions), we recommend deploying the Payload backend using [Render.com's](https://render.com/) Free Web Service tier.

### Steps:
1. Log in or create an account at **Render.com** and link your GitHub account.
2. Click **New +** > **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your `dffwdaily` GitHub repository.
4. On the configuration screen:
   - **Name:** `dffwdaily-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Scroll down to **Environment Variables** and add your backend `.env` variables. At a minimum, this usually consists of:
   - `DATABASE_URI` (Your Supabase connection string)
   - `PAYLOAD_SECRET` (A long, random string)
6. Select the **Free** instance type.
7. Click **Create Web Service**.
8. *Verification:* It will take a few minutes to build. Once complete, navigate to the provided `.onrender.com/admin` URL to log in and review the generated DFW articles!
