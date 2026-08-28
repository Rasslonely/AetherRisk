# Phase 02 Research: ChainInfo (`0xFD3`) & EvmV1Decoder (`0x731c...F9f`) Interfaces

## Objective
Establish the Solidity interfaces for Creditcoin's native **ChainInfo Precompile** (`0x0000000000000000000000000000000000000FD3`) and the **EvmV1Decoder** contract (`0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f`). These interfaces enable `AetherRiskASC.sol` to verify source chain attestation metadata, decode raw Ethereum transaction bytes, parse receipt logs, and enforce that source chain transactions executed successfully (`receipt.status == 0x1`).

## Precompile & Contract Specifications

### 1. ChainInfo Precompile (`0x000...0FD3`)
- **Address**: `0x0000000000000000000000000000000000000FD3`
- **Network**: Creditcoin CC3 Testnet (`102031`) & Mainnet (`102030`)
- **Purpose**: Substrate runtime tracking of source chain finalized heights and network configurations.
- **Methods**:
  ```solidity
  function getFinalizedHeight(uint64 chainKey) external view returns (uint64 blockHeight);
  function getGenesisHash(uint64 chainKey) external view returns (bytes32 genesisHash);
  function isChainSupported(uint64 chainKey) external view returns (bool supported);
  ```

### 2. EvmV1Decoder Contract
- **Testnet Address**: `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f`
- **Mainnet Address**: `0x9D094C9f22B10FCf842c2fC6A0981630A4F94B5C`
- **Purpose**: RLP-decodes Ethereum transaction bytes and receipt logs directly on Creditcoin EVM.
- **Key Invariants**:
  - `receipt.status == 0x1` must be verified to prevent reverted source transactions from granting credit or unlocking collateral.
  - Event topic extraction parses topics:
    - `LoanRepaid(address indexed borrower, uint256 amount, uint256 nonce)`
    - `CollateralAdded(address indexed borrower, uint256 amount, address asset)`
- **Data Models**:
  ```solidity
  struct EvmLog {
      address emitter;
      bytes32[] topics;
      bytes data;
  }

  struct EvmTransaction {
      uint64 chainId;
      uint64 nonce;
      uint256 maxPriorityFeePerGas;
      uint256 maxFeePerGas;
      uint256 gasLimit;
      address to;
      uint256 value;
      bytes data;
      address from;
  }

  struct EvmReceipt {
      uint8 status;
      uint256 cumulativeGasUsed;
      bytes logsBloom;
      EvmLog[] logs;
  }
  ```

## Verification Strategy
- Compile both interfaces using `C:\Users\PC\.foundry\bin\forge.exe build --root contracts`.
- Verify ABI generation in `contracts/out/IChainInfo.sol/IChainInfo.json` and `contracts/out/IEvmV1Decoder.sol/IEvmV1Decoder.json`.
