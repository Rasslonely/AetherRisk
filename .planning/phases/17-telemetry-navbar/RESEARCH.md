# Phase 17 Research: Pre-Seeded Telemetry Table & Navigation Bar

## Objective
Implement `app/components/telemetry-table.tsx` (the 18-row real-time cross-chain operations feed) and `app/components/navbar.tsx` (the floating glass island navigation bar).

## Design & Playwright Requirements

### 1. `app/components/telemetry-table.tsx`
- Renders all 18 historical operations with zero empty states.
- Implements `data-testid="telemetry-table"` on root container and `data-testid="operation-row"` on each table row.
- Search and multi-criteria filtering (by Operation Type and Proof Source).
- Rich badges for Score Delta (`+190 (620 -> 810)`), Precompile Status, and Direct Explorer Links.
- Fallback to `PRESEEDED_OPERATIONS` whenever `GET /api/operations` has latency or network issues.

### 2. `app/components/navbar.tsx`
- Floating pill-shaped island navigation bar with glassmorphic backdrop blur (`backdrop-blur-xl bg-slate-950/80`).
- Navigation links with active route indicators: `/`, `/operations`, `/sandbox`.
- Integrated [TEE Certificate] trigger button opening `EnclaveCertModal`.
- Live Creditcoin CC3 status pill: `🟢 Creditcoin CC3 (102031)`.

## Verification Gate
- `rtk pnpm build` compiles cleanly with zero TypeScript errors.
