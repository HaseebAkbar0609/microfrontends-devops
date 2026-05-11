# tfs-frontend

Monorepo for all TimeFlow System web frontends.

## Layout

```
tfs-frontend/
├── apps/
│   ├── customer/        Next.js 15 — customer-facing app
│   ├── professional/    Next.js 15 — professional-facing app (Stripe)
│   ├── team/            Next.js 15 — team / B2B app
│   └── landing/         Next.js 15 — marketing site
├── packages/            (placeholder — see "Roadmap" below)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## Origins

This repo was created on 2026-05-05 by combining four previously-separate repositories.
All apps were imported from the `develop` branch of their original repository:

| App in this repo | Imported from |
|---|---|
| `apps/customer` | `bitbucket.org/timeflowsystem/customer-frontend-tfs` |
| `apps/professional` | `bitbucket.org/timeflowsystem/professional-frontend-tfs` |
| `apps/team` | `bitbucket.org/timeflowsystem/team-frontend-tfs` |
| `apps/landing` | `bitbucket.org/timeflowsystem/landingpage-frontend-tfs` |

Git history was not preserved — the original repositories remain on Bitbucket as the
historical record. Branches, PRs, and blame lookups for changes prior to 2026-05-05
should reference the original repos.

## Requirements

- Node.js 20 (`nvm use` will pick up `.nvmrc`)
- pnpm 9 (installed automatically via `corepack enable`)

## Install

```bash
corepack enable
pnpm install
```

This produces a single root `pnpm-lock.yaml` shared by all apps.

## Develop a single app

```bash
pnpm dev:customer        # http://localhost:3000
pnpm dev:professional
pnpm dev:team
pnpm dev:landing
```

Each app reads its own `.env`. Copy `apps/<name>/.env.example` to `apps/<name>/.env`
and fill in values before first run.

## Run a task across all apps

```bash
pnpm build       # build every app
pnpm lint        # lint every app
pnpm typecheck   # tsc --noEmit in every app
```

Turborepo caches results in `.turbo/`, so re-runs of unchanged apps are instant.

## Roadmap (post-import follow-ups)

This is **Level 1** of the consolidation: every app sits in its own folder and builds
independently, but no code is shared yet. The original duplication identified in the
engineering review (≈ 60–70 % overlap in `src/lib/`, `src/components/ui/`, auth flows)
still exists across the four apps.

The intended Level 2 follow-up is to extract that duplication into:

```
packages/
  ui/              shared shadcn components
  lib/             auth storage, axios client, react-query client, toast, utils
  api-types/       generated types matching the tfs-backend OpenAPI contract
  eslint-config/
  tsconfig/
```

This should be done one shared module at a time, with each app's build verified
between extractions.

Other known follow-ups inherited from the original repos:

- The `landing` app uses `pages/` (Next.js Pages Router); the other three use `app/`
  (App Router). Decide whether to migrate `landing` for consistency.
- The `landing` app's package set differs in version from the others
  (Next 15.4 vs 15.3, React 19.1 vs 19.0). Align these in a follow-up bump.
- The `landing` app shipped with `bitbucket-pipelines.yml` and `deployment.sh` for an
  SSH-based deploy. Decide whether to migrate to Jenkins (used by the other apps)
  or convert everything to Bitbucket Pipelines.
- Each app's `Dockerfile` differs in quality. Standardise on the multi-stage
  `output: 'standalone'` pattern from the `landing` Dockerfile.
- No automated tests exist in any app. Add a Vitest scaffold once Level 2 packages
  exist.
