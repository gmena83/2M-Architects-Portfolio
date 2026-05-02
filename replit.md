# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth (admin only)**: Clerk (`@clerk/clerk-react` v5, `@clerk/express`)
- **Object storage**: Replit Object Storage via `@workspace/object-storage` (server) and `@workspace/object-storage-web` (browser hooks)
- **Frontend**: React 19 + Vite 7 + Tailwind v4 + framer-motion

## Artifacts

- `artifacts/site` — public site for "2M Arquitectos" (Spanish). Reads projects from the API via `useListProjects` (`queryKey: ["public-projects"]`). Image paths are resolved with `src/lib/projects.ts` helpers (`/images/*` legacy direct, `/objects/*` proxied through `/api/storage`).
- `artifacts/admin` — Spanish admin panel mounted at `/admin/`. Routes: `/sign-in`, `/sign-up`, `/projects` (list with search/filters/grid), `/projects/new`, `/projects/:id` (form + gallery). Uses Clerk `<SignedIn>/<SignedOut>` (Clerk v5, NOT `<Show>` which is v6+) and Wouter. Uploads via native HTML input + `useUpload` hook from `@workspace/object-storage-web` (presigned-URL flow).
- `artifacts/api-server` — Express API. Public routes (`GET /api/projects`, `GET /api/projects/:slug`) and admin routes under `/api/admin/projects` protected by Clerk middleware (`requireAuth`). Storage routes under `/api/storage/*` for presigned uploads.
- `artifacts/hero-video`, `artifacts/mockup-sandbox` — pre-existing.

## Database

- `projects` (id, slug unique, title, year, location, type, summary, description, coverImagePath, createdAt, updatedAt)
- `project_images` (id, projectId fk, imagePath, sortOrder, createdAt)
- 19 projects seeded from legacy hardcoded data via `scripts/src/seed-projects.ts`. Image paths use legacy `/images/...` until replaced through admin uploads (which produce `/objects/...` paths).

## Conventions

- Admin uses cookie-based Clerk session — no manual token attachment needed; `customFetch` works with default credentials.
- ApiError surface: catch `err` → `err.data?.error || err.message`. (Not `err.error?.error`.)
- Framer-motion variants in TS: when using `type: "spring"` literal, annotate with `as const` to satisfy `Variants` type.
- `lib/object-storage-web` is a composite TS project (`composite: true`) and must be referenced from artifacts that depend on it.

## Security

- `requireAuth` middleware (`artifacts/api-server/src/middlewares/requireAuth.ts`) gates `/api/admin/*` and `/api/storage/uploads/request-url`.
- Set `ADMIN_ALLOWED_EMAILS` (comma-separated, e.g. `studio@2m.cl,admin@2m.cl`) to restrict admin access to specific Clerk accounts. If unset, any signed-in Clerk user gets admin access (development convenience — a warning is logged on first request).
- Storage upload URL minting is admin-only to prevent storage abuse.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts exec tsx src/seed-projects.ts` — seed projects
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
