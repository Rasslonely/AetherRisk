# AetherRisk: Autonomous TEE-Guarded Cross-Chain Credit & Liquidation Underwriter

## What This Is

AetherRisk is an autonomous institutional risk and liquidation underwriter protocol deployed on Creditcoin CC3 EVM Frontier and Ethereum Sepolia. It replaces vulnerable 15–45 minute multi-sig oracle relay bottlenecks with sub-15s synchronous cryptographic verification via Creditcoin's native Substrate precompiles (`BlockProver 0xFD2` & `ChainInfo 0xFD3`), coupled with hardware-isolated confidential Bayesian risk kernels (AMD SEV-SNP via Phala dstack) that dynamically adjust borrower borrowing limits, APYs, and liquidation thresholds across chains.

## Core Value

Eliminate cross-chain oracle sync latency and false liquidations by verifying source-chain transactions synchronously in Creditcoin precompile bytecode within 15 seconds while evaluating credit risk deterministically inside hardware TEE enclaves.

## Business Context

- **Customer**: Cross-chain institutional borrowers, DeFi prime brokers, DePIN infrastructure providers, and decentralized lending pools.
- **Revenue Model**: Dynamic interest-rate spread in ERC-4626 multi-tranche lending vaults and liquidation underwriting protocol fees.
- **Success Metric**: Sub-15s cross-chain attestation latency and zero false liquidations across multi-chain loan positions.
- **Strategy Notes**: Grand-Prize target for BUIDL CTC 2026 Fall (Track AI, sponsored by Creditcoin & Credit Labs).

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **CORE-01**: Low-level Solidity interface and integration with Creditcoin BlockProver Precompile (`0x0000000000000000000000000000000000000FD2`).
- [ ] **CORE-02**: Integration with ChainInfo Precompile (`0xFD3`) and EvmV1Decoder (`0x731c...F9f`) to parse Ethereum Sepolia transaction logs and validate `receipt.status == 0x1`.
- [ ] **CORE-03**: `AetherRiskASC.sol` implementation with replay protection (`processedQueryHashes`) emitting `VerifiedCrossChainFact`.
- [ ] **CORE-04**: `CreditRegistry.sol` implementing TEE-Lite pattern with `authorizedEnclaveSigners` mapping and `ecrecover` EIP-712 signature verification.
- [ ] **CORE-05**: `AetherVault4626.sol` dynamic-rate institutional lending vault with borrower interest curves tied to real-time credit score updates.
- [ ] **CORE-06**: `SepoliaLendingEmitter.sol` source chain contract emitting `LoanRepaid` and `CollateralAdded` topics on Ethereum Sepolia.
- [ ] **DATA-01**: Next.js 15 App Router monolith scaffold with Prisma ORM and Supabase PostgreSQL backend.
- [ ] **DATA-02**: 18 pre-seeded historical operations and 3 institutional borrower personas (Zero-Empty-State Law).
- [ ] **DATA-03**: Triple-Layer Proof Resilience engine (Live `@gluwa/usc-sdk` -> Cached Real Supabase Proofs -> Structural Mock).
- [ ] **SANDBOX-01**: In-browser 30-second zero-wallet Judge Simulator with persona selector and time-travel controls.
- [ ] **SANDBOX-02**: Real-time 4-phase attestation progress visualizer with Framer Motion animations and state transition morphing (Danger 🔴 620 -> Healthy 🟢 810).
- [ ] **SANDBOX-03**: Bayesian Health Factor Radar & TEE Enclave Attestation Certificate inspection modal.
- [ ] **TEST-01**: Playwright E2E automated test suite validating zero-empty-state operations feed and full sandbox transition flow.

### Out of Scope

- **Full On-Chain AMD SEV-SNP Quote Verification on CC3 Testnet**: Substrate testnet lacks custom hardware quote verification precompile; implemented via TEE-Lite registered signer model with Level 3 mainnet upgrade roadmap.
- **Complex Multi-Hop Cross-Chain Bridges**: Focused strictly on Ethereum Sepolia to Creditcoin CC3 direct attestation.
- **Generic LLM Prompt Wrappers**: Risk scoring is executed purely via deterministic Bayesian math inside confidential enclaves, not unstructured LLM chat prompts.

## Context

- **Source Chain**: Ethereum Sepolia (`chainId: 11155111`, `chainKey: 1`).
- **Destination Chain**: Creditcoin CC3 EVM Frontier Testnet (`chainId: 102031`).
- **Cryptographic Grounding**: Merkle inclusion proofs and continuity root verification verified directly in Substrate runtime via EVM staticcalls.
- **Target Monolith**: Single Next.js 15 App Router deployment on Vercel containing both UI, API route handlers, and database connection pooling.

## Constraints

- **EVM Runtime**: Creditcoin CC3 uses Substrate EVM Frontier with Solidity `0.8.24` and `evm_version = "cancun"`/`"shanghai"`.
- **Precompile Address**: `BlockProver` must be called at `0x0000000000000000000000000000000000000FD2`.
- **Pre-Seed Requirement**: Production UI must contain >= 18 verified operations and 3 personas on initial launch.
- **Zero-Wallet Accessibility**: Sandbox simulation must run in-memory using ephemeral private keys without demanding MetaMask popups from judges.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 15 Full-Stack Monolith | Avoids fragile separate Python/Docker microservices that fail on Vercel deployment | — Pending |
| TEE-Lite Progressive Trust Boundary | Provides immediate on-chain cryptographic safety via `ecrecover` while displaying full hardware quote off-chain | — Pending |
| Triple-Layer Proof Resilience | Prevents demo-day failures if live RPC or ProofBuilder times out | — Pending |
| Foundry Smart Contract Toolchain | Provides high-speed testing, trace diagnostics, and deterministic deployment scripts | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-28 after initialization*
