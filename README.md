# DFFW Daily

> The definitive modern paper of record for the DFW digital era—where automated precision meets uncompromising design.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-6.0-orange.svg)](https://astro.build/)
[![Payload CMS](https://img.shields.io/badge/Payload-3.0-black.svg)](https://payloadcms.com/)

## Why This Exists

Local news is often plagued by clickbait, visual clutter, and overwhelming ads. DFFW Daily solves this by providing a completely automated, high-signal, dark-mode native news experience for the Dallas-Frisco-Fort Worth metroplex. It delivers distilled daily news with zero friction and zero distractions.

## Quick Start

The fastest way to get the project running locally.

```bash
git clone https://github.com/yourusername/dffwdaily.git
cd dffwdaily
```

### Frontend (Astro)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Payload CMS)

```bash
cd backend
npm install
npm run dev
```

## Architecture

This project is decoupled into four core components to ensure zero-cost scaling and high performance:

1. **Automation Engine**: A GitHub Action (`.github/workflows/news_engine.yml`) runs a Node script that pulls data via Firecrawl and writes articles using Gemini 1.5 Flash.
2. **Database**: Supabase Postgres providing raw data storage and edge access.
3. **Backend CMS**: Payload CMS 3.0 gives editorial control over the AI-generated content.
4. **Frontend**: An Astro static-site generator styled with Tailwind CSS, achieving a 100/100 Lighthouse score.

## Installation

**Prerequisites**: Node.js 22+, npm 9+, a Supabase account, and API keys for Firecrawl and Gemini.

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for full deployment instructions across Vercel, Render, and GitHub.

## Usage

### Running the Automation Script Locally

To test the news engine scraper:

```bash
cd automation
npm install
node index.js
```
*(Ensure your `.env` file is populated with `FIRECRAWL_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`)*

### Content Guidelines

Refer to [BRAND.md](docs/BRAND.md) for our strict design and editorial rules. We utilize a Void Black (`#09090B`) and Paper White (`#FAFAFA`) theme for a premium reading experience.

## Next Steps & Future Plans

See [MASTER_PLAN.md](docs/MASTER_PLAN.md) for our ongoing roadmap and architectural directives.
