# Features Dimension: AetherRisk

## Table Stakes vs Differentiating Capabilities

| Feature Category | Table Stakes (Standard) | AetherRisk Differentiating (SOTA) |
| :--- | :--- | :--- |
| **Cross-Chain Settlement** | 15–45 min multi-sig oracle relay (Chainlink CCIP / LayerZero) | **Sub-15s synchronous cryptographic verification** via Substrate Native Precompile `0xFD2` |
| **Credit Underwriting** | Static periodic off-chain scoring on centralized AWS server | **Hardware-isolated Bayesian risk kernel** inside AMD SEV-SNP TEE enclave with EIP-712 signatures |
| **Liquidation Protection** | High latency false liquidations of solvent borrowers | **Real-time source-chain event attestation** updating health factors before liquidators can strike |
| **Lending Vaults** | Fixed-tier static interest rates | **Dynamic ERC-4626 interest rate curves** reacting immediately to on-chain credit rating migrations |
| **Judge Experience** | Requires MetaMask + faucet tokens + 15 min waiting | **30-second zero-wallet in-browser simulator** with Triple-Layer Proof Resilience |
