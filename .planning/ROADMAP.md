# Roadmap: AetherRisk

## Overview

AetherRisk executes across 5 Stages and 22 cohesive phases to construct a dual-engine architecture: Engine 1 delivers the hard-tech smart contract primitives on Creditcoin CC3 (Substrate precompiles `0xFD2`, `0xFD3`, `EvmV1Decoder`, and TEE-Lite `CreditRegistry`), while Engine 2 delivers a zero-friction Next.js 15 monolith with Triple-Layer Proof Resilience and a 30-second in-browser Judge Sandbox.

## Phases

### Stage 1: Hard-Tech Primitive Core (Phases 01–07) — COMPLETE
- [x] **Phase 1: Foundry Configuration & BlockProver Interface (`0xFD2`)** - Initialize Foundry workspace and `INativeQueryVerifier.sol` interface.
- [x] **Phase 2: Precompile ChainInfo (`0xFD3`) & EvmV1Decoder Interfaces** - Implement `IChainInfo.sol` and `IEvmV1Decoder.sol` decoding contracts.
- [x] **Phase 3: AetherRiskASC Attestcoin Smart Contract** - Implement `AetherRiskASC.sol` with `BlockProver` caller, status check, and replay protection.
- [x] **Phase 4: CreditRegistry & TEE-Lite Trust Boundary** - Implement on-chain credit score registry with `authorizedEnclaveSigners` and `ecrecover`.
- [x] **Phase 5: AetherVault4626 Dynamic Rate Lending Vault** - Implement ERC-4626 dynamic-rate vault tied to borrower credit tiers.
- [x] **Phase 6: SepoliaLendingEmitter Source Chain Contract** - Implement event emitter for `LoanRepaid` and `CollateralAdded` on Sepolia.
- [x] **Phase 7: Foundry CC3 & Sepolia Deployment Scripts** - Build deterministic deployment scripts `DeployCreditcoin.s.sol` and `DeploySepolia.s.sol`.

### Stage 2: Monolith Scaffold & Zero-State Database (Phases 08–11) — COMPLETE
- [x] **Phase 8: Next.js 15 Monolith Full-Stack Scaffold** - Configure Next.js 15 App Router, TypeScript, Tailwind CSS v4, and dependencies.
- [x] **Phase 9: Prisma Database Schema & Client Singleton** - Implement PostgreSQL models (`Borrower`, `Operation`, `CachedProof`, `EnclaveSigner`).
- [x] **Phase 10: TypeScript Domain Models & 18 Pre-Seeded Records** - Create `types.ts` and `telemetry-seed.ts` with 18 verified records and 3 personas.
- [x] **Phase 11: Database Seeding Execution (`seed-db.ts`)** - Seed Supabase PostgreSQL with 18 operations to fulfill Zero-Empty-State Law.

### Stage 3: SDK Integration, Proof Resolver & API Core (Phases 12–13) — COMPLETE
- [x] **Phase 12: Next.js Native API Route Handlers** - Implement `/api/operations`, `/api/proof`, and `/api/simulate`.
- [x] **Phase 13: SDK Wrapper, Triple-Layer Resolver & TEE Signer** - Build `lib/attestcoin.ts`, `lib/proof-resolver.ts`, and `lib/tee-signer.ts`.

### Stage 4: Premium UI, 4-Phase Stepper & Judge Sandbox (Phases 14–20)
- [x] **Phase 14: Visual 4-Phase Attestation Stepper Canvas** - Build `visual-pipeline-canvas.tsx` with Framer Motion animations.
- [x] **Phase 15: 30-Second Zero-Wallet Interactive Sandbox** - Build `interactive-sandbox.tsx` with persona selector, state morphing, and ephemeral signing.
- [x] **Phase 16: Bayesian Radar Chart & Enclave Certificate Modal** - Build `risk-metric-radar.tsx` and `enclave-cert-modal.tsx`.
- [x] **Phase 17: Pre-Seeded Telemetry Table & Navigation Bar** - Build `telemetry-table.tsx` and `navbar.tsx`.
- [x] **Phase 18: Design System Globals & Root Layout** - Implement `globals.css` state keyframes and `layout.tsx` SEO meta.
- [ ] **Phase 19: Executive Pitch Dashboard Landing Page** - Build `app/page.tsx` with live metrics, pitch hero, and interactive preview.
- [ ] **Phase 20: Dedicated Telemetry & Full-Screen Sandbox Pages** - Build `app/operations/page.tsx` and `app/sandbox/page.tsx`.

### Stage 5: E2E Playwright Suite & Judge Verification (Phases 21–22)
- [ ] **Phase 21: Playwright E2E Test Suite Automation** - Implement and pass `live-judge-flow.spec.ts` for zero-empty-state and sandbox flow.
- [ ] **Phase 22: Enclave Certificate JSON & Final Verification** - Build `public/enclave-attestation.json` and final verification gate.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundry Config & BlockProver | 1/1 | Complete | 2026-08-28 |
| 2. ChainInfo & Decoder | 1/1 | Complete | 2026-08-28 |
| 3. AetherRiskASC Contract | 1/1 | Complete | 2026-08-28 |
| 4. CreditRegistry & TEE-Lite | 1/1 | Complete | 2026-08-28 |
| 5. AetherVault4626 Vault | 1/1 | Complete | 2026-08-28 |
| 6. SepoliaLendingEmitter | 1/1 | Complete | 2026-08-28 |
| 7. Deployment Scripts | 1/1 | Complete | 2026-08-28 |
| 8. Next.js Monolith Scaffold | 1/1 | Complete | 2026-08-28 |
| 9. Prisma Schema & Client | 1/1 | Complete | 2026-08-28 |
| 10. TypeScript Domain & Seed Data | 1/1 | Complete | 2026-08-28 |
| 11. Database Seeding Execution | 1/1 | Complete | 2026-08-28 |
| 12. API Route Handlers | 1/1 | Complete | 2026-08-28 |
| 13. SDK Wrapper & Resolver | 1/1 | Complete | 2026-08-28 |
| 14. 4-Phase Stepper Canvas | 1/1 | Complete | 2026-08-28 |
| 15. Interactive Sandbox | 1/1 | Complete | 2026-08-28 |
| 16. Radar & Enclave Modal | 1/1 | Complete | 2026-08-28 |
| 17. Telemetry Table & Navbar | 1/1 | Complete | 2026-08-28 |
| 18. Globals & Root Layout | 1/1 | Complete | 2026-08-28 |
| 19. Executive Dashboard Page | 0/1 | Not started | - |
| 20. Dedicated Pages | 0/1 | Not started | - |
| 21. Playwright E2E Suite | 0/1 | Not started | - |
| 22. Enclave Cert & Verification | 0/1 | Not started | - |
