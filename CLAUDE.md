# Personal Finance App — Claude Instructions

## Project Overview
A Frontend Mentor premium challenge: a personal finance management dashboard. Covers five core features — Overview, Transactions, Budgets, Pots, and Recurring Bills.

**Figma Design File:** https://www.figma.com/design/9G4v87fQyb9lgsezb4jI9M/personal-finance-app?node-id=101-2&p=f&t=8qXwG2YC0JFWeNrk-0

> **Always check the Figma design file before building any page or component.**

## Stack
- **Framework:** Next.js (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS v4, shadcn/ui + Radix UI primitives
- **Animations:** Framer Motion — sidebar collapse, modal/page transitions
- **Auth:** Custom localStorage-based auth (email + password, SHA-256 hashed via Web Crypto API, session cookie for middleware)
- **Error Monitoring:** Sentry (`@sentry/nextjs`)
- **HTTP Client:** Axios — used as the RTK Query base query client
- **Server state:** Redux Toolkit + RTK Query
- **UI state:** Zustand
- **Forms:** react-hook-form + Zod
- **Tables:** TanStack Table v8 — headless sorting, filtering, and pagination (used on /transactions)
- **Charts:** Recharts
- **Toasts:** Sonner
- **Package Manager:** Yarn

## Folder Structure
```
src/
  app/
    (auth)/           # Public routes (login, signup)
    (protected)/
      (layout)/       # Pages that share the sidebar/nav layout
      (no-layout)/    # Pages without layout (e.g. modals, auth redirects)
  features/
    {feature}/
      components/     # Domain-specific components (never import across features)
  components/
    ui/               # shadcn/Radix shared UI primitives — no business logic
    layout/           # Sidebar, topbar, shell wrappers
    common/           # Generic reusable components (avatars, badges, etc.)
  hooks/              # Shared custom hooks (useDebounce, etc.)
  store/              # Redux store setup (configureStore, middleware)
  lib/
    api/
      apiSlice.ts     # RTK Query base API slice + Axios base query
    features/
      {feature}/
        {feature}ApiSlice.ts  # Feature-specific injected endpoints
    constants/        # App-wide constants
    utils/            # Shared utility functions
    validation/       # Zod schemas
  types/              # Shared TypeScript interfaces and types
  styles/             # Global CSS (tokens.css, globals.css)
app_assets/           # Design reference files (gitignored — do not commit)
  assets/fonts/       # Public Sans font files
  assets/images/      # Avatar images
  data.json           # Sample data (balance, transactions, budgets, pots)
  *.html              # Reference HTML pages per feature
public/               # Static assets (SVGs, icons)
```

## Folder Responsibility Rules
- `app/` — routing only; no business logic, just import from `features/`
- `features/` — UI components scoped to one feature; never import directly across features
- `components/ui/` — primitives only (buttons, inputs, dialogs); no business logic
- `components/layout/` — shell, sidebar, nav; app structure only, not feature logic
- `lib/features/` — RTK Query API slices; one slice per backend resource
- `hooks/` — reusable hooks shared across features
- `lib/validation/` — all Zod schemas; import into features as needed
- `types/` — shared TypeScript types; feature-specific types can live inside the feature folder

## API Pattern (RTK Query)
- One base `apiSlice` in `src/lib/api/apiSlice.ts` created with `createApi`
- All feature slices use `injectEndpoints` — never create separate `createApi` calls
- Tag types declared on the base slice (e.g. `"Transaction"`, `"Budget"`, `"Pot"`)
- `providesTags` on queries, `invalidatesTags` on mutations — this drives cache refresh
- Auth token injected in `prepareHeaders` via Clerk session
- On 401: reload Clerk session, retry once, then sign out and redirect to `/login`
- `keepUnusedDataFor: 120` on the base slice

## Forms Pattern
- Always use `react-hook-form` + `zod` resolver — no exceptions
- Define Zod schema first, infer TypeScript type from it for form values
- Use shadcn `Form` + `FormField` components for consistent field layout

## Component Patterns
- Use `cn()` (clsx + tailwind-merge) for all className merging — never raw string concatenation
- Button variants via `cva` from `class-variance-authority`
- Modals: shadcn `Dialog` — always include loading state and error handling inside
- Toasts: `sonner` — use `toast.success` / `toast.error` after mutations
- Server Components by default; add `"use client"` only for event handlers, hooks, or browser APIs
- **Container/Presenter split:** separate smart components (data fetching, logic) from dumb components (pure rendering) — improves testability and reuse
- **Headless UI + custom styling:** Radix handles behavior/accessibility, Tailwind handles visuals — keep concerns separated
- **Tables:** use TanStack Table v8 for any sortable/filterable/paginated table; own the rendering, use the headless logic

## Finance Domain Rules
- Amounts are always stored in pence/cents (integers) — format on display only, never store formatted strings
- Budget spent = sum of transactions in that category for the current month
- Pot balance cannot exceed pot target
- Recurring bills: flagged transactions grouped by merchant

## Sample Data (app_assets/data.json)
- `balance` — current balance, income, expenses
- `transactions` — 39+ records with name, category, date, amount, avatar, recurring flag
- `budgets` — 4 categories with max spend and theme color
- `pots` — 5 savings pots with target, total, and theme color

## Key Pages
- `/overview` — summary cards, charts, recent transactions, pot progress, upcoming bills
- `/transactions` — filterable, searchable, paginated table (10/page), sort by Latest/Oldest/A-Z/Z-A/Highest/Lowest
- `/budgets` — budget cards with donut chart, current-month spending, latest 3 transactions per category
- `/pots` — savings pot cards with add/withdraw modals, progress toward goal
- `/recurring-bills` — recurring transactions list, paid/unpaid status, search and sort

## Data Layer
- No database — all data sourced from `app_assets/data.json`
- Data is served via Next.js Route Handlers (`app/api/`) which read and return JSON
- RTK Query endpoints call these Route Handlers — no direct imports of `data.json` in components
- Mutations (add/withdraw pot, create/edit budget) update in-memory state via RTK Query cache + `optimisticUpdate` — data does not persist across page reloads (by design for this demo)
- All monetary amounts in `data.json` are integers (pence/cents) — format only on display

## Testing
- **Framework:** Vitest + React Testing Library (unit/integration), Playwright (e2e)
- Test files co-located with source: `src/features/{feature}/__tests__/`, `src/components/__tests__/`
- e2e tests live in `e2e/` at the project root
- Mock RTK Query endpoints with `msw` (Mock Service Worker) — never mock the Redux store directly
- Mock Clerk auth with `@clerk/testing` helpers
- Target coverage: unit tests on utils/hooks, integration tests on feature components, e2e on critical flows (login, add pot, create budget)
- Run with: `yarn test` (Vitest), `yarn test:e2e` (Playwright)

## Environment & Config
Required env vars (see `.env.example`):
```
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```
- No auth-related env vars — auth is entirely client-side via localStorage + cookie
- Never commit `.env` — only `.env.example` with empty values
- All `NEXT_PUBLIC_*` vars are safe for the client; never expose secret keys via `NEXT_PUBLIC_`

## Git / PR Workflow
- Branch naming: `feature/`, `fix/`, `chore/`, `docs/` prefixes — e.g. `feature/transactions-table`
- Commit format: Conventional Commits — `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`
- One PR per feature/fix — keep PRs small and focused
- PR title mirrors commit format: `feat: add budget donut chart`
- Squash merge into `main` — no merge commits
- `main` is always deployable — no WIP commits directly to main

## Error Handling
- **API errors:** surface via `sonner` toast — `toast.error(message)` after failed mutations
- **Form errors:** inline under the field via `react-hook-form` + shadcn `FormMessage`
- **Page-level errors:** use Next.js `error.tsx` boundary per route segment
- **Global fallback:** root `error.tsx` catches unhandled errors with a generic "Something went wrong" UI
- **RTK Query:** always check `isError` + `error` from query/mutation hooks — never swallow silently
- **Logging:** `console.error` in development; Sentry in production via `@sentry/nextjs`
- Sentry is initialized in `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`
- Capture unexpected errors with `Sentry.captureException(error)` in error boundaries and Route Handlers

## Accessibility
- Target: **WCAG 2.1 AA**
- Radix UI primitives handle keyboard navigation and ARIA — do not override their roles
- All interactive elements must be reachable by keyboard and have visible focus styles
- Images: always provide meaningful `alt` text; decorative images use `alt=""`
- Color contrast: never rely on color alone to convey meaning (budget category colors need labels too)
- Use semantic HTML first (`button`, `nav`, `main`, `section`) — avoid `div` for interactive elements

## Performance
- Use `next/image` for all images — no raw `<img>` tags
- Lazy-load heavy components (charts, modals) with `dynamic(() => import(...), { ssr: false })`
- Avoid importing entire libraries — use named imports (e.g. `import { format } from 'date-fns'`)
- RTK Query caching (`keepUnusedDataFor: 120`) is the primary client-side cache — do not duplicate with `useState`
- No premature optimization — measure with Lighthouse before adding complexity

## Deployment
- **Platform:** Vercel
- `main` branch auto-deploys to production
- Preview deployments on every PR — test against preview URL before merging
- Environment vars set in Vercel dashboard — never in the repo
- `yarn build` must pass locally before pushing — no broken builds to `main`

## Code Review Checklist
Before merging, verify:
- [ ] No `any` types — proper interfaces in `src/types/` or feature folder
- [ ] No inline styles — Tailwind only
- [ ] No raw currency formatting stored — integers only
- [ ] All form inputs validated with Zod
- [ ] Mutations show loading state and handle errors with toast
- [ ] New API endpoints use `injectEndpoints` — no second `createApi`
- [ ] `providesTags` / `invalidatesTags` wired correctly for cache invalidation
- [ ] No cross-feature imports in `features/`
- [ ] New pages added to `(protected)/(layout)` unless they explicitly need no layout
- [ ] Sentry captures errors in all `error.tsx` boundaries

## Do Not
- Do not store formatted currency strings — always raw integers
- Do not skip Zod validation on API route handlers
- Do not use `any` type — define proper interfaces in `src/types/`
- Do not use inline styles or CSS modules — Tailwind utilities only
- Do not create a second `createApi` call — always inject into the base slice
- Do not import `data.json` directly in components — always go through Route Handlers + RTK Query
- Do not commit `.env` — only `.env.example`

## Dev Commands
```bash
yarn dev      # Start development server
yarn build    # Production build
yarn lint     # Run ESLint
yarn test     # Run Vitest unit/integration tests
yarn test:e2e # Run Playwright e2e tests
```
