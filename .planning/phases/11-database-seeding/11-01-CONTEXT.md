# Phase 11 Context: Database Seeding Execution (`scripts/seed-db.ts`)

## Purpose
Phase 11 completes **Stage 2 (Monolith API & Database Seeding)** by providing the automated execution script that populates the PostgreSQL database with the complete telemetry state, eliminating cold-start empty tables.

## References
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md` (Requirement: `DATA-02`)
- `.planning/ROADMAP.md` (Phase 11)
- `0_resource/DEVOPS_BOM.md` §2
- `0_resource/SYSTEM_INTERFACES.md` §1, §2, §3
- `lib/types.ts` & `lib/telemetry-seed.ts`

## Target Deliverables
1. `scripts/seed-db.ts` — Comprehensive database seeding automation script.
2. `package.json` — Add `db:seed` script shortcut.
