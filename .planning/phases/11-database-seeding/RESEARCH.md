# Phase 11 Research: Database Seeding Execution (`scripts/seed-db.ts`)

## Objective
Implement and verify `scripts/seed-db.ts`, the database migration and pre-seeding pipeline that guarantees the **Zero-Empty-State Law** for AetherRisk by populating PostgreSQL (via Prisma) with 3 institutional personas, 18 verified historical operations, cached Attestcoin inclusion proofs, and TEE enclave signers.

## Seeding Pipeline Structure

### 1. Persona & Borrower Ingestion
- Ingests 3 core simulation personas (`Apex Commodities Corp`, `SolarGrid Africa Ltd`, `Alpha Quant Arbitrage`) with credit metrics, baseline scores, debt, and collateral.
- Dynamically creates/upserts any additional institutional borrowers associated with `PRESEEDED_OPERATIONS` to guarantee relational integrity.

### 2. Operations Seeding (18 Records)
- Upserts each of the 18 historical operations into the `Operation` table linked to its `Borrower` record.
- Sets BigInt `blockHeight`, Decimal fields (`provenAmountUsd`, `proverLatencySec`), enums, and timestamps.

### 3. Cached Proof Generation
- Inserts `CachedProof` records with Merkle sibling arrays, lower endpoint digests, and continuity roots.

### 4. TEE Enclave Signer Authorization
- Inserts default hardware remote attestation signer (`0x70997970C51812dc3A010C7d01b50e0d17dc79C8`, `AMD-SEV-SNP-PHALA-DSTACK-NODE-01`).

## Verification Gate
- `scripts/seed-db.ts` executes cleanly with `tsx scripts/seed-db.ts` (or `pnpm exec tsx scripts/seed-db.ts`).
- Monolith build (`rtk pnpm build`) passes with zero errors.
