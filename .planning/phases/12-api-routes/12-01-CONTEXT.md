# Phase 12 Context: Next.js Native API Route Handlers

## Purpose
Phase 12 begins **Stage 3 (SDK Integration, Proof Resolver & API Core)** by implementing the 3 serverless API endpoints required by the telemetry feed, proof inspection tools, and interactive 30-second sandbox.

## References
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md` (Requirement: `DATA-04`)
- `.planning/ROADMAP.md` (Phase 12)
- `0_resource/SYSTEM_INTERFACES.md` §4
- `0_resource/AETHERRISK_GOD_TIER_SPEC.md` §7 & §8
- `lib/types.ts`, `lib/telemetry-seed.ts`, `lib/db.ts`

## Target Deliverables
1. `app/api/operations/route.ts` — Telemetry operations list endpoint (`GET`).
2. `app/api/proof/route.ts` — Triple-layer proof resolver endpoint (`POST`).
3. `app/api/simulate/route.ts` — Sandbox execution & EIP-712 TEE mutation endpoint (`POST`).
