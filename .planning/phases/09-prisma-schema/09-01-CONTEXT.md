# Phase 09 Context: Prisma Database Schema & Client Singleton

## Purpose
Phase 09 structures the persistent database layer and telemetry schema for AetherRisk, powering the live operations table, zero-empty-state historical data, cached Attestcoin inclusion proofs, and TEE signer authorizations.

## References
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md` (Requirement: `DATA-01`)
- `.planning/ROADMAP.md` (Phase 9)
- `0_resource/SYSTEM_INTERFACES.md` §1
- `0_resource/ENV_REGISTRY.md`

## Target Deliverables
1. `prisma/schema.prisma` — Complete Prisma schema containing `Borrower`, `Operation`, `CachedProof`, and `EnclaveSigner`.
2. `lib/db.ts` — Global singleton wrapper around `PrismaClient`.
