# AETHERRISK: GRAND-PRIZE EXECUTION TRACKER
> **TPM Core v6.0** | **Dual-Engine Grand-Prize Execution Protocol**
> **Total Phases:** 22 | **Stages:** 5 | **Status:** 13/22 Complete | **Worker Completion Gate:** Playwright E2E PASS

---

## STAGE 1: HARD-TECH PRIMITIVE CORE (Engine 1) — Phases 01–07 (COMPLETE ✓)

- [x] **Phase 01** → `contracts/foundry.toml` + `contracts/src/interfaces/INativeQueryVerifier.sol`
  - **TARGET**: Foundry workspace config + BlockProver Precompile `0xFD2` Solidity interface.
  - **WHY FIRST**: Every contract imports this interface. Zero forward dependencies.
  - **ACCEPTANCE**: `forge build` passes clean in `contracts/`.

- [x] **Phase 02** → `contracts/src/interfaces/IChainInfo.sol` + `contracts/src/interfaces/IEvmV1Decoder.sol`
  - **TARGET**: ChainInfo Precompile `0xFD3` interface + EvmV1Decoder `0x731c...F9f` decoding interface.
  - **WHY**: `AetherRiskASC.sol` imports both to extract `receipt.status` and `chainKey` metadata.
  - **ACCEPTANCE**: `forge build` passes clean with all 3 interfaces compiled.

- [x] **Phase 03** → `contracts/src/AetherRiskASC.sol`
  - **TARGET**: The core Attestcoin Smart Contract calling `BlockProver 0xFD2`.
  - **IMPLEMENTS**: `verifyAndProcessCreditEvent()` → `staticcall(0xFD2)` → `EvmV1Decoder.decode()` → validate `receipt.status == 0x1` → emit `VerifiedCrossChainFact`.
  - **REPLAY PROTECTION**: `mapping(bytes32 => bool) processedQueryHashes`.
  - **ACCEPTANCE**: `forge test --match-contract AetherRiskASCTest` passes with replay guard and failed-tx-rejection tests.

- [x] **Phase 04** → `contracts/src/CreditRegistry.sol`
  - **TARGET**: On-chain credit score registry with TEE-Lite trust boundary.
  - **IMPLEMENTS**: `authorizedEnclaveSigners` mapping, `EnclaveSignerUsed` + `CreditScoreUpdated` events, `ecrecover` EIP-712 signature validation, `onlyEnclave` modifier.
  - **ACCEPTANCE**: `forge test --match-contract CreditRegistryTest` passes with unauthorized-signer-rejection and duplicate-mutation-rejection.

- [x] **Phase 05** → `contracts/src/AetherVault4626.sol`
  - **TARGET**: ERC-4626 dynamic-rate institutional lending vault.
  - **IMPLEMENTS**: `deposit()`, `withdraw()`, `convertToShares()`, `convertToAssets()`, dynamic APY curves driven by `CreditRegistry.getScore()`. Score ≥ 800 → 4.1% APY, Score ≤ 650 → 9.2% APY.
  - **ACCEPTANCE**: `forge test` with deposit/withdraw round-trip and rate-adjustment-on-score-change.

- [x] **Phase 06** → `contracts/src/SepoliaLendingEmitter.sol`
  - **TARGET**: Source chain event emitter deployed to Ethereum Sepolia.
  - **IMPLEMENTS**: `simulateRepayment()`, `simulateCollateralAdd()`, emitting `LoanRepaid(address borrower, uint256 amount, uint256 nonce)` and `CollateralAdded(address borrower, uint256 amount, address asset)`.
  - **ACCEPTANCE**: `forge test` passes. Events match ABI expected by `EvmV1Decoder`.

- [x] **Phase 07** → `contracts/script/DeployCreditcoin.s.sol` + `contracts/script/DeploySepolia.s.sol`
  - **TARGET**: Foundry deployment scripts for CC3 Testnet and Sepolia.
  - **IMPLEMENTS**: Deterministic `CREATE2` deployment to expected addresses in ENV_REGISTRY.md. Registers initial `authorizedEnclaveSigners` in `CreditRegistry`.
  - **ACCEPTANCE**: Both scripts compile. Dry-run with `forge script --dry-run` produces expected bytecode.

---

## STAGE 2: MONOLITH SCAFFOLD & ZERO-STATE DATABASE — Phases 08–11 (COMPLETE ✓)

