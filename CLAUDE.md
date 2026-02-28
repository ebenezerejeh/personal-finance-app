# Personal Finance App — Claude Instructions

## Project Overview
A Frontend Mentor premium challenge: a personal finance management dashboard. Covers five core features — Overview, Transactions, Budgets, Pots, and Recurring Bills.

## Stack
- **Framework:** Next.js (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS v4, shadcn/ui + Radix UI primitives
- **Auth:** Clerk
- **ORM:** Prisma
- **Server state:** Redux Toolkit + RTK Query
- **UI state:** Zustand
- **Forms:** react-hook-form + Zod
- **Charts:** Recharts
- **Toasts:** Sonner
- **Package Manager:** Yarn

## Folder Structure
```
src/
  app/
    (protected)/
      (layout)/       # Pages that share the sidebar/nav layout
      (no-layout)/    # Pages without layout (e.g. modals, auth redirects)
  features/
    {feature}/
      components/     # Domain-specific components
  components/
    ui/               # shadcn/Radix shared UI components
  hooks/              # Shared custom hooks
  lib/
    api/
      apiSlice.ts     # RTK Query base API slice
    features/
      {feature}/
        {feature}ApiSlice.ts  # Feature-specific injected endpoints
  types/              # Shared TypeScript interfaces and types
app_assets/           # Design reference files (gitignored — do not commit)
  assets/fonts/       # Public Sans font files
  assets/images/      # Avatar images
  data.json           # Sample data (balance, transactions, budgets, pots)
  *.html              # Reference HTML pages per feature
public/               # Static assets (SVGs, icons)
```

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

## Do Not
- Do not store formatted currency strings in the DB — always raw integers
- Do not skip Zod validation on API route handlers
- Do not use `any` type — define proper interfaces in `src/types/`
- Do not use inline styles or CSS modules — Tailwind utilities only
- Do not create a second `createApi` call — always inject into the base slice

## Dev Commands
```bash
yarn dev      # Start development server
yarn build    # Production build
yarn lint     # Run ESLint
```
