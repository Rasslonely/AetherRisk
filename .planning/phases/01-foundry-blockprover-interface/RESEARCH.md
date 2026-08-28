# Phase 01 Research: Foundry Configuration & BlockProver Interface (`0xFD2`)

## Objective
Establish the foundational Foundry compilation environment for Creditcoin CC3 EVM Frontier contracts and implement the Solidity interface for Creditcoin's native Substrate **BlockProver Precompile** (`0x0000000000000000000000000000000000000FD2`).

## Key Technical Specifications

### 1. EVM Target & Compiler Settings
- **Solidity Version**: `0.8.24`
- **EVM Compatibility**: Frontier EVM (`evm_version = "cancun"` or `"shanghai"` / `"paris"` compatibility).
- **Optimizer**: Enabled with 200 runs.
- **Directory Layout**:
  - `src = "src"`
  - `test = "test"`
  - `script = "script"`
  - `out = "out"`

### 2. BlockProver Precompile Interface (`0xFD2`)
- Precompile address: `0x0000000000000000000000000000000000000FD2`
- `MerkleProofEntry` struct:
  ```solidity
  struct MerkleProofEntry {
      uint8 direction; // 0 = Left, 1 = Right
      bytes32 sibling;
  }
  ```
- Method signature:
  ```solidity
  function verifySingle(
      uint64 chainKey,
      uint64 blockHeight,
      bytes calldata encodedTransaction,
      bytes32 merkleRoot,
      MerkleProofEntry[] calldata siblings,
      bytes32 lowerEndpointDigest,
      bytes32[] calldata continuityRoots
  ) external view returns (bool success);
  ```

### 3. Verification Path
- Execute compilation using `C:\Users\PC\.foundry\bin\forge.exe build --root contracts`.
