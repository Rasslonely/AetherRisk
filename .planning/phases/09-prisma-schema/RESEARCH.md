# Phase 09 Research: Prisma Database Schema & Client Singleton

## Objective
Implement `prisma/schema.prisma` with PostgreSQL models (`Borrower`, `Operation`, `CachedProof`, `EnclaveSigner`), exact enum definitions (`OperationType`, `OperationStatus`, `ProofSource`), indexed queries, decimal precision, and the Prisma client singleton in `lib/db.ts`.

## Schema Specifications

### 1. Data Models & Precision
- **Borrower**:
  - Credit metrics: `creditScore` (Int), `maxCreditLineUsd` (`@db.Decimal(18, 2)`), `currentDebtUsd` (`@db.Decimal(18, 2)`), `collateralUsd` (`@db.Decimal(18, 2)`), `healthFactor` (`@db.Decimal(5, 2)`), `currentApyBps` (Int), `liquidationRisk` (Boolean).
- **Operation**:
  - Attestation feed: `txCode` (Unique String, e.g., `#TX-901`), `sourceChainId` (`11155111`), `chainKey` (`1`), `provenAmountUsd` (`@db.Decimal(18, 2)`), `proverLatencySec` (`@db.Decimal(4, 1)`), `creditScoreDelta`, `oldScore`, `newScore`, `oldApyBps`, `newApyBps`.
  - Merkle fields: `merkleRoot`, `continuityDigest`, `sourceTxHash`, `creditcoinTxHash`.
  - Relation: `Borrower.operations` via `borrowerId`.
- **CachedProof**:
  - Triple-Layer Proof Cache: `txHash` (Unique), `encodedTransactionHex` (Text), `siblingsJson` (Json), `lowerEndpointDigest`, `continuityRootsJson` (Json).
- **EnclaveSigner**:
  - TEE Trust Boundary: `signerAddress` (Unique), `hardwareQuoteId`, `measurementHash`, `isActive`.

### 2. Client Singleton (`lib/db.ts`)
- Configured with `globalThis` caching to prevent multiple instances during Next.js Hot Module Replacement (HMR).

## Verification Gate
- `pnpm prisma generate` produces valid TypeScript types for `@prisma/client`.
- `lib/db.ts` cleanly exports `prisma` client instance.
- Monolith build (`pnpm build`) succeeds.
