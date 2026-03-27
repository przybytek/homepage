# Usage guide

Step-by-step instructions for every common task — local development, writing blog posts, updating projects, and deploying to AWS.

---

## Table of contents

1. [Local development](#1-local-development)
2. [Running a production build locally](#2-running-a-production-build-locally)
3. [Writing a blog post](#3-writing-a-blog-post)
4. [Adding a project](#4-adding-a-project)
5. [First-time AWS setup](#5-first-time-aws-setup)
6. [Deploying to AWS (manual)](#6-deploying-to-aws-manual)
7. [Automated deployment (CI/CD)](#7-automated-deployment-cicd)
8. [Updating the site after deploy](#8-updating-the-site-after-deploy)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Local development

### Prerequisites

| Tool | Install |
|------|---------|
| Node.js 22+ | https://nodejs.org or `brew install node` |
| pnpm | `npm install -g pnpm` |
| Docker (optional, for container testing) | https://docker.com |
| AWS CLI (optional, for deploys) | `brew install awscli` |

### Start the dev server

```bash
# From the repo root — only needed the first time or after pulling new changes
pnpm install

# Start the website
cd apps/web
pnpm dev
```

The site is now running at **http://localhost:3000**.

Changes to any file under `apps/web/` will hot-reload instantly without restarting.

---

## 2. Running a production build locally

This mirrors exactly what runs in CI and on the server. Run it before pushing to catch any errors.

```bash
cd apps/web
pnpm build
```

A successful build ends with a route table like:

```
Route (app)                    Size  First Load JS
┌ ○ /                         162 B        106 kB
├ ○ /blog                     163 B        106 kB
├ ● /blog/[slug]              121 B        102 kB
...
✓ Generating static pages (8/8)
```

If the build fails, the error message will point to the exact file and line.

### Test the built site locally

```bash
cd apps/web
pnpm build
pnpm start        # runs on http://localhost:3000
```

---

## 3. Writing a blog post

Blog posts are plain text files written in **MDX** (Markdown + optional React components).

### Create a new post

1. Create a new file in `apps/web/content/blog/`:

```
apps/web/content/blog/my-post-title.mdx
```

The filename becomes the URL: `/blog/my-post-title`

2. Add frontmatter at the top of the file:

```mdx
---
title: "My Post Title"
date: "2026-04-01"
excerpt: "One sentence summary shown on the blog list page."
---

Your post content starts here. Standard Markdown works: **bold**, _italic_,
`inline code`, links, headings, lists, etc.

## A section heading

More content...

```js
// Code blocks with syntax highlighting
const hello = "world"
```
```

3. Save the file. The post appears immediately at `/blog/my-post-title`.

### Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post heading |
| `date` | Yes | Publication date (`YYYY-MM-DD`), used for sorting |
| `excerpt` | No | Short summary shown on the `/blog` listing page |

### Publish

Commit and push to `main`. The CI pipeline will deploy the new post automatically.

---

## 4. Adding a project

Projects are defined in a single data file.

1. Open `apps/web/data/projects.ts`
2. Add a new entry to the `projects` array:

```ts
{
  title: 'My New Project',
  description: 'What it does and why it matters.',
  stack: ['TypeScript', 'React', 'PostgreSQL'],
  repo: 'https://github.com/przybo/my-project',   // optional
  live: 'https://my-project.com',                  // optional
  featured: true,   // true = also shown on the homepage
},
```

3. Save, commit, push. Done.

---

## 5. First-time AWS setup

You only need to do this once.

### 5a. Prerequisites

```bash
# Install AWS CLI
brew install awscli

# Configure your credentials
aws configure
# enter: Access Key ID, Secret Access Key, region (us-east-1), output (json)
```

### 5b. Bootstrap CDK

CDK needs a one-time bootstrap in your AWS account:

```bash
cd infra
pnpm install
npx cdk bootstrap aws://YOUR_ACCOUNT_ID/us-east-1
```

Replace `YOUR_ACCOUNT_ID` with your 12-digit AWS account number (find it in the AWS console top-right).

### 5c. Verify your domain in Route 53

Make sure `przybytek.com` has a hosted zone in Route 53 in the same account. The CDK stack looks it up by domain name — if it doesn't exist the deploy will fail.

### 5d. Create a GitHub Actions IAM role (for CI/CD)

The CI pipeline uses OIDC (no stored secrets). Create an IAM role that GitHub can assume:

1. In AWS IAM → Roles → Create role
2. **Trusted entity:** Web Identity → `token.actions.githubusercontent.com`
3. **Condition:** `repo:przybo/homepage:ref:refs/heads/main`
4. **Permissions:** `AdministratorAccess` (or a scoped policy with ECR + ECS + CDK permissions)
5. Copy the Role ARN

In your GitHub repo → Settings → Secrets → Actions, add:

| Secret | Value |
|--------|-------|
| `AWS_DEPLOY_ROLE_ARN` | The Role ARN from step 5 above |

---

## 6. Deploying to AWS (manual)

Use this if you want to deploy without pushing to `main`, or for the very first deploy.

```bash
# Make sure you're authenticated
aws sts get-caller-identity   # should print your account info

# Build and push the Docker image to ECR
# (replace 123456789012 with your account ID)
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

docker build -t 123456789012.dkr.ecr.us-east-1.amazonaws.com/homepage:latest apps/web
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/homepage:latest

# Deploy the CDK stack
cd infra
pnpm install
IMAGE_TAG=latest pnpm deploy
```

The first deploy takes ~10 minutes (creating VPC, ECS cluster, CloudFront distribution). Subsequent deploys are faster (~3 minutes).

### Preview changes before deploying

```bash
cd infra
pnpm synth     # prints the CloudFormation template — no AWS calls
pnpm diff      # shows what will change in your live stack
```

---

## 7. Automated deployment (CI/CD)

After [first-time setup](#5-first-time-aws-setup) is done:

```
push to main → GitHub Actions → Docker build → ECR push → cdk deploy
```

That's it. Every push to `main` deploys automatically. You can watch progress in the **Actions** tab of your GitHub repository.

The workflow file is at `.github/workflows/deploy.yml`.

---

## 8. Updating the site after deploy

| Change | What to do |
|--------|-----------|
| New blog post | Add `.mdx` file, commit, push to `main` |
| Update project list | Edit `apps/web/data/projects.ts`, push |
| UI / component change | Edit the file, push — CI builds and deploys |
| Infra change (new AWS resource) | Edit `infra/lib/homepage-stack.ts`, push — CDK deploys the diff |
| Environment variable | Update ECS task definition in `homepage-stack.ts` and redeploy |

---

## 9. Troubleshooting

### `pnpm: command not found`

```bash
npm install -g pnpm
```

### `pnpm dev` fails with a missing module

```bash
# Re-install deps
pnpm install
```

### Build fails with a TypeScript error

Read the error message — it will say the file name and line number. Fix the code, then run `pnpm build` again to confirm it passes before pushing.

### Contact form does not send emails

1. Check that `SES_FROM_ADDRESS` is set in `apps/web/.env.local`
2. Make sure the address is verified in AWS SES (Console → SES → Verified identities)
3. If your account is in SES **sandbox mode**, you can only send to verified addresses. Request production access in the SES console.

### CDK deploy fails: "No hosted zones found"

The domain `przybytek.com` must have a Route 53 hosted zone in the same AWS account. Check the Route 53 console and create one if missing.

### CDK deploy fails: "Resource already exists"

A previous half-complete deploy may have left orphaned resources. Run:

```bash
cd infra
npx cdk destroy   # destroys the stack so you can redeploy clean
IMAGE_TAG=latest pnpm deploy
```

> **Warning:** `cdk destroy` will delete all resources in the stack including the ECR repo (contents retained by default) and the ECS service. The site will be down until you redeploy.

### ECS task keeps restarting

Check the ECS task logs in CloudWatch (Console → CloudWatch → Log groups → `/ecs/homepage`). Common causes:
- Missing environment variable
- App crashing on startup (usually a missing `SES_FROM_ADDRESS`)
