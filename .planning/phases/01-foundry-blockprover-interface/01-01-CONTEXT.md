# Phase 01 Context: Foundry Configuration & BlockProver Interface

## Purpose
Phase 01 provides the root workspace configuration and core precompile interface required by all downstream smart contracts in Stage 1 (`AetherRiskASC.sol`, `CreditRegistry.sol`, `AetherVault4626.sol`).

## References
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md` (Requirement: `CORE-01`)
- `.planning/ROADMAP.md` (Phase 1)
- `0_resource/AETHERRISK_GOD_TIER_SPEC.md`
- `0_resource/SYSTEM_INTERFACES.md`
- `0_resource/ENV_REGISTRY.md`

## Target Deliverables
1. `contracts/foundry.toml` — Foundry workspace config for Solidity 0.8.24.
2. `contracts/src/interfaces/INativeQueryVerifier.sol` — Solidity interface for `BlockProver (0xFD2)`.
