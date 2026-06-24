# Cloudflare Workers

STOP. Your knowledge of Cloudflare Workers APIs and limits may be outdated. Always retrieve current documentation before any Workers, KV, R2, D1, Durable Objects, Queues, Vectorize, AI, or Agents SDK task.

## Docs

- https://developers.cloudflare.com/workers/
- MCP: `https://docs.mcp.cloudflare.com/mcp`

For all limits and quotas, retrieve from the product's `/platform/limits/` page. eg. `/workers/platform/limits`

## Commands

| Command | Purpose |
|---------|---------|
| `npx wrangler dev` | Local development |
| `npx wrangler deploy` | Deploy to Cloudflare |
| `npx wrangler types` | Generate TypeScript types |

Run `wrangler types` after changing bindings in wrangler.jsonc.

## Node.js Compatibility

https://developers.cloudflare.com/workers/runtime-apis/nodejs/

## Errors

- **Error 1102** (CPU/Memory exceeded): Retrieve limits from `/workers/platform/limits/`
- **All errors**: https://developers.cloudflare.com/workers/observability/errors/

## Product Docs

Retrieve API references and limits from:
`/kv/` · `/r2/` · `/d1/` · `/durable-objects/` · `/queues/` · `/vectorize/` · `/workers-ai/` · `/agents/`

## Best Practices (conditional)

If the application uses Durable Objects or Workflows, refer to the relevant best practices:

- Durable Objects: https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/
- Workflows: https://developers.cloudflare.com/workflows/build/rules-of-workflows/

Fetch https://developers.cloudflare.com/agent-setup/prompt.md

Cloudflare Workers & D1 Integration Guide for AI Agents

This repository is a monorepo containing a Cloudflare Workers backend (functions) and a React + Vite frontend (frontend).
As an AI Coding Agent, follow these guidelines to interact with Cloudflare services (Workers, D1, Drizzle ORM) in this environment.

1. Project Directory Structure

threads-ai-helper/
├── .gitignore
├── AGENTS.md (This file)
├── functions/          # Cloudflare Workers Backend
│   ├── src/
│   │   ├── index.ts    # Entry point (Fetch & Scheduled handler)
│   │   └── db/
│   │       └── schema.ts # Drizzle ORM Schema
│   ├── drizzle/        # Auto-generated SQL migrations
│   ├── wrangler.toml   # Cloudflare Configuration (D1, Env vars)
│   └── package.json
└── frontend/           # React + Vite Frontend


2. Cloudflare CLI (Wrangler) Commands

Always run wrangler commands inside the functions/ directory unless specified otherwise.

Local Development & Testing

Start Local Workers Dev Server (with local D1):

cd functions
npx wrangler dev


Apply Migrations to Local D1 Database:

cd functions
npx wrangler d1 migrations apply threads-ai-db --local


Production Deployment

Deploy Workers & Apply Production D1 Migrations:

# Step 1: Push migrations to production D1
cd functions
npx wrangler d1 migrations apply threads-ai-db --remote

# Step 2: Deploy worker code
npx wrangler deploy


3. Drizzle ORM Workflows (D1 SQLite dialect)

When modifying the database schema (functions/src/db/schema.ts):

Modify Schema: Make changes to the tables inside schema.ts.

Generate Migration SQL:

cd functions
npx drizzle-kit generate


Apply to Local DB:

npx wrangler d1 migrations apply threads-ai-db --local


Apply to Production DB:

npx wrangler d1 migrations apply threads-ai-db --remote


4. Coding Guardrails for Cloudflare D1 & Workers

No LocalStorage / SessionStorage: Workers run in a V8 isolate context. Use Cloudflare KV or D1 for state persistence.

Drizzle D1 Binding: D1 is bound to env.DB as defined in wrangler.toml. Access it in the fetch or scheduled handler:

import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db/schema';

export default {
  async fetch(request, env, ctx) {
    const db = drizzle(env.DB, { schema });
    // your logic here
  }
}


Optimized SQL Queries: D1 has a execution time limit per query. Avoid massive joins. Use indexing on foreign keys (e.g., my_account_id, target_user_id).

Fetch Limitations: Outgoing HTTP requests in Workers must use standard fetch. Keep timeouts in mind (default is often 30 seconds, but cron triggers can run up to 15 minutes on Paid plan, 30s on Free plan).