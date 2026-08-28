# Requirements: AetherRisk

**Defined:** 2026-08-28  
**Core Value:** Eliminate cross-chain oracle sync latency and false liquidations by verifying source-chain transactions synchronously in Creditcoin precompile bytecode within 15 seconds while evaluating credit risk deterministically inside hardware TEE enclaves.

## v1 Requirements

### On-Chain Smart Contracts & Precompiles (CORE) — 100% COMPLETE

- [x] **CORE-01**: Solidity interface `INativeQueryVerifier.sol` matching Creditcoin BlockProver Precompile `0x000...0FD2` with `verifySingle` and `MerkleProofEntry` definitions.
- [x] **CORE-02**: Solidity interfaces `IChainInfo.sol` (`0xFD3`) and `IEvmV1Decoder.sol` (`0x731c...F9f`) for block height querying and Ethereum transaction/receipt decoding.
- [x] **CORE-03**: `AetherRiskASC.sol` Attestcoin Smart Contract implementing `verifyAndProcessCreditEvent()`, calling `0xFD2`, validating `receipt.status == 0x1`, and enforcing replay protection via `processedQueryHashes`.
- [x] **CORE-04**: `CreditRegistry.sol` implementing TEE-Lite pattern with `authorizedEnclaveSigners` mapping, `ecrecover` signature validation, and `EnclaveSignerUsed` audit events.
- [x] **CORE-05**: `AetherVault4626.sol` ERC-4626 multi-tranche lending vault with dynamic interest rates mapped to borrower credit ratings ($800+ \to 4.1\%$, $\le 650 \to 9.2\%$).
- [x] **CORE-06**: `SepoliaLendingEmitter.sol` on Ethereum Sepolia emitting `LoanRepaid` and `CollateralAdded` events.
- [x] **CORE-07**: Foundry deployment scripts `DeployCreditcoin.s.sol` and `DeploySepolia.s.sol` supporting deterministic address deployment and enclave signer registration.

### Monolith Backend, Data & Seeding (DATA)

- [x] **DATA-01**: Next.js 15 App Router monolith configuration with TypeScript, Tailwind CSS v4, Prisma ORM, and Supabase PostgreSQL schema (`Borrower`, `Operation`, `CachedProof`, `EnclaveSigner`).
- [x] **DATA-02**: 18 verified pre-seeded historical operations and 3 simulation personas seeded into database (`scripts/seed-db.ts`) fulfilling Zero-Empty-State Law.
- [ ] **DATA-03**: Core libraries `lib/attestcoin.ts` (`@gluwa/usc-sdk` wrapper), `lib/proof-resolver.ts` (Triple-Layer Resilience), and `lib/tee-signer.ts` (EIP-712 typed signing).
- [ ] **DATA-04**: Native Next.js API route handlers: `GET /api/operations` (telemetry feed), `POST /api/proof` (proof resolver), and `POST /api/simulate` (sandbox execution).

### 30-Second Zero-Wallet Judge Sandbox & Telemetry (SANDBOX)

- [ ] **SANDBOX-01**: `interactive-sandbox.tsx` interactive simulator with 3 pre-built personas (*Apex Commodities*, *SolarGrid Africa*, *Alpha Quant*), zero-wallet ephemeral signing, and instant time-travel execution.
- [ ] **SANDBOX-02**: `visual-pipeline-canvas.tsx` 4-phase attestation progress visualizer with realistic timing (Phase 1-4) and high-contrast state transition (Danger 🔴 620 $\to$ Healthy 🟢 810).
- [ ] **SANDBOX-03**: `risk-metric-radar.tsx` visualizing Bayesian health factors and dynamic APY spreads + `enclave-cert-modal.tsx` rendering Phala dstack hardware attestation certificate JSON.
- [ ] **SANDBOX-04**: `telemetry-table.tsx` operations feed rendering >= 18 rows with status badges, score deltas, latency, and real explorer links to Subscan & Etherscan.
- [ ] **SANDBOX-05**: Full-width pages: `/` (Executive Pitch & Dashboard), `/operations` (Live Telemetry Feed), `/sandbox` (Dedicated Judge Simulator).

### E2E Testing & Quality Gates (TEST)

- [x] **TEST-01**: Foundry unit and integration test suite passing all assertions for `AetherRiskASC.t.sol` and `CreditRegistry.t.sol`.
- [ ] **TEST-02**: Playwright E2E test suite (`tests/e2e/live-judge-flow.spec.ts`) validating Zero-Empty-State Law (>= 10 rows on `/operations`) and complete sandbox state transition in < 15s.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Complete ✓ |
| CORE-02 | Phase 2 | Complete ✓ |
| CORE-03 | Phase 3 | Complete ✓ |
| CORE-04 | Phase 4 | Complete ✓ |
| CORE-05 | Phase 5 | Complete ✓ |
| CORE-06 | Phase 6 | Complete ✓ |
| CORE-07 | Phase 7 | Complete ✓ |
| DATA-01 | Phase 8 & 9 | Complete ✓ |
| DATA-02 | Phase 10 & 11 | Complete ✓ |
| DATA-03 | Phase 13 | Pending |
| DATA-04 | Phase 12 | Pending |
| SANDBOX-01 | Phase 15 | Pending |
| SANDBOX-02 | Phase 14 | Pending |
| SANDBOX-03 | Phase 16 | Pending |
| SANDBOX-04 | Phase 17 | Pending |
| SANDBOX-05 | Phase 18, 19, 20 | Pending |
| TEST-01 | Phase 3, 4, 5, 6, 7 | Complete ✓ |
| TEST-02 | Phase 21 & 22 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Completed: 10
- Unmapped: 0 ✓

---
*Requirements defined: 2026-08-28*
*Last updated: 2026-08-28 after Phase 10 completion*
