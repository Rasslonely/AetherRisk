---
phase: 12-api-routes
plan: 01
subsystem: api-routes
tags: [nextjs, api-routes, rest, proof-resolver, sandbox-simulator, eip-712, telemetry]

requires:
  - phase: 09-prisma-schema
    provides: "Prisma client and schema"
  - phase: 10-domain-models
    provides: "lib/types.ts and lib/telemetry-seed.ts"
provides:
  - "GET /api/operations endpoint with Zero-Empty-State fallback"
  - "POST /api/proof endpoint with Triple-Layer Proof Resolution"
  - "POST /api/simulate endpoint with Bayesian risk kernel and EIP-712 TEE hardware attestation signing"
  - "Verified production build compilation for all routes"
affects: [13-sdk-wrapper, 14-stepper-canvas, 15-judge-sandbox, 17-telemetry-table]

actuals:
  tokens: 3100
  tasks: 3
  commits: 1

tech-stack:
  added: [app/api/operations/route.ts, app/api/proof/route.ts, app/api/simulate/route.ts]
  patterns: [Triple-Layer Proof Resolver, Zero-Empty-State Law, EIP-712 Hardware Enclave Signing]

key-files:
  created:
    - app/api/operations/route.ts
    - app/api/proof/route.ts
    - app/api/simulate/route.ts
  modified: []

key-decisions:
  - "Enforced Zero-Empty-State fallback in GET /api/operations so database disconnection never yields empty tables"
  - "Implemented EIP-712 typed signing in POST /api/simulate matching CreditRegistry.sol domain and CreditScoreUpdate types"
  - "Handled BigInt blockHeight serialization cleanly in JSON responses"

patterns-established:
  - "Native Next.js 15 App Router serverless route handlers"

requirements-completed:
  - DATA-04

coverage:
  - id: D1
    description: "Next.js native API route handlers"
    requirement: "DATA-04"
    verification:
      - kind: unit
        ref: "rtk pnpm build"
        status: pass
    human_judgment: false

duration: 4min
completed: 2026-08-28
status: complete
---

# Phase 12: Next.js Native API Route Handlers Summary

**Implemented all three Next.js 15 native App Router API endpoints (`/api/operations`, `/api/proof`, `/api/simulate`), establishing the core backend API for the live telemetry stream, cryptographic proof resolution, and 30-second sandbox risk simulation.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-08-28T18:13:12Z
- **Completed:** 2026-08-28T18:16:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- **`GET /api/operations`** ([`app/api/operations/route.ts`](file:///c:/Farras/Projects/Hackathon/AtherRisk/app/api/operations/route.ts)):
  - Dynamically fetches operations from PostgreSQL ordered by timestamp descending.
  - Formats `BigInt` block heights and decimal values safely.
  - Implements **Zero-Empty-State Law** by falling back seamlessly to `PRESEEDED_OPERATIONS` if the database is offline or unseeded.
- **`POST /api/proof`** ([`app/api/proof/route.ts`](file:///c:/Farras/Projects/Hackathon/AtherRisk/app/api/proof/route.ts)):
  - Executes Triple-Layer Proof Resolution (Database Cache $\to$ Pre-Seeded Proofs $\to$ Deterministic Sandbox Generator).
  - Returns structured `AttestcoinProofPayload` with Merkle roots, siblings, and continuity digests matching Creditcoin precompile `0xFD2`.
- **`POST /api/simulate`** ([`app/api/simulate/route.ts`](file:///c:/Farras/Projects/Hackathon/AtherRisk/app/api/simulate/route.ts)):
  - Evaluates institutional borrower profiles (*Apex Commodities*, *SolarGrid Africa*, *Alpha Quant*).
  - Calculates Bayesian risk delta ($620 \to 810$, $9.2\% \to 4.1\%$ APY, $+\$450\text{k}$ Credit Line).
  - Computes `EIP-712` typed data hash and cryptographic signature (`r, s, v`) using the hardware TEE enclave signer key for on-chain verification in `CreditRegistry.sol`.
- **Verified production build**: `rtk pnpm build` generated all dynamic route handlers (`ƒ /api/operations`, `ƒ /api/proof`, `ƒ /api/simulate`) with 0 errors.

## Files Created

- `app/api/operations/route.ts` - Telemetry feed endpoint.
- `app/api/proof/route.ts` - Proof resolver endpoint.
- `app/api/simulate/route.ts` - Sandbox simulation & EIP-712 signer endpoint.

## Decisions Made

- Added `force-dynamic` export to ensure fresh telemetry querying without static route caching.
- Used `ethers.Signature.from` to extract discrete `r, s, v` cryptographic parameters for direct consumption by smart contract methods.

## Deviations from Plan

None - plan executed cleanly.

## Next Phase Readiness

- Ready for **Phase 13**: `SDK Wrapper, Triple-Layer Resolver & TEE Signer` (`lib/attestcoin.ts`, `lib/proof-resolver.ts`, `lib/tee-signer.ts`).

---
*Phase: 12-api-routes*
*Completed: 2026-08-28*