- [x] **Phase 08** → `package.json` + `tsconfig.json` + `next.config.ts` + `tailwind.config.ts`
  - **TARGET**: Next.js 15 monolith scaffold with all pinned dependencies from ARCHITECTURE.md §2.
  - **IMPLEMENTS**: Exact `package.json` from DEVOPS_BOM.md. Tailwind v4 config. Next.js 15 App Router config with `serverExternalPackages: ['@prisma/client', 'prisma']`.
  - **ACCEPTANCE**: `pnpm install && pnpm next build` compiles clean (no pages yet, just scaffold).

- [x] **Phase 09** → `prisma/schema.prisma` + `lib/db.ts`
  - **TARGET**: Complete Prisma schema from SYSTEM_INTERFACES.md §1 + Prisma client singleton.
  - **IMPLEMENTS**: `Borrower`, `Operation`, `CachedProof`, `EnclaveSigner` models with all enums (`OperationType`, `OperationStatus`, `ProofSource`), all indices, and all `@db.Decimal` precision fields.
  - **ACCEPTANCE**: `pnpm prisma generate` and `pnpm prisma db push` succeed against Supabase.

- [x] **Phase 10** → `lib/types.ts` + `lib/telemetry-seed.ts`
  - **TARGET**: Full TypeScript domain contracts from SYSTEM_INTERFACES.md §2 + pre-seeded 18 operations & 3 personas from §3.
  - **IMPLEMENTS**: ALL interfaces (`AttestcoinProofPayload`, `ResolvedProof`, `Eip712RiskPayload`, `EnclaveSignature`, `OperationRecord`, `SimulationPersona`) and ALL 18 `PRESEEDED_OPERATIONS` + 3 `SIMULATION_PERSONAS` records. ZERO placeholders.
  - **ACCEPTANCE**: TypeScript compiles clean. `PRESEEDED_OPERATIONS.length === 18`.

- [x] **Phase 11** → `scripts/seed-db.ts`
  - **TARGET**: Database seeder script from DEVOPS_BOM.md §2.
  - **IMPLEMENTS**: Upserts all 3 borrower personas + all 18 operations with `BigInt` block heights. Logs success count.
  - **ACCEPTANCE**: `pnpm tsx scripts/seed-db.ts` populates DB. `SELECT COUNT(*) FROM "Operation"` returns 18.

---

## STAGE 3: SDK INTEGRATION, PROOF RESOLVER & API CORE — Phases 12–13 (COMPLETE ✓)

- [x] **Phase 12** → `app/api/operations/route.ts` + `app/api/proof/route.ts` + `app/api/simulate/route.ts`
  - **TARGET**: All 3 Next.js native API route handlers from SYSTEM_INTERFACES.md §4.
  - **IMPLEMENTS**:
    - `GET /api/operations` → Returns all operations from DB (pre-seeded + live), sorted by timestamp DESC.
    - `POST /api/proof` → Executes Triple-Layer Proof Resolution via `lib/proof-resolver.ts`.
    - `POST /api/simulate` → Executes sandbox time-travel simulation, calls proof resolver, returns full `teeMutation` payload.
  - **DEPENDS ON**: Phase 09 (Prisma), Phase 10 (types), Phase 13 (proof-resolver.ts).
  - **ACCEPTANCE**: `curl localhost:3000/api/operations` returns `count: 18` with real data.

- [x] **Phase 13** → `lib/attestcoin.ts` + `lib/proof-resolver.ts` + `lib/tee-signer.ts`
  - **TARGET**: Core business logic libraries.
  - **IMPLEMENTS**:
    - `attestcoin.ts`: `@gluwa/usc-sdk` wrapper with `ProofBuilder`, `PrecompileChainInfoProvider`, `PrecompileBlockProver`.
    - `proof-resolver.ts`: Triple-Layer Resilience Engine (Live 5s timeout → Cached Real Proof from DB → Structural Mock). Returns `ResolvedProof` with `source` badge.
    - `tee-signer.ts`: Generates EIP-712 typed data signatures using `viem/accounts` for the enclave signer key. Produces `EnclaveSignature` payloads.
  - **ACCEPTANCE**: Unit-testable. `resolveProof()` returns valid `ResolvedProof` even when live path times out.

---

## STAGE 4: PREMIUM UI, 4-PHASE STEPPER & JUDGE SANDBOX — Phases 14–20

