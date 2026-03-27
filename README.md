# przybytek.com

Personal homepage — portfolio, blog, and contact. Built with Next.js 15, Tailwind CSS v4, and deployed to AWS via CDK (ECS Fargate + CloudFront).

## Project structure

```
homepage/
├── apps/
│   └── web/              # Next.js 15 app (the website)
│       ├── app/          # Pages (App Router)
│       ├── components/   # Shared UI components
│       ├── content/blog/ # MDX blog posts
│       ├── data/         # Static data (projects list)
│       ├── lib/          # Utilities (MDX reader)
│       └── Dockerfile    # Production container build
├── infra/                # AWS CDK stack (all cloud resources)
└── .github/workflows/    # CI/CD — auto-deploy on push to main
```

## Quick start (local dev)

**Prerequisites:** Node.js 22+, pnpm (`npm install -g pnpm`)

```bash
# 1. Install all dependencies (run once from repo root)
pnpm install

# 2. Start the dev server
cd apps/web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Where to run | What it does |
|---------|-------------|--------------|
| `pnpm install` | repo root | Install all dependencies |
| `pnpm dev` | `apps/web/` | Start local dev server with hot reload |
| `pnpm build` | `apps/web/` | Production build (also run by CI) |
| `pnpm lint` | `apps/web/` | Lint all TypeScript/TSX files |
| `pnpm synth` | `infra/` | Preview AWS CloudFormation changes |
| `pnpm deploy` | `infra/` | Deploy infra to AWS |

> See [usage.md](usage.md) for detailed walkthroughs of each task.

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, Server Actions) |
| Styling | Tailwind CSS v4 |
| Blog | MDX files in `content/blog/` via `next-mdx-remote` |
| Email | AWS SES (contact form) |
| Container | Docker (multi-stage, Node 22 Alpine) |
| Cloud | AWS ECS Fargate + ALB + CloudFront + Route 53 |
| IaC | AWS CDK v2 (TypeScript) |
| CI/CD | GitHub Actions (OIDC auth → ECR push → CDK deploy) |
| Monorepo | pnpm workspaces + Turborepo |

## Environment variables

Copy `apps/web/.env.example` to `apps/web/.env.local` and fill in:

```env
SES_FROM_ADDRESS=hello@przybytek.com   # verified SES sender address
SES_REGION=us-east-1
```

These are only needed for the contact form. The rest of the site works without them locally.

## Deployment

Deployment is **automatic** — push to `main` and GitHub Actions will:
1. Build and push a Docker image to ECR
2. Run `cdk deploy` to update the ECS service

For manual deploys or first-time setup see [usage.md](usage.md).
