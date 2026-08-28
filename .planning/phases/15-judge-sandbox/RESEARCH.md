# Phase 15 Research: 30-Second Zero-Wallet Interactive Sandbox

## Objective
Implement `app/components/interactive-sandbox.tsx`, the cornerstone interactive simulator (Engine 2) allowing hackathon judges and risk officers to experience real-time cross-chain credit underwriting, precompile verification, and Bayesian risk state morphing in under 30 seconds with zero wallet friction.

## Visual State Transition Architecture

```
┌─── BEFORE STATE (🔴 Danger Theme) ──────────────────┐
│ Credit Score: 620 (HIGH RISK)                       │
│ Health Factor: 0.87 (⚠️ DANGER ZONE)                 │
│ Max Credit Line: $1,200,000                         │
│ APY: 9.2% (Penalty Rate)                            │
│ ⚠️ LIQUIDATION WARNING ACTIVE                       │
└─────────────────────────────────────────────────────┘
                         ↓↓↓ [Judge clicks SIMULATE REPAYMENT]
┌─── 4-PHASE ATTESTATION CANVAS (12.4s Pipeline) ────┐
│ 1. Sepolia Tx -> 2. Attestcoin -> 3. Merkle -> 4. 0xFD2
└─────────────────────────────────────────────────────┘
                         ↓↓↓ [TEE Bayesian Risk Mutation]
┌─── AFTER STATE (🟢 Healthy Theme) ──────────────────┐
│ Credit Score: 810 (+190) [Animated 620 -> 810]      │
│ Health Factor: 1.84 (✅ HEALTHY)                     │
│ Max Credit Line: $1,650,000 (+$450,000)             │
│ APY: 4.1% (Prime Rate)                              │
│ ✅ ALL CLEAR — No Liquidation Risk                   │
└─────────────────────────────────────────────────────┘
```

## Critical UX & Playwright Requirements
1. `data-testid="interactive-sandbox"` on root container.
2. `data-testid="simulate-repay-btn"` on the primary execution button.
3. `data-testid="credit-score-value"` displaying "620" in BEFORE state and "810" in AFTER state.
4. `data-testid="health-factor-value"` and `data-testid="apy-value"`.
5. Precompile badge `data-testid="precompile-verified-badge"` rendered on Phase 4 completion.
6. Instant Persona switching between *Apex Commodities*, *SolarGrid Africa*, and *Alpha Quant*.

## Verification Gate
- `rtk pnpm build` compiles cleanly with zero TypeScript errors.
- Component state morphing tested across all 3 personas.
