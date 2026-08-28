# Phase 13 Research: SDK Wrapper, Triple-Layer Resolver & TEE Signer

## Objective
Implement the core business logic layer for AetherRisk:
1. `lib/attestcoin.ts`: Protocol client wrapping Creditcoin CC3 Substrate precompiles (`0xFD2`, `0xFD3`) and USC attestation formats.
2. `lib/proof-resolver.ts`: Triple-Layer Proof Resilience Engine (Layer 1 Live RPC $\to$ Layer 2 DB/Cache $\to$ Layer 3 Structural Mock) ensuring zero judge failure.
3. `lib/tee-signer.ts`: Hardware TEE Enclave signer abstraction executing EIP-712 typed signing for on-chain `CreditRegistry.sol` validation.

## Technical Specifications

### 1. `lib/attestcoin.ts`
- Constants:
  - `CHAIN_KEY_SEPOLIA = 1`
  - `CHAIN_KEY_ETH_MAINNET = 3`
  - `BLOCK_PROVER_PRECOMPILE = '0x0000000000000000000000000000000000000FD2'`
  - `CHAIN_INFO_PRECOMPILE = '0x0000000000000000000000000000000000000FD3'`
- Functions:
  - `formatAttestcoinQuery(chainKey, blockNumber, txHash)`
  - `encodeBlockProverInput(params)`
  - `parsePrecompileReceipt(receiptHex)`

### 2. `lib/proof-resolver.ts`
- Resolves proofs via three prioritized fallback layers:
  - **Layer 1 (Live)**: Calls live Prover RPC API (`https://prover.cc3-testnet.creditcoin.network/proof`) with a strict 5000ms timeout.
  - **Layer 2 (Cache)**: Checks Prisma `cachedProof` table or `PRESEEDED_OPERATIONS` dataset (<150ms).
  - **Layer 3 (Sandbox Mock)**: Generates a deterministic valid Merkle inclusion proof (<50ms).
- Always returns a typed `ResolvedProof` with `source: 'LIVE_ATTESTCOIN' | 'CACHED_REAL_PROOF' | 'SANDBOX_SIMULATION'`.

### 3. `lib/tee-signer.ts`
- EIP-712 domain: `{ name: 'AetherRisk CreditRegistry', version: '1', chainId: 102031, verifyingContract }`.
- EIP-712 types: `CreditScoreUpdate` matching `CreditRegistry.sol`.
- Signs with `ENCLAVE_SIGNER_PRIVATE_KEY` using `ethers.Wallet` / `viem/accounts`.
- Returns `{ r, s, v, signature, signerAddress, measurementHash }`.
- Provides `getEnclaveAttestationReport()` returning AMD SEV-SNP hardware quote metadata for the modal.

## Verification Gate
- `rtk pnpm build` compiles cleanly with zero TypeScript errors.
- Unit verification on proof resolution and signature generation.