- [x] **Phase 14** → `app/components/visual-pipeline-canvas.tsx`
  - **TARGET**: Real-time 4-phase attestation stepper visualizer.
  - **IMPLEMENTS**: Animated pipeline showing:
    - Phase 1: Sepolia Tx Detected [0.0s–0.5s]
    - Phase 2: Waiting for Attestation [0.5s–8.0s]
    - Phase 3: Merkle Proof Generated [8.0s–10.0s]
    - Phase 4: Precompile 0xFD2 Verified [10.0s–12.4s] ✅
  - **FRAMER MOTION**: Animated progress bars with realistic timing. Badge pulse on verification.
  - **ACCEPTANCE**: Component renders all 4 phases. Progress bar animates from 0% to 100%.

- [x] **Phase 15** → `app/components/interactive-sandbox.tsx`
  - **TARGET**: ENGINE 2 — The 30-Second Zero-Wallet Judge Simulator.
  - **IMPLEMENTS**:
    - Persona selector (3 pre-built personas from telemetry-seed.ts).
    - BEFORE state card (🔴 Danger: Score 620, APY 9.2%, Liquidation Warning).
    - [Simulate Repayment] button triggering `POST /api/simulate`.
    - Embedded `visual-pipeline-canvas.tsx` showing proof verification progress.
    - AFTER state card morph (🟢 Healthy: Score 810, APY 4.1%, +$450k credit, ALL CLEAR).
    - Score counter animation (620→810 with cubic-bezier easing, 1.5s).
    - Health bar fill animation (40%→92% with gradient red→amber→green).
    - Precompile badge pulse: "✅ Verified by Native Precompile 0xFD2".
    - Proof source transparency badge: `🟢 LIVE_ATTESTCOIN` or `🟡 CACHED_REAL_PROOF (Sep 10 2026)`.
    - Explorer link badges for both Sepolia and CC3 transactions.
  - **IN-BROWSER CRYPTO**: Ephemeral keypair via `viem/accounts/privateKeyToAccount`. Static `eth_call` to CC3 RPC for precompile verification.
  - **ACCEPTANCE**: Full BEFORE→AFTER transition completes in < 15 seconds. Score reads "810" at end.

- [ ] **Phase 16** → `app/components/risk-metric-radar.tsx` + `app/components/enclave-cert-modal.tsx`
  - **TARGET**: Bayesian health factor radar chart + TEE attestation certificate modal.
  - **IMPLEMENTS**:
    - `risk-metric-radar.tsx`: Radar/gauge visualization of Health Factor (0.87→1.84), Credit Score, APY, Collateral Ratio, Debt-to-Income.
    - `enclave-cert-modal.tsx`: Modal showing off-chain TEE attestation certificate JSON (`public/enclave-attestation.json`) with hardware quote ID, measurement hash, signer derivation, Phala explorer link.
  - **ACCEPTANCE**: Radar chart updates dynamically during sandbox simulation. Certificate modal opens and displays formatted JSON.

- [ ] **Phase 17** → `app/components/telemetry-table.tsx` + `app/components/navbar.tsx`
  - **TARGET**: Pre-seeded telemetry operations table + navigation bar.
  - **IMPLEMENTS**:
    - `telemetry-table.tsx`: Renders 18 operations from `GET /api/operations`. Columns: TxCode, Borrower, Type, Amount, Score Delta (green/red badge), Status, Proof Source, Latency, Explorer Links. Sortable by timestamp. `data-testid="telemetry-table"` + `data-testid="operation-row"` for Playwright.
    - `navbar.tsx`: Navigation between Home `/`, Operations `/operations`, Sandbox `/sandbox`. Active state highlight. AetherRisk logo + "BUIDL CTC 2026" badge.
  - **ACCEPTANCE**: Table shows ≥ 18 rows with zero empty states. All explorer links are clickable.

- [ ] **Phase 18** → `app/globals.css` + `app/layout.tsx`
  - **TARGET**: Design system globals + root layout with providers.
  - **IMPLEMENTS**:
    - `globals.css`: Tailwind v4 imports, state transition keyframes (`scoreReveal`, `badgePulse`, `healthBarFill`), color system (Danger: `hsl(0,85%,8%)`, Transition: `hsl(210,60%,12%)`, Healthy: `hsl(145,85%,8%)`), typography (Inter/Outfit from Google Fonts).
    - `layout.tsx`: HTML head with SEO meta tags, Google Fonts link, body wrapper, `navbar.tsx`, and children slot.
  - **ACCEPTANCE**: `pnpm next dev` renders styled layout with navbar.

