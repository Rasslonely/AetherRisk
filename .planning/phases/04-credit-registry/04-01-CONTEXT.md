# Phase 04 Context: CreditRegistry & TEE-Lite Trust Boundary

## Purpose
Phase 04 establishes the core on-chain credit registry (`CreditRegistry.sol`) on Creditcoin CC3. It acts as the trust boundary for confidential computing risk kernels, providing verified score and APY parameters consumed by `AetherVault4626.sol` (Phase 05).

## References
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md` (Requirement: `CORE-04`, `TEST-01`)
- `.planning/ROADMAP.md` (Phase 4)
- `.planning/phases/03-aetherrisk-asc/03-01-SUMMARY.md`
- `0_resource/AETHERRISK_GOD_TIER_SPEC.md`
- `0_resource/SYSTEM_INTERFACES.md`

## Target Deliverables
1. `contracts/src/CreditRegistry.sol` — On-chain credit store with TEE-Lite `ecrecover` EIP-712 signature verification.
2. `contracts/test/CreditRegistry.t.sol` — Comprehensive test suite validating signature verification, replay guards, and enclave lifecycle.
