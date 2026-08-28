# Phase 07 Research: Foundry CC3 & Sepolia Deployment Scripts

## Objective
Design and implement deterministic Foundry deployment scripts for Creditcoin CC3 (`contracts/script/DeployCreditcoin.s.sol`) and Ethereum Sepolia (`contracts/script/DeploySepolia.s.sol`). These scripts automate contract instantiation, enclave signer registration, address cross-linking, and environment output formatting.

## Architectural Primitives

### 1. Creditcoin CC3 Deployment Flow (`DeployCreditcoin.s.sol`)
- **Network**: Creditcoin CC3 Testnet (`chainId: 102031`) / CC3 Mainnet (`chainId: 102030`)
- **EvmV1Decoder Address**: `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f`
- **Initial Enclave Signer**: Configured from `ENCLAVE_SIGNER_ADDRESS` or standard dev key `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`.
- **Deployment Steps**:
  1. Instantiate `CreditRegistry(enclaveSigner, hardwareQuoteId)`.
  2. Instantiate `AetherRiskASC(decoder, address(creditRegistry))`.
  3. Instantiate institutional underlying token (`MockERC20` / `USDC`).
  4. Instantiate `AetherVault4626(address(token), address(creditRegistry))`.
  5. Connect `AetherRiskASC.setCreditRegistry(address(creditRegistry))`.
  6. Output deployed addresses to console and `.env` format.

### 2. Ethereum Sepolia Deployment Flow (`DeploySepolia.s.sol`)
- **Network**: Ethereum Sepolia (`chainId: 11155111`)
- **Deployment Steps**:
  1. Instantiate `SepoliaLendingEmitter()`.
  2. Log deployed address for configuration in Next.js backend and `@gluwa/usc-sdk`.

## Testing Matrix
- Clean compilation under `forge build --root contracts`.
- Dry-run script execution with `forge script script/DeployCreditcoin.s.sol --root contracts` and `forge script script/DeploySepolia.s.sol --root contracts`.