- [ ] **Phase 19** → `app/page.tsx`
  - **TARGET**: Executive Dashboard & Pitch Viewport (Landing Page).
  - **IMPLEMENTS**:
    - Hero section with AetherRisk tagline: "Autonomous TEE-Guarded Cross-Chain Credit & Liquidation Underwriter".
    - Key metrics cards: Total Volume Proven ($8.4M), Average Proof Latency (12.4s), Active Borrowers (18), Highest Score Delta (+190).
    - Embedded compact `interactive-sandbox.tsx` preview with "Open Full Sandbox →" CTA.
    - Recent 5 operations from `telemetry-table.tsx` (compact view).
    - Tech stack badges: Creditcoin CC3 | Attestcoin Protocol | Phala TEE | ERC-4626.
  - **ACCEPTANCE**: Page loads with populated metrics. No empty states.

- [ ] **Phase 20** → `app/operations/page.tsx` + `app/sandbox/page.tsx`
  - **TARGET**: Full-page telemetry explorer + dedicated full-screen sandbox.
  - **IMPLEMENTS**:
    - `operations/page.tsx`: Full-width `telemetry-table.tsx` with filtering by OperationType and ProofSource. Page header: "Live Operations Feed — 18 of 18 Verified".
    - `sandbox/page.tsx`: Full-screen `interactive-sandbox.tsx` with sidebar persona selector, main viewport for BEFORE/AFTER cards, and bottom panel for `visual-pipeline-canvas.tsx`.
  - **ACCEPTANCE**: `/operations` shows ≥ 18 rows. `/sandbox` completes full simulation flow.

---

## STAGE 5: LIVE BROWSER E2E VERIFICATION GATE (Anti-Hallucination Gate) — Phases 21–22

- [ ] **Phase 21** → `tests/e2e/live-judge-flow.spec.ts` + `playwright.config.ts`
  - **TARGET**: Strict Playwright E2E test suite from DEVOPS_BOM.md §3.
  - **IMPLEMENTS**:
    - Test 1 (Zero-Empty-State Law): Navigate to `/operations`, assert `[data-testid="operation-row"]` count ≥ 10, verify explorer link presence, assert zero console errors.
    - Test 2 (30-Second Sandbox): Navigate to `/sandbox`, assert initial score "620", click `[data-testid="simulate-repay-btn"]`, wait for `[data-testid="precompile-verified-badge"]` (timeout: 15s), assert final score "810", assert APY "4.1%", assert zero console errors.
  - **ACCEPTANCE**: `pnpm playwright test` passes ALL assertions against `next build && next start`.

- [ ] **Phase 22** → `public/enclave-attestation.json` + `scripts/pre-cache-proofs.ts` + Final Verification
  - **TARGET**: Static TEE certificate + T-48h proof caching script + final deployment verification.
  - **IMPLEMENTS**:
    - `enclave-attestation.json`: Phala dstack hardware attestation certificate JSON with `hardwareQuoteId`, `measurementHash`, `signerDerivation`, `enclaveVersion`, `timestamp`.
    - `pre-cache-proofs.ts`: Script that executes 20 Sepolia transactions, waits for CC3 attestation, generates real proofs via `@gluwa/usc-sdk`, and populates `CachedProof` table in DB.
  - **ACCEPTANCE**: Certificate displays in `enclave-cert-modal.tsx`. Pre-cache script runs without error (against live testnet, T-48h before demo).

---

## 🚨 COMPLETION GATE (STRICT — NO EXCEPTIONS)

```
┌─────────────────────────────────────────────────────────────────────┐
│ WORKER MAY NOT DECLARE 100% COMPLETE UNTIL:                         │
│                                                                     │
│ 1. ✅ forge test passes ALL contract tests (Phases 03–06)           │
│ 2. ✅ pnpm prisma db push succeeds (Phase 09)                      │
│ 3. ✅ pnpm tsx scripts/seed-db.ts populates 18 operations (Ph.11)  │
│ 4. ✅ GET /api/operations returns count: 18 (Phase 12)             │
│ 5. ✅ /sandbox completes BEFORE→AFTER transition (Phase 15)        │
│ 6. ✅ /operations shows ≥ 18 rows with explorer links (Phase 17)   │
│ 7. ✅ pnpm playwright test PASSES ALL 2 TESTS (Phase 21)           │
│ 8. ✅ Vercel deployment URL is live and accessible (Phase 22)       │
│ 9. ✅ Git commit & push clean for every completed phase             │
└─────────────────────────────────────────────────────────────────────┘
```
