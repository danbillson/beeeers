# Repository Guidelines

## Project Structure & Module Organization
This Next.js 15 app keeps code inside `src/`: routes in `src/app`, UI primitives in `src/components`, hooks in `src/hooks`, shared helpers in `src/lib`, and Drizzle schema in `src/db`. Generated migrations land in `drizzle/`, and static assets in `public/`. Co-locate feature folders under their route folder (for example, `src/app/brew-sessions`).

## Build, Test, and Development Commands
Install dependencies with `pnpm install`. Use `pnpm dev` for the hot-reloading dev server, `pnpm build` for a production bundle, and `pnpm start` to serve it. `pnpm lint` is the required pre-commit gate. Generate migrations with `pnpm drizzle-kit generate` and apply them via `pnpm drizzle-kit push` against the `DATABASE_URL` in `.env.local`. Never edit existing files under `drizzle/000x_*`; always add a new migration and commit the updated files in `drizzle/meta/`.

### Agent Workflow Requirement
- After making changes, agents must run `pnpm lint` to confirm the workspace is clean instead of only suggesting it as a next step.

## Coding Style & Naming Conventions
Use TypeScript with 2-space indentation, enforced by the flat ESLint config (`next/core-web-vitals`). Prefix unused args with `_` to satisfy the custom `no-unused-vars`. Components stay functional. All file paths use kebab-case (e.g., `recipe-stats-bar.tsx`, `brew-sessions/page.tsx`), while helpers and variables remain camelCase. Styling relies on Tailwind v4 tokens declared in `src/app/globals.css`; avoid raw color literals. Route folders use kebab-case (e.g., `brew-sessions`).

## Testing Guidelines
Automated tests are not yet wired up; linting plus manual verification remain required. If you add tests, co-locate `.test.ts[x]` files and propose the framework (Vitest + Testing Library is preferred) before introducing dependencies. Document the manual checks performed for data-impacting changes while running `pnpm dev`.

## Commit & Pull Request Guidelines
Use Conventional Commits (`feat:`, `fix:`, `chore:`) as shown in the git history and squash WIP commits before review. PRs should outline the change, list local checks (`pnpm lint`, manual QA), link issues, and attach UI screenshots. Call out any Drizzle migration, its data impact, and the file created under `drizzle/`.

## Data & Environment Notes
Store secrets only in `.env.local` and never commit them. Confirm `DATABASE_URL` targets a disposable database before migration commands. After running migrations that drop tables (e.g., brew log cleanup), verify downstream features for regressions. If you sync env files, use a secure sharing tool and update the README with any new variables.
