# Phase 12 Research: Next.js Native API Route Handlers

## Objective
Implement Next.js 15 native API route handlers for AetherRisk:
1. `GET /api/operations`: Telemetry feed querying PostgreSQL with robust fallback to `PRESEEDED_OPERATIONS` to enforce Zero-Empty-State Law.
2. `POST /api/proof`: Triple-Layer Proof Resolver endpoint (DB Cache $\to$ SDK $\to$ Deterministic Mock).
3. `POST /api/simulate`: 30-Second Sandbox execution endpoint returning Bayesian risk mutations, precompile verification results, and EIP-712 TEE signatures.

## Architecture & Design Patterns

### 1. `GET /api/operations` (`app/api/operations/route.ts`)
- Queries Prisma `prisma.operation.findMany({ orderBy: { timestamp: 'desc' }, take: limit })`.
- Handles `BigInt` serialization cleanly (converts `op.blockHeight` to `Number(op.blockHeight)`).
- Fallback: If DB query fails or returns 0 items, returns `PRESEEDED_OPERATIONS` directly with HTTP 200.
- Supports query params: `limit` (default 50), `personaId`, `status`.

### 2. `POST /api/proof` (`app/api/proof/route.ts`)
- Resolves Attestcoin cryptographic inclusion proof for a given `txHash`.
- Checks Prisma `prisma.cachedProof.findUnique({ where: { txHash } })`.
- If not cached, generates deterministic verified proof structure matching precompile `0xFD2` specifications.
- Returns `{ success: true, source: ProofSource, latencyMs: number, data: AttestcoinProofPayload }`.

### 3. `POST /api/simulate` (`app/api/simulate/route.ts`)
- Evaluates the 30-Second Sandbox scenario for a requested persona (`persona-apex`, `persona-solargrid`, `persona-alphafund`).
- Computes Bayesian credit score delta, dynamic APY adjustment, credit line increase, and health factor.
- Computes EIP-712 typed risk mutation digest and signs it with the local TEE enclave private key (`ENCLAVE_SIGNER_PRIVATE_KEY` / fallback deterministic test key).
- Returns the complete multi-step animation payload:
  - `precompileVerification`: `{ precompileAddress: "0x0FD2", verified: true, receiptStatus: "0x1", latencySec: 12.4 }`
  - `teeMutation`: `{ signerAddress, oldScore, newScore, oldApyBps, newApyBps, newCreditLineUsd, healthFactor, signature }`
  - `visualState`: `"HEALTHY"` | `"TRANSITION"`

## Verification Gate
- `rtk pnpm build` compiles cleanly with all 3 API routes.
- API route handlers tested with synthetic requests.
