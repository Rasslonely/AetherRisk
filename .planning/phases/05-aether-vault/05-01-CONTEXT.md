# Phase 05 Context: AetherVault4626 Dynamic Rate Lending Vault

## Purpose
Phase 05 delivers `AetherVault4626.sol`, completing the primary financial primitive on Creditcoin CC3. It directly connects the on-chain credit scores and Bayesian risk models from `CreditRegistry.sol` to dynamic yield rates and borrower borrowing terms.

## References
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md` (Requirement: `CORE-05`, `TEST-01`)
- `.planning/ROADMAP.md` (Phase 5)
- `.planning/phases/04-credit-registry/04-01-SUMMARY.md`
- `0_resource/AETHERRISK_GOD_TIER_SPEC.md`
- `0_resource/SYSTEM_INTERFACES.md`

## Target Deliverables
1. `contracts/src/AetherVault4626.sol` — ERC-4626 compliant dynamic-rate lending vault.
2. `contracts/test/AetherVault4626.t.sol` — Test suite validating ERC-4626 mechanics, dynamic APY response, and credit line constraints.
