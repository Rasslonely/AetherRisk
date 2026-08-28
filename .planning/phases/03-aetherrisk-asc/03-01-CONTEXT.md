# Phase 03 Context: AetherRiskASC Attestcoin Smart Contract

## Purpose
Phase 03 implements the core on-chain verification engine (`AetherRiskASC.sol`) that bridges Ethereum Sepolia transaction proofs into Creditcoin CC3 on-chain credit signals, enabling real-time risk updates for `CreditRegistry.sol` (Phase 04) and `AetherVault4626.sol` (Phase 05).

## References
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md` (Requirement: `CORE-03`, `TEST-01`)
- `.planning/ROADMAP.md` (Phase 3)
- `.planning/phases/01-foundry-blockprover-interface/01-01-SUMMARY.md`
- `.planning/phases/02-chaininfo-decoder/02-01-SUMMARY.md`
- `0_resource/AETHERRISK_GOD_TIER_SPEC.md`
- `0_resource/SYSTEM_INTERFACES.md`

## Target Deliverables
1. `contracts/src/AetherRiskASC.sol` — Primary Attestcoin smart contract calling `0xFD2` & `0x731c...F9f`.
2. `contracts/test/AetherRiskASC.t.sol` — Comprehensive Foundry test suite covering replay guard, status checks, and proof validation.
