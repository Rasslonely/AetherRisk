---
phase: 03-aetherrisk-asc
plan: 01
subsystem: smart-contracts
tags: [solidity, foundry, attestcoin, replay-protection, evm-frontier, precompiles]

requires:
  - phase: 01-foundry-blockprover-interface
    provides: "INativeQueryVerifier.sol interface"
  - phase: 02-chaininfo-decoder
    provides: "IChainInfo.sol and IEvmV1Decoder.sol interfaces"
provides:
  - "AetherRiskASC.sol Attestcoin Smart Contract"
  - "Replay protection guard via processedQueryHashes"
  - "Source status validation enforcing receipt.status == 0x1"
  - "VerifiedCrossChainFact event emission"
  - "Passing Foundry test suite AetherRiskASC.t.sol (4/4 tests pass)"
affects: [04-credit-registry, 05-aether-vault, 07-deployment-scripts]

actuals:
  tokens: 2800
  tasks: 2
  commits: 2

tech-stack:
  added: [AetherRiskASC.sol, AetherRiskASC.t.sol]
  patterns: [Cryptographic Proof Verification, Replay Hashing, Revert Guards]

key-files:
  created:
    - contracts/src/AetherRiskASC.sol
    - contracts/test/AetherRiskASC.t.sol
  modified:
    - contracts/foundry.toml
    - contracts/src/interfaces/IEvmV1Decoder.sol

key-decisions:
  - "Enabled via_ir = true in foundry.toml for optimal stack allocation during complex proof verification"
  - "Enforced queryHash = keccak256(abi.encodePacked(chainKey, blockHeight, keccak256(encodedTransaction)))"
  - "Strictly validated IEvmV1Decoder(decoder).decodeReceipt(rawReceipt).status == 0x1 to reject reverted L1 transactions"

patterns-established:
  - "All ASC proof verification methods enforce single-use replay protection and status checks before state mutation"

requirements-completed:
  - CORE-03
  - TEST-01

coverage:
  - id: D1
    description: "AetherRiskASC proof verification, replay protection, and status checks"
    requirement: "CORE-03"
    verification:
      - kind: unit
        ref: "forge test --root contracts --match-contract AetherRiskASCTest"
        status: pass
    human_judgment: false

duration: 3min
completed: 2026-08-28
status: complete
---

# Phase 03: AetherRiskASC Attestcoin Smart Contract Summary

**Implemented and verified `AetherRiskASC.sol` with synchronous Substrate BlockProver (0xFD2) verification, EvmV1Decoder status validation, replay protection, and 100% passing test coverage.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-08-28T02:52:02Z
- **Completed:** 2026-08-28T02:53:40Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Implemented `contracts/src/AetherRiskASC.sol`, the primary Attestcoin Smart Contract orchestrator calling `BlockProver 0xFD2` and `EvmV1Decoder 0x731c...F9f`.
- Built `processedQueryHashes` mapping preventing replay attacks across all cross-chain proofs.
- Enforced strict execution validation (`require(receipt.status == 0x1, "TX_FAILED_ON_SOURCE")`).
- Created and executed `contracts/test/AetherRiskASC.t.sol`, passing all 4 unit and integration test cases:
  1. `test_VerifyAndProcessCreditEvent_Success`: Verified cross-chain fact emission.
  2. `test_ReplayProtection_RevertsOnDuplicate`: Double-spend and replay attempt rejection.
  3. `test_RevertsOnFailedSourceTransaction`: Reverted source transaction rejection.
  4. `test_RevertsOnInvalidAttestcoinProof`: Invalid Merkle / continuity proof rejection.

## Files Created/Modified

- `contracts/src/AetherRiskASC.sol` - Core Attestcoin smart contract.
- `contracts/test/AetherRiskASC.t.sol` - Foundry test suite with mocks.
- `contracts/foundry.toml` - Enabled `via_ir = true` for optimized compilation.
- `contracts/src/interfaces/IEvmV1Decoder.sol` - Updated with `view` mutability.

## Decisions Made

- Enabled `via_ir = true` in `foundry.toml` to handle Yul stack optimization cleanly for multi-parameter calldata structs.
- Consolidated `ProofPayload` calldata struct to provide clean ABI integration with `@gluwa/usc-sdk`.

## Deviations from Plan

- **Auto-fixed Rule 1 (Stack Optimization)**: Added `via_ir = true` to `foundry.toml` to resolve Solidity compiler stack-too-deep error for calldata proof structs.

## Issues Encountered

- Solidity EIP-55 checksum enforcement resolved by standardizing on `0x0000000000000000000000000000000000000FD2` and `0x0000000000000000000000000000000000000fD3`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `AetherRiskASC.sol` is verified and ready.
- Ready for **Phase 04**: `CreditRegistry.sol` (On-Chain Credit History & TEE-Lite Trust Boundary).

---
*Phase: 03-aetherrisk-asc*
*Completed: 2026-08-28*
