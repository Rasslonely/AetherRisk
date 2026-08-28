# Phase 03 Research: AetherRiskASC Attestcoin Smart Contract

## Objective
Design and implement `contracts/src/AetherRiskASC.sol`, the primary Attestcoin Smart Contract (ASC) orchestrator on Creditcoin CC3 EVM Frontier. It interfaces with the `BlockProver` Precompile (`0xFD2`), verifies source transaction inclusion and continuity, decodes raw receipt bytes via `EvmV1Decoder` (`0x731c...F9f`), enforces `receipt.status == 0x1`, protects against replay attacks via `processedQueryHashes`, and emits `VerifiedCrossChainFact` events.

## Key Architectural Primitives

### 1. Synchronous Precompile Integration
- Calls `INativeQueryVerifier(0x000...0FD2).verifySingle(...)` synchronously in Substrate EVM bytecode.
- If verification fails or returns `false`, execution immediately reverts with `"INVALID_ATTESTCOIN_PROOF"`.

### 2. Replay Protection Mechanism
- Generates a unique query hash:
  `queryHash = keccak256(abi.encodePacked(chainKey, blockHeight, keccak256(encodedTransaction)));`
- Validates `!processedQueryHashes[queryHash]` before execution.
- Marks `processedQueryHashes[queryHash] = true` upon successful verification.

### 3. Source Execution Integrity Gate
- Invokes `IEvmV1Decoder(decoder).decodeReceipt(rawReceipt)` to inspect status.
- Reverts with `"TX_FAILED_ON_SOURCE"` if `receipt.status != 0x1`, preventing reverted source transactions from falsely modifying credit lines.

### 4. Downstream Registry Signaling
- Emits `VerifiedCrossChainFact(queryHash, chainKey, blockHeight, borrower, amount, operationType, sourceTxHash)`.
- Optionally forwards verified credit signals to `CreditRegistry.sol`.

## Testing & Verification Matrix (`contracts/test/AetherRiskASC.t.sol`)
1. **Happy Path**: Valid Merkle inclusion & continuity proof + `receipt.status == 0x1` succeeds and emits `VerifiedCrossChainFact`.
2. **Replay Guard**: Second invocation with identical proof reverts with `"QUERY_ALREADY_PROCESSED"`.
3. **Failed Source Tx**: Source transaction with `receipt.status == 0x0` reverts with `"TX_FAILED_ON_SOURCE"`.
4. **Invalid Cryptographic Proof**: Precompile returning `false` reverts with `"INVALID_ATTESTCOIN_PROOF"`.
