# AetherRisk: Autonomous TEE-Guarded Cross-Chain Credit & Liquidation Underwriter

## What This Is

AetherRisk is a hybrid institutional decentralized risk underwriting protocol deployed on Creditcoin CC3 EVM Frontier and Ethereum Sepolia. It combines live smart contract execution (`AetherVault4626` ERC-4626 lending desk, `CreditRegistry`, 1-click testnet capital faucet, multi-wallet connectivity) with an instant 30-second zero-wallet judge sandbox powered by Substrate native precompiles (`BlockProver 0xFD2`), AMD SEV-SNP TEE hardware attestation, and Google Gemini AI institutional underwriting copilot.

## Core Value

Eliminate cross-chain oracle sync latency and false liquidations by verifying source-chain transactions synchronously in Creditcoin precompile bytecode within 15 seconds while providing both a live interactive Web3 lending dApp and an effortless judge fast-track simulator.

## Business Context

- **Customer**: Cross-chain institutional borrowers, DeFi prime brokers, DePIN infrastructure providers, and decentralized lending pools.
- **Revenue Model**: Dynamic interest-rate spread in ERC-4626 multi-tranche lending vaults and liquidation underwriting protocol fees.
- **Success Metric**: Sub-15s cross-chain attestation latency, active on-chain vault positions, and zero false liquidations across multi-chain loan positions.
- **Strategy Notes**: Target Grand-Prize for BUIDL CTC 2026 Fall (Track AI, sponsored by Creditcoin & Credit Labs).

## Milestone History

- **Milestone v1.0 (Core Engine & Foundation)**: Completed (Phases 01–22) — 5 Smart Contracts deployed, Foundry 17/17 tests passing, PostgreSQL Supabase DB seeded with 18 operations, Next.js monolith, and in-browser 30s sandbox.
- **Milestone v2.0 (Institutional Polish & Gemini Copilot)**: Completed (Phases 23–26) — Copywriting sanitization, Verified Contracts Hub Modal with `createPortal`, Google Gemini API Underwriting Copilot, Playwright 4/4 passing tests.
- **Milestone v3.0 (Remnara-Grade Hybrid Web3 dApp)**: Active / In Progress (Phases 27–31).

## Active Requirements (Milestone v3.0)

- [ ] **W3-01**: Multi-wallet Web3 provider supporting EIP-6963 (MetaMask, Rabby, OKX, Coinbase, Phantom) with automatic Creditcoin CC3 (`102031`) network switching.
- [ ] **W3-02**: 1-Click Institutional Capital Faucet minting 10,000 `iUSDC` testnet tokens from `MockInstitutionalUSDC.sol` (`0xb906...`).
- [ ] **W3-03**: Live Institutional Lending Desk (`/vault`) connected to `AetherVault4626.sol` (`0xD9B3...`) supporting Deposit, Borrow, Repay, and Withdraw with live balance tracking.
- [ ] **W3-04**: Live On-Chain Credit Passport (`/passport`) reading borrower reputation and TEE hardware signer verification directly from `CreditRegistry.sol` (`0x5923...`).
- [ ] **W3-05**: Remnara-inspired Institutional Compliance Modal & Dual-Mode UI Switcher (`[ ⚡ Live Web3 dApp ]` ⟷ `[ 🔬 Zero-Wallet Sandbox ]`).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 15 Full-Stack Monolith | Avoids fragile separate Python/Docker microservices that fail on Vercel deployment | Verified & Stable |
| TEE-Lite Progressive Trust Boundary | Provides immediate on-chain cryptographic safety via `ecrecover` while displaying full hardware quote off-chain | Verified |
| Triple-Layer Proof Resilience | Prevents demo-day failures if live RPC or ProofBuilder times out | Verified |
| Foundry Smart Contract Toolchain | Provides high-speed testing, trace diagnostics, and deterministic deployment scripts | 17/17 Passed |
| Remnara-Grade Hybrid Architecture | Combines real Web3 wallet/contract transactions with instant judge demo sandbox | Milestone v3.0 Focus |

---
*Last updated: 2026-08-29 after Milestone v2.0 archive and Milestone v3.0 initialization*
