# Phase 04 Research: CreditRegistry & TEE-Lite Trust Boundary

## Objective
Design and implement `contracts/src/CreditRegistry.sol`, the on-chain risk state repository and confidential compute trust boundary on Creditcoin CC3. It implements the **TEE-Lite Pattern** to securely authenticate Bayesian risk decisions computed inside AMD SEV-SNP confidential virtual machines (Phala dstack) via EIP-712 typed data signatures without requiring full on-chain quote verification.

## Core Architectural Primitives

### 1. TEE-Lite Trust Boundary
- On-chain authorization mapping: `mapping(address => bool) public authorizedEnclaveSigners;`
- Enclave public keys derived from hardware quotes are registered by the contract owner upon deployment.
- State mutation requires a valid EIP-712 signature from an address in `authorizedEnclaveSigners`.

### 2. EIP-712 Typed Structured Data
- **Domain Separator**:
  - `name`: `"AetherRisk CreditRegistry"`
  - `version`: `"1"`
  - `chainId`: `block.chainid`
  - `verifyingContract`: `address(this)`
- **TypeHash**:
  ```solidity
  bytes32 public constant RISK_MUTATION_TYPEHASH = keccak256(
      "RiskMutation(address borrower,uint16 oldScore,uint16 newScore,uint256 maxCreditLine,uint16 apyBps,bytes32 attestcoinProofHash,uint256 nonce,uint256 deadline)"
  );
  ```

### 3. Replay Protection & Invariants
- `mapping(bytes32 => bool) public processedMutations;`
- `mapping(address => uint256) public enclaveNonces;`
- Every mutation commits to `(borrower, newScore, maxCreditLine, apyBps, attestcoinProofHash, nonce, deadline)`.
- Enforces `block.timestamp <= deadline`.
- Validates that `scores[borrower] == oldScore` to prevent out-of-order race conditions.

### 4. Credit Metric Schema
- Credit Scores: Normalized range $[300, 850]$.
- Dynamic APY: Basis points ($410 \text{ bps} = 4.10\%$, $920 \text{ bps} = 9.20\%$).
- Max Credit Lines: Denominated in USD 18-decimal fixed point or token decimals.

## Testing & Verification Matrix (`contracts/test/CreditRegistry.t.sol`)
1. **Valid Enclave Mutation**: Generates EIP-712 signature from enclave private key; verifies score, credit line, and APY updates.
2. **Unauthorized Signer Rejection**: Signature from unregistered key reverts with `"INVALID_ENCLAVE_SIG"`.
3. **Duplicate Mutation Replay Rejection**: Replaying identical mutation payload reverts with `"DUPLICATE_MUTATION"`.
4. **Expired Deadline Rejection**: Signature with `block.timestamp > deadline` reverts with `"SIGNATURE_EXPIRED"`.
5. **Enclave Management**: Owner can register (`EnclaveSignerRegistered`) and revoke (`EnclaveSignerRemoved`) signer keys.
