🏛️ 1. Software Architect
Mission: Design the overarching system for dffwdaily.com to ensure a decoupled, zero-cost, and high-performance news engine.

Your Action Items:

System Blueprint: Document the data flow from the GitHub Actions automation script ➡️ Supabase Postgres DB ➡️ Payload CMS (Backend) ➡️ Astro (Frontend).

Database Schema: Design the articles table in Supabase. We need columns for id, title, content (Markdown), image_url, published_at, and status.

API Routing: Establish the REST or GraphQL endpoints that Payload CMS will use to expose the Supabase data to the Astro frontend.

Performance Budget: Enforce a strict zero-JavaScript baseline for article pages. Interactive elements (if any) must be isolated using Astro Islands.

Cost Management: Ensure all initial infrastructure utilizes free tiers (Vercel/Netlify for Astro, Supabase for DB/Storage, GitHub Actions for compute).

🎨 2. Frontend Developer
Mission: Build the fastest, cleanest local news reading experience on the web using Astro.

Your Action Items:

Framework Setup: Spin up a new Astro project using Tailwind CSS.

Design System: Execute a strict minimalist, black-and-white aesthetic. The UI should feel like a premium, modern newspaper. Avoid clutter; let the typography and the single AI-generated header image do the talking. 📰

Data Fetching: Write the fetch logic to pull published articles from the Payload/Supabase API at build time (Static Site Generation).

SEO & Speed: Configure Astro to generate semantic HTML and RSS feeds. We are aiming for a flawless 100/100 Lighthouse score across the board. ⚡

Responsive Design: Ensure the layout is flawlessly responsive, prioritizing readability on mobile devices for users across the metroplex.

🗄️ 3. Backend Architect
Mission: Configure the headless CMS and database to store our automated news and serve it seamlessly to the frontend.

Your Action Items:

Supabase Configuration: Set up the Postgres database. Create the articles table defined by the Architect and configure Row Level Security (RLS) so the frontend can only read published articles, but the automation script can write using a Service Role key. 🔒

Storage Buckets: Create a Supabase Storage bucket specifically for the AI-generated article headers. Ensure the bucket is public for read access.

Payload CMS Setup: Initialize Payload CMS as a purely headless backend. Connect it to the Supabase Postgres instance.

Editor UI: Even though this is automated, configure the Payload admin panel so we have a clean interface to manually edit, delete, or review the AI-generated DFW news articles if necessary.

🤖 4. DevOps & Automation Manager
Mission: Build and maintain the "Hands-Off News Engine" that acts as our AI journalist and keeps our free-tier infrastructure alive.

Your Action Items:

The Cron Job: Create a GitHub Actions workflow that runs a Node.js script twice a week (Mondays and Thursdays). This specific schedule is critical to prevent our Supabase project from pausing due to the 7-day inactivity limit. ⏱️

The Scout (Firecrawl): Integrate the Firecrawl API into the Node.js script to scrape the top 3-5 trending local news headlines for the Dallas-Frisco-Fort Worth area.

The Writer (Gemini 1.5 Flash): Pass the scraped data to the Google AI Studio API. Prompt it to write a cohesive, engaging 500-word local news roundup formatted in clean Markdown.

The Artist (Nano Banana 2): Integrate the Gemini 3 Image API to generate one 16:9 photorealistic image per article that matches the lead story.

The Publisher: Have the script upload the generated image to Supabase Storage, and INSERT the final Markdown and image URL directly into the Supabase articles table.