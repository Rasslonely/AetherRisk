---
phase: 01-foundry-blockprover-interface
plan: 01
subsystem: smart-contracts
tags: [solidity, foundry, precompiles, creditcoin, attestcoin, evm-frontier]

requires: []
provides:
  - "Foundry workspace configuration for Creditcoin CC3 EVM Frontier and Ethereum Sepolia"
  - "INativeQueryVerifier Solidity interface for Creditcoin BlockProver Precompile (0x000...0FD2)"
  - "Compiled artifacts and ABI for INativeQueryVerifier"
affects: [02-chaininfo-decoder, 03-aetherrisk-asc, 04-credit-registry, 05-aether-vault]

actuals:
  tokens: 1200
  tasks: 2
  commits: 2

tech-stack:
  added: [Foundry v1.7.1, Solidity 0.8.24]
  patterns: [Substrate Native Precompile Interface]

key-files:
  created:
    - contracts/foundry.toml
    - contracts/src/interfaces/INativeQueryVerifier.sol
    - contracts/out/INativeQueryVerifier.sol/INativeQueryVerifier.json
  modified: []

key-decisions:
  - "Configured Solidity 0.8.24 with cancun EVM compatibility and 200 optimizer runs matching Creditcoin CC3 Frontier EVM"
  - "Defined MerkleProofEntry struct and verifySingle signature matching @gluwa/usc-sdk and Attestcoin protocol"

patterns-established:
  - "All precompile interfaces reside in contracts/src/interfaces/"

requirements-completed:
  - CORE-01

coverage:
  - id: D1
    description: "Foundry configuration and INativeQueryVerifier.sol compilation"
    requirement: "CORE-01"
    verification:
      - kind: unit
        ref: "forge build --root contracts"
        status: pass
    human_judgment: false

duration: 2min
completed: 2026-08-28
status: complete
---

# Phase 01: Foundry Configuration & BlockProver Interface Summary

**Foundry compilation workspace initialized with Solidity 0.8.24, Cancun EVM profile, and synchronous BlockProver precompile (0xFD2) interface.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-08-28T02:16:46Z
- **Completed:** 2026-08-28T02:17:30Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Configured `contracts/foundry.toml` with `solc_version = "0.8.24"`, EVM Cancun compatibility, and RPC endpoint definitions for Creditcoin CC3 Testnet, Ethereum Sepolia, and Creditcoin Mainnet.
- Implemented `contracts/src/interfaces/INativeQueryVerifier.sol` matching Creditcoin's native Substrate `BlockProver Precompile` (`0x0000000000000000000000000000000000000FD2`).
- Successfully compiled with `forge build --root contracts` producing `contracts/out/INativeQueryVerifier.sol/INativeQueryVerifier.json`.

## Files Created/Modified

- `contracts/foundry.toml` - Workspace configuration for Foundry.
- `contracts/src/interfaces/INativeQueryVerifier.sol` - Solidity interface for BlockProver `0xFD2`.
- `contracts/out/INativeQueryVerifier.sol/INativeQueryVerifier.json` - Generated compiler ABI and bytecode artifacts.

## Decisions Made

- Targeted Solidity `0.8.24` and EVM Cancun with `optimizer = true` (200 runs) to match Creditcoin CC3 Frontier EVM runtime.
- Specified explicit NatSpec documentation for each parameter (`chainKey`, `blockHeight`, `encodedTransaction`, `merkleRoot`, `siblings`, `lowerEndpointDigest`, `continuityRoots`) to ensure clarity for downstream ASC contracts.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for **Phase 02**: `IChainInfo.sol` (`0xFD3`) & `IEvmV1Decoder.sol` (`0x731c...F9f`) interfaces.

---
*Phase: 01-foundry-blockprover-interface*
*Completed: 2026-08-28*
