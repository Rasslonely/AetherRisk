# Phase 20 Research: Dedicated Telemetry & Full-Screen Sandbox Pages

## Objective
Implement `app/operations/page.tsx` (dedicated full-width telemetry explorer) and `app/sandbox/page.tsx` (dedicated full-screen 30-second sandbox page), concluding **Stage 4 (Premium UI, 4-Phase Stepper & Judge Sandbox)**.

## Technical Specifications

### 1. `app/operations/page.tsx`
- Dedicated page for telemetry inspection.
- Header with live network status and 4 summary stat pills (`18 Operations`, `$8.45M Proven`, `12.4s Latency`, `100% CC3 Precompile Verification`).
- Full-width `<TelemetryTable showFilters={true} />`.
- Asserts `[data-testid="operation-row"]` count $\ge 10$ with zero console errors.

### 2. `app/sandbox/page.tsx`
- Dedicated full-screen judge simulation environment.
- Header with persona instructions.
- Embeds `<InteractiveSandbox />` and `<RiskMetricRadar />`.
- Full compliance with Playwright test selectors (`simulate-repay-btn`, `precompile-verified-badge`, `credit-score-value`, etc.).

## Verification Gate
- `rtk pnpm build` compiles cleanly with zero TypeScript errors.
- Routes `/operations` and `/sandbox` generate valid static/dynamic pages.
