# Requirements: Milestone v3.0 Remnara-Grade Hybrid Web3 dApp

## Overview
Milestone v3.0 elevates AetherRisk from an interactive simulator into a **full-fledged institutional Web3 decentralized application (dApp)** on Creditcoin CC3 Testnet (`102031`). It bridges live smart contract execution (Multi-Wallet Connect, 1-Click Testnet Faucet, ERC-4626 Vault Operations, Live Credit Passport) with our existing zero-wallet fast-track judge sandbox.

---

## Functional Requirements

### 1. Multi-Wallet Web3 Provider & Network Switcher
- [x] **REQ-W3-01**: Implement `Web3Provider` context with EIP-6963 multi-injected provider discovery (MetaMask, Rabby, Coinbase Wallet, OKX, Phantom).
- [x] **REQ-W3-02**: Provide seamless network auto-switching to Creditcoin CC3 Testnet (`Chain ID: 102031`, RPC: `https://rpc.cc3-testnet.creditcoin.network/`, Blockscout: `https://creditcoin-testnet.blockscout.com/`).
- [x] **REQ-W3-03**: Real-time connected account balance polling (Native `tCTC` + ERC-20 `iUSDC`).
- [x] **REQ-W3-04**: Interactive Wallet Modal in Navbar displaying address avatar, network badge, tCTC balance, copy address, disconnect, and faucet trigger.

### 2. 1-Click Institutional Capital Faucet
- [x] **REQ-FAUCET-01**: Build `FaucetModal` enabling any connected judge/user wallet to claim 10,000 `iUSDC` directly from deployed `MockInstitutionalUSDC.sol` (`0xb906ae7ec832814922FCEEd270e0A7A1A2657397`).
- [x] **REQ-FAUCET-02**: Live transaction confirmation toast with direct Blockscout explorer link and automatic wallet balance refresh.

### 3. Live Institutional Lending Vault Portal (`/vault`)
- [ ] **REQ-VAULT-01**: Interactive multi-tranche yield venue interface connected directly to `AetherVault4626.sol` (`0xD9B3F2C699fCfC219d35F7709245312a621eFd39`):
  - **Deposit iUSDC**: 2-step `approve()` + `deposit()` minting yield-bearing vault shares.
  - **Withdraw iUSDC**: `withdraw()` burning shares and redeeming capital + accrued yield.
  - **Borrow Capital**: `borrow()` dispensing uncollateralized/under-collateralized loans within credit line limit.
  - **Repay Loan**: `repay()` paying down principal/interest and repairing on-chain credit score.
- [ ] **REQ-VAULT-02**: Live Position Overview cards: *Wallet Balance*, *Deposited Vault Shares*, *Active Borrowed Debt*, *Available Credit Line*, and *Dynamic Pool APY*.
- [ ] **REQ-VAULT-03**: Dynamic interest rate curve visualizer reflecting real-time credit score adjustments ($4.1\% - 9.2\%$).

### 4. Live On-Chain Credit Passport (`/passport` or Profile Desk)
- [ ] **REQ-PASS-01**: Query `CreditRegistry.sol` (`0x592380E737758285C809F92e8De176C7ECBC1015`) for the connected wallet:
  - Current Credit Score (300 - 850)
  - Rating Badge (AAA Prime to B- Subprime)
  - Authorized TEE Hardware Signer digest (`0x90F7...b906`)
  - Max Borrowing Limit & Spread Discount
- [ ] **REQ-PASS-02**: Direct on-chain re-rate trigger via EIP-712 TEE payload verification.

### 5. Institutional Compliance & Remnara-Style Onboarding
- [ ] **REQ-LEGAL-01**: Remnara-inspired Institutional Terms of Service & Cryptographic Risk Acknowledgment Modal (4-point non-custodial, Substrate 0xFD2 precompile, and AMD SEV-SNP TEE disclaimers).
- [ ] **REQ-LEGAL-02**: Mode Switcher in top navigation: `[ ⚡ Live Web3 dApp ]` ⟷ `[ 🔬 Zero-Wallet Sandbox ]`.
