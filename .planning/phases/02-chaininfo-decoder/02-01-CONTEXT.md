# Phase 02 Context: Precompile ChainInfo (`0xFD3`) & EvmV1Decoder Interfaces

## Purpose
Phase 02 delivers the remaining on-chain interface contracts needed by `AetherRiskASC.sol` (Phase 03) to inspect source chain heights and parse verified RLP transaction payloads from Ethereum Sepolia.

## References
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md` (Requirement: `CORE-02`)
- `.planning/ROADMAP.md` (Phase 2)
- `.planning/phases/01-foundry-blockprover-interface/01-01-SUMMARY.md`
- `0_resource/SYSTEM_INTERFACES.md`
- `0_resource/ENV_REGISTRY.md`

## Target Deliverables
1. `contracts/src/interfaces/IChainInfo.sol` — ChainInfo Precompile `0xFD3` interface.
2. `contracts/src/interfaces/IEvmV1Decoder.sol` — EvmV1Decoder interface with RLP transaction, receipt, and log decoding structs.
