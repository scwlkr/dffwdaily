# ADR-001: Automated Zero-Cost News Engine Architecture

## Status
Accepted

## Context
dffwdaily.com needs an overarching system to provide a decoupled, zero-cost, and high-performance local news engine for the Dallas-Frisco-Fort Worth area. The system must operate automatically without active human intervention, pull data from external APIs, synthesize it using AI, and serve it blazingly fast with a strict zero-JavaScript baseline on the frontend. A cost ceiling of $0 (using free tiers) is mandated.

## Decision
We will adopt a heavily decoupled composable architecture:
1. **Frontend**: [Astro](https://astro.build). Chosen for its Static Site Generation (SSG) capabilities and default zero-JS output, perfectly aligning with our performance budget. It will be hosted on Vercel or Netlify.
2. **Backend/Headless CMS**: [Payload CMS](https://payloadcms.com/). This acts purely as a structured interface to the database for occasional manual review, avoiding vendor lock-in with proprietary CMS solutions.
3. **Database & Storage**: [Supabase](https://supabase.com/). Chosen for its generous free tier, Postgres foundation, integrated storage buckets (for AI-generated images), and Row Level Security.
4. **Automation Engine**: [GitHub Actions](https://github.com/features/actions). Chosen to orchestrate the cron jobs running AI agents (Firecrawl, Gemini Flash, Nano Banana) for scraping, writing, and publishing content. This keeps our compute cost strictly at $0.

## Consequences
**Positive**:
- Complete adherence to the zero-cost requirement across all infrastructure layers.
- Maximum frontend performance (Lighthouse 100/100 target) due to SSG and zero JS.
- Automated pipeline handles 100% of content generation.
- Clear, distinct boundaries of concern between Automation, Database, CMS, and Frontend.

**Negative/Risks**:
- Data pipelines and hosting are reliant on third-party free tiers. If any service changes its free tier policy, the architecture will require a prompt migration.
- SSG means articles are not strictly real-time; updates are tied to the GitHub Action run frequency or require webhook triggers for immediate deployment.
