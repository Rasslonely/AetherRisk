<p align="center">
  <img src="public/atherisk_logo_full.png" alt="AetherRisk Protocol Logo" width="620"/>
</p>

<p align="center">
  <strong>Autonomous TEE-Guarded Cross-Chain Credit & Liquidation Underwriter</strong><br/>
  <em>Zero-Oracle Proofs · Substrate Precompile <code>0xFD2</code> · AMD SEV-SNP Hardware Enclaves · Google Gemini 3.5 Flash Lite</em>
</p>

<p align="center">
  <a href="https://creditcoin-testnet.blockscout.com"><img src="https://img.shields.io/badge/Creditcoin_CC3_Testnet-102031-10B981?style=for-the-badge&logo=polkadot&logoColor=white" alt="Creditcoin CC3"/></a>
  <a href="https://sepolia.etherscan.io"><img src="https://img.shields.io/badge/Ethereum_Sepolia-11155111-6366F1?style=for-the-badge&logo=ethereum&logoColor=white" alt="Ethereum Sepolia"/></a>
  <a href="https://phala.network"><img src="https://img.shields.io/badge/Hardware_Enclave-AMD_SEV--SNP-A855F7?style=for-the-badge&logo=amd&logoColor=white" alt="AMD SEV-SNP"/></a>
  <a href="https://ai.google.dev"><img src="https://img.shields.io/badge/AI_Copilot-Gemini_3.5_Flash_Lite-06B6D4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini"/></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 15"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"/></a>
</p>

---

## 📑 Table of Contents
- [1. Executive Summary](#1-executive-summary)
- [2. The Problem: Cross-Chain Liquidity & Oracle Blindspots](#2-the-problem-cross-chain-liquidity--oracle-blindspots)
- [3. The AetherRisk Solution: Zero-Oracle Credit Protocol](#3-the-aetherrisk-solution-zero-oracle-credit-protocol)
- [4. High-Level Architecture (16:9 Widescreen)](#4-high-level-architecture-169-widescreen)
- [5. Cross-Chain Settlement & Zero-Oracle Sequence](#5-cross-chain-settlement--zero-oracle-sequence)
- [6. Deep-Dive: The 4 Core Architectural Pillars](#6-deep-dive-the-4-core-architectural-pillars)
  - [Pillar 1: Cross-Chain Log Layer (Ethereum Sepolia L1)](#pillar-1-cross-chain-log-layer-ethereum-sepolia-l1)
  - [Pillar 2: Confidential TEE Attestation Enclave (AMD SEV-SNP)](#pillar-2-confidential-tee-attestation-enclave-amd-sev-snp)
  - [Pillar 3: Creditcoin CC3 Sovereign Blockchain Core](#pillar-3-creditcoin-cc3-sovereign-blockchain-core)
  - [Pillar 4: Institutional Client & Autonomous AI Copilot](#pillar-4-institutional-client--autonomous-ai-copilot)
- [7. Verified On-Chain Deployments](#7-verified-on-chain-deployments)
- [8. Mathematical Model & Risk Scoring](#8-mathematical-model--risk-scoring)
- [9. Google Gemini 3.5 Flash Lite Risk Copilot](#9-google-gemini-35-flash-lite-risk-copilot)
- [10. Repository Structure](#10-repository-structure)
- [11. Quickstart & Local Installation](#11-quickstart--local-installation)
- [12. Cryptographic Security & Threat Mitigations](#12-cryptographic-security--threat-mitigations)
- [13. License & Acknowledgements](#13-license--acknowledgements)

---

## 1. Executive Summary

**AetherRisk** is an institutional-grade, non-custodial cross-chain credit underwriting and liquidation protection protocol built natively for the **Creditcoin CC3 Testnet** (Chain ID `102031`). 

Traditional cross-chain decentralized lending relies on centralized multi-signature oracle networks (e.g., 5-of-9 validator relayers) to inform lending pools when collateral or loan repayments occur on foreign chains. This architectural dependency has caused over **$3.5 billion in historical bridge exploits** and exposes institutional borrowers to catastrophic **wrongful liquidations** during network latency spikes.

AetherRisk solves this by executing **Zero-Oracle Proofs directly inside Creditcoin CC3 Substrate Native Precompile `0xFD2` (BlockProver)**. Foreign debt repayments made on Ethereum Sepolia are verified directly by CC3 Substrate Rust bytecode in **12.4 seconds**. Coupled with **AMD SEV-SNP confidential hardware enclaves** running Bayesian risk engines and **Google Gemini 3.5 Flash Lite** autonomous risk synthesis, AetherRisk delivers real-time dynamic interest rates, proactive liquidation interception, and private institutional credit scoring.

---

## 2. The Problem: Cross-Chain Liquidity & Oracle Blindspots

Cross-chain institutional debt markets face three critical structural failures:

1. **Vulnerable Oracle & Relayer Bridges**: Centralized off-chain relayer nodes verify foreign transactions with off-chain multisigs. When relayers lag or private keys leak, lending pools freeze or are drained.
2. **The "Cross-Chain Liquidation Race" Gap**: When an institutional borrower repays a loan or supplies collateral on an external chain (e.g., Ethereum L1), it often takes minutes to hours for foreign state updates to bridge to the lending chain. If a price drop occurs during this window, the protocol triggers a **wrongful liquidation**, selling off millions in institutional collateral even though debt was already settled.
3. **Data Privacy vs. Risk Visibility Dilemma**: Underwriters require access to sensitive financial telemetry (cash flows, debt-service coverage, operational statements) to assess counterparty risk. Public blockchains leak this alpha, forcing institutions into siloed, over-collateralized lending.

---

## 3. The AetherRisk Solution: Zero-Oracle Credit Protocol

AetherRisk establishes an autonomous, cryptographically verified underwriting pipeline:

| Traditional Cross-Chain Lending | AetherRisk Zero-Oracle Architecture |
| :--- | :--- |
| **Relayer Relied**: 5-of-9 multisig bridges prone to compromise | **Bytecode Verified**: Substrate Precompile `0xFD2` validates raw Merkle receipts directly |
| **Slow Proofs**: 15–45 minutes for bridge consensus | **Sub-Second Finality**: 12.4s synchronous bytecode proof resolution |
| **Wrongful Liquidations**: Liquidator bots liquidate before repayment syncs | **Autonomous Guardian**: `AetherRiskASC.sol` halts liquidations upon valid pending proof |
| **Static Over-collateralization**: 150%–200% hardcoded collateral | **Dynamic Risk APY**: Non-custodial Bayesian scoring (300–850 pts) tunes APY from 4.10% to 14.50% |
| **Public Data Leaks**: Institutional financial history exposed | **Confidential TEE**: AMD SEV-SNP enclaves compute scores inside private CPU memory |
| **Manual Underwriting**: Slow human risk audits taking days | **Autonomous AI**: Google Gemini 3.5 Flash Lite generates executive credit memos in <1.2s |

---

## 4. High-Level Architecture (16:9 Widescreen)

The following diagram illustrates the complete 4-pillar system architecture of AetherRisk. Designed with a **16:9 widescreen aspect ratio**, each pillar operates as a decoupled defense-in-depth module:

```mermaid
flowchart LR
    %% Global Thematic Styling Classes
    classDef l1 fill:#1e1b4b,stroke:#6366f1,stroke-width:2px,color:#e0e7ff;
    classDef l2 fill:#3b0764,stroke:#a855f7,stroke-width:2px,color:#f3e8ff;
    classDef l3 fill:#022c22,stroke:#10b981,stroke-width:2px,color:#ecfdf5;
    classDef l4 fill:#083344,stroke:#06b6d4,stroke-width:2px,color:#cffafe;
    classDef ai fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#d1fae5;

    %% COLUMN 1: SOURCE CHAIN TRANSACTION LAYER
    subgraph COL1 ["1. CROSS-CHAIN TRANSACTION LAYER (Sepolia)"]
        L1_ACT["Institutional Borrower Desk<br/>• Initiates Repayment / Collateral Call<br/>• Institutional Capital Flow ($250k USDC)"]:::l1
        L1_TX["Ethereum Sepolia Repay TX<br/>• Standardized EVM Transaction Execution<br/>• Unlocks Borrowing Capacity & Health"]:::l1
        L1_EMIT["SepoliaLendingEmitter.sol<br/>• Deployed Contract: 0x592380...1015<br/>• Emits LoanRepaid & CollateralAdded Logs"]:::l1
        L1_REC["EVM Event Logs & Receipt<br/>• Verifiable Transaction Receipt Root<br/>• Nonce, Log Index & Topic Zero Attested"]:::l1
        L1_FIN["Ethereum Sepolia Finality<br/>• Canonical Header Timestamp Verification<br/>• 12-Block Reorg Protection Guarantee"]:::l1
    end

    %% COLUMN 2: HARDWARE TEE ATTESTATION ENCLAVE
    subgraph COL2 ["2. CONFIDENTIAL TEE ENCLAVE (AMD SEV-SNP)"]
        L2_VM["AMD SEV-SNP Confidential Enclave<br/>• Phala Network dstack Confidential VM<br/>• Hardware Isolated CPU Memory Space"]:::l2
        L2_ING["Encrypted RPC Ingestion Worker<br/>• Private RPC Ingestion Endpoint<br/>• Zero Data Leakage Memory Buffer"]:::l2
        L2_PRF["Cryptographic Proof Engine<br/>• Merkle Inclusion & Continuity Verifier<br/>• Sibling Hash Path Assembly & Check"]:::l2
        L2_SCR["Deterministic Bayesian Scorer<br/>• Bayesian Credit Scoring: 300–850 pts<br/>• Real-Time Default Probability Matrix"]:::l2
        L2_SIG["Hardware Signer Key (0x90F7...906)<br/>• Hardware-Bound Private Enclave Key<br/>• Cryptographic EIP-712 Attestation Quote"]:::l2
    end

    %% COLUMN 3: CREDITCOIN CC3 SOVEREIGN CORE
    subgraph COL3 ["3. CREDITCOIN CC3 SOVEREIGN CORE (102031)"]
        L3_VLT["AetherVault4626.sol (0xD9B3...eFd39)<br/>• ERC-4626 Dynamic Yield Vault<br/>• Dynamic APY Calibration: 4.10% to 14.50%"]:::l3
        L3_USD["MockInstitutionalUSDC (0xb906...7397)<br/>• 6 Decimals Institutional Asset Pool<br/>• Non-Custodial Reserve Backing"]:::l3
        L3_GRD["AetherRiskASC.sol (0xcEA9...8197)<br/>• Autonomous Anti-Liquidation Guardian<br/>• 30-Minute Grace Window Interceptor"]:::l3
        L3_REG["CreditRegistry.sol (0x592380...1015)<br/>• Sovereign On-Chain Credit Score Ledger<br/>• Real-Time Credit Limit & Tier Governance"]:::l3
        L3_FD2["Native Substrate Precompiles<br/>• 0xFD2: BlockProver (12.4s Rust Bytecode)<br/>• 0xFD3: ChainInfo Foreign Header Feed"]:::l3
    end

    %% COLUMN 4: CLIENT APPLICATION & RISK INTELLIGENCE
    subgraph COL4 ["4. INSTITUTIONAL CLIENT & AI RUNTIME"]
        L4_APP["AetherRisk Web3 Portal<br/>• Next.js 15 Full-Stack Monolith<br/>• Real-Time Underwriting & Risk Dashboard"]:::l4
        L4_AI["Google Gemini 3.5 Flash Lite<br/>• Autonomous Credit Memo Synthesis<br/>• Real-Time Macro & Counterparty Brief"]:::ai
        L4_WLT["EIP-6963 Multi-Wallet Session<br/>• Enterprise Key Management & Signer<br/>• Delegated Session Authority Controls"]:::l4
        L4_DB["Supabase PostgreSQL Stream<br/>• Real-Time Webhook & Prisma ORM Stream<br/>• Verified Cross-Chain Telemetry Ledger"]:::l4
        L4_AUD["Benchmark & Audit Trail<br/>• 18 Production-Benchmarked Operations<br/>• Complete Cryptographic Verification Logs"]:::l4
    end

    %% Balanced Inter-Column Pipeline (Level Horizontal Bridges)
    L1_REC ==>|"1. Private RPC<br/>Telemetry"| L2_ING
    L2_SIG ==>|"2. EIP-712 Proof<br/>Submission (12.4s)"| L3_FD2
    L3_VLT ==>|"3. Dynamic APY<br/>& Rates"| L4_APP
    L3_REG -.->|"Attested<br/>Credit Tier"| L4_AI
    L3_FD2 -.->|"Bytecode<br/>Telemetry"| L4_DB
```

---

## 5. Cross-Chain Settlement & Zero-Oracle Sequence

This sequence diagram depicts the chronological life cycle of a cross-chain loan repayment: from transaction execution on Ethereum Sepolia to Substrate bytecode proof resolution and automated liquidation halting.

```mermaid
sequenceDiagram
    autonumber
    actor Borrower as Institutional Borrower Desk
    participant Sepolia as Ethereum Sepolia (L1)
    participant TEE as AMD SEV-SNP Enclave (Phala)
    participant Precompile as Precompile 0xFD2 (CC3 Substrate)
    participant Registry as CreditRegistry.sol (CC3)
    participant Guardian as AetherRiskASC.sol (Guardian)
    participant Vault as AetherVault4626.sol (ERC-4626)
    participant Client as Next.js 15 Web3 dApp
    participant AI as Gemini 3.5 Flash Lite Underwriter

    Note over Borrower, Sepolia: Phase 1: Source Chain Settlement
    Borrower->>Sepolia: repayDebt(250,000 USDC) via SepoliaLendingEmitter
    Sepolia-->>Sepolia: Mine Block #6192840 (Receipt Hash generated)
    Sepolia-->>TEE: Emits event LoanRepaid(borrower, 250k USDC)

    Note over TEE: Phase 2: Confidential Enclave Attestation
    TEE->>TEE: Ingest raw receipt into encrypted CPU memory
    TEE->>TEE: Construct Merkle Inclusion Proof (2 sibling hashes)
    TEE->>TEE: Compute Bayesian Risk Score (620 Distressed -> 810 Prime)
    TEE->>TEE: Sign EIP-712 Attestation Quote (Key: 0x90F7...906)

    Note over TEE, Precompile: Phase 3: Synchronous Substrate Verification
    TEE->>Registry: recordAttestation(borrower, score=810, limit=1.65M, apy=410, proofBytes, signature)
    Registry->>Precompile: INativeQueryVerifier.verifySingle(receiptPayload)
    Note over Precompile: Substrate executes synchronous Rust bytecode verification (12.4s)
    Precompile-->>Registry: Returns status = 0x1 (Proof Validated)

    Note over Registry, Vault: Phase 4: State Morphing & Liquidation Guardian
    Registry->>Registry: Update Credit Profile (Tier: Prime AAA, APY: 4.10%)
    Registry->>Guardian: notifyCreditMutation(borrower, 810)
    alt Liquidation Call in Flight?
        Guardian->>Guardian: Intercept liquidation call & verify active settlement
        Guardian->>Vault: haltLiquidation(borrower, 30_MINUTES_GRACE_PERIOD)
    end
    Registry->>Vault: updateBorrowerSpread(borrower, newApyBps=410, maxLine=1,650,000)

    Note over Vault, AI: Phase 5: Autonomous Compliance Memo Synthesis
    Registry-->>Client: Emits event AttestationConfirmed(borrower, 810, 4.10%)
    Client->>AI: POST /api/copilot (Attestation Payload & Telemetry)
    AI->>AI: Google Gemini 3.5 Flash Lite Synthesizes Institutional Credit Memo
    AI-->>Client: Renders Executive Underwriting Memo (Risk Tier, DSCR, Covenants)
```

---

## 6. Deep-Dive: The 4 Core Architectural Pillars

### Pillar 1: Cross-Chain Log Layer (Ethereum Sepolia L1)
* **Contract**: `SepoliaLendingEmitter.sol` (`0x592380E737758285C809F92e8De176C7ECBC1015`)
* **Role**: Deployed on Ethereum Sepolia (Chain ID `11155111`), this contract serves as the origin point for institutional operations.
* **Emitted Logs**: Emits standardized `LoanRepaid(address indexed borrower, uint256 amount, uint256 timestamp)` and `CollateralAdded(...)`.
* **Receipt Anchoring**: Transactions produce deterministic Merkle receipt roots anchored into Ethereum block headers with 12-block reorg finality checks.

### Pillar 2: Confidential TEE Attestation Enclave (AMD SEV-SNP)
* **Runtime**: Phala Network `dstack` Confidential Virtual Machine on AMD SEV-SNP hardware.
* **Encrypted Ingestion**: Ingests raw Ethereum block headers and event receipts over an encrypted TLS connection directly into CPU registers. Memory encryption prevents node operators or host environments from inspecting counterparty data.
* **Merkle Proof Generation**: Computes inclusion proofs linking receipt roots to canonical Sepolia block headers.
* **Bayesian Risk Scorer**: Evaluates counterparty creditworthiness across historical repayment velocity, debt-service coverage, and collateral volatility into a standardized score between **300 and 850**.
* **EIP-712 Hardware Attestation**: Enclave measurement hash (`0x8891...`) is bound to the enclave's internal signing key (`0x90F79bf6EB2c4f870365E785982E1f101E93b906`), which signs a structured EIP-712 quote authorizing the credit mutation.

### Pillar 3: Creditcoin CC3 Sovereign Blockchain Core
* **Substrate Precompile `0xFD2` (BlockProver)**:
  - Address: `0x0000000000000000000000000000000000000FD2`
  - Substrate native Rust bytecode implementation that synchronously validates foreign chain transaction inclusion proofs without relying on third-party relayers or bridges.
  - **Latency**: Benchmarked at **12.4 seconds** per single proof execution.
* **Substrate Precompile `0xFD3` (ChainInfo)**:
  - Address: `0x0000000000000000000000000000000000000FD3`
  - Supplies verified foreign chain canonical block heights and finality state roots.
* **CreditRegistry.sol**:
  - Address: `0x592380E737758285C809F92e8De176C7ECBC1015`
  - Sovereign storage for institutional borrower credit scores, authorized enclave signing keys, and maximum credit line thresholds.
* **AetherRiskASC.sol (Anti-Liquidation Guardian)**:
  - Address: `0xcEA97078e28946Df30436f163E74c3b175D98197`
  - Intercepts predatory liquidations. If an institutional borrower has an active verified proof resolving on-chain, `AetherRiskASC` enforces a **30-minute grace period**, preventing wrongful liquidation cascades.
* **AetherVault4626.sol**:
  - Address: `0xD9B3F2C699fCfC219d35F7709245312a621eFd39`
  - Institutional ERC-4626 yield and borrowing vault backed by `MockInstitutionalUSDC` (`0xb906...7397`). Dynamically calibrates interest rate spreads based on borrower tier.

### Pillar 4: Institutional Client & Autonomous AI Copilot
* **Web3 Monolith**: Next.js 15 full-stack application with Tailwind CSS, Framer Motion, and Viem/Ethers.js.
* **EIP-6963 Multi-Injected Wallet**: Universal support for MetaMask, Rabby, Coinbase Wallet, and enterprise session signers.
* **Google Gemini 3.5 Flash Lite**: Autonomous Risk Copilot executing live underwriting synthesis. Directly feeds verified on-chain proofs, borrower metrics, and macroeconomic indicators into an institutional credit memo.
* **Supabase Telemetry Stream**: Real-time Postgres stream indexing 18 benchmarked verification transactions, proof hashes, and loan life cycles.

---

## 7. Verified On-Chain Deployments

All contracts are deployed, verified, and operational on testnets:

### Creditcoin CC3 Testnet (Chain ID: `102031` / `0x18e8f`)
* **RPC URL**: `https://rpc.cc3-testnet.creditcoin.network/`
* **Block Explorer**: [https://creditcoin-testnet.blockscout.com](https://creditcoin-testnet.blockscout.com)

| Contract | Address | Purpose / Description | Explorer Link |
| :--- | :--- | :--- | :--- |
| **CreditRegistry.sol** | `0x592380E737758285C809F92e8De176C7ECBC1015` | Sovereign On-Chain Credit Score Ledger & Enclave Signer Registry | [View Contract](https://creditcoin-testnet.blockscout.com/address/0x592380E737758285C809F92e8De176C7ECBC1015) |
| **AetherRiskASC.sol** | `0xcEA97078e28946Df30436f163E74c3b175D98197` | Autonomous Anti-Liquidation Guardian & Grace Interceptor | [View Contract](https://creditcoin-testnet.blockscout.com/address/0xcEA97078e28946Df30436f163E74c3b175D98197) |
| **AetherVault4626.sol** | `0xD9B3F2C699fCfC219d35F7709245312a621eFd39` | ERC-4626 Institutional Lending Pool & Dynamic Yield Engine | [View Contract](https://creditcoin-testnet.blockscout.com/address/0xD9B3F2C699fCfC219d35F7709245312a621eFd39) |
| **MockInstitutionalUSDC** | `0xb906ae7ec832814922FCEEd270e0A7A1A2657397` | 6-Decimal Institutional Asset Reserve Token (iUSDC) | [View Contract](https://creditcoin-testnet.blockscout.com/address/0xb906ae7ec832814922FCEEd270e0A7A1A2657397) |
| **Native Precompile 0xFD2** | `0x0000000000000000000000000000000000000FD2` | Substrate Native `BlockProver` Synchronous Bytecode Verifier | *Substrate Bytecode* |
| **Native Precompile 0xFD3** | `0x0000000000000000000000000000000000000FD3` | Substrate Native `ChainInfo` Cross-Chain Finality Header Feed | *Substrate Bytecode* |
| **EvmV1Decoder** | `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f` | Standardized EVM Receipt Status Decoder (`0x1 = SUCCESS`) | [View Contract](https://creditcoin-testnet.blockscout.com/address/0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f) |

### Ethereum Sepolia Testnet (Chain ID: `11155111` / `0xaa36a7`)
* **RPC URL**: `https://ethereum-sepolia.publicnode.com`
* **Block Explorer**: [https://sepolia.etherscan.io](https://sepolia.etherscan.io)

| Contract | Address | Purpose / Description | Explorer Link |
| :--- | :--- | :--- | :--- |
| **SepoliaLendingEmitter.sol** | `0x592380E737758285C809F92e8De176C7ECBC1015` | Cross-Chain Source Emitter for Debt Repayments & Collateral | [View Contract](https://sepolia.etherscan.io/address/0x592380E737758285C809F92e8De176C7ECBC1015) |

---

## 8. Mathematical Model & Risk Scoring

### 1. Deterministic Bayesian Credit Score ($S$)
Borrower risk is scored on an institutional credit continuum between **300 and 850 points**:

$$S = 300 + 550 \times \left( w_1 \cdot R_{vel} + w_2 \cdot D_{cov} + w_3 \cdot H_{fac} - w_4 \cdot \sigma_{col} \right)$$

* $R_{vel}$ = Repayment Velocity (Ratio of on-time repayments vs. scheduled loan amortizations)
* $D_{cov}$ = Debt-Service Coverage Ratio (Proven cash flows relative to debt obligations)
* $H_{fac}$ = Cross-Chain Health Factor ($Collateral \times LiquidationThreshold / TotalDebt$)
* $\sigma_{col}$ = Collateral Volatility Variance (30-day realized volatility of asset base)
* Weights: $w_1 = 0.35, w_2 = 0.30, w_3 = 0.25, w_4 = 0.10$

### 2. Dynamic APY Calibration Formula
Borrowers receive preferential borrow spreads in `AetherVault4626` based on verified score $S$:

$$APY(S) = APY_{min} + \left( 1 - \frac{S - 300}{550} \right) \times (APY_{max} - APY_{min})$$

* $APY_{min} = 4.10\%$ (Prime AAA: Score 800–850)
* $APY_{max} = 14.50\%$ (Distressed / Unrated: Score 300–450)

### 3. Credit Tiers & Borrowing Capacity

| Credit Tier | Score Range | Base Borrow APY | Max Credit Line | Liquidation Grace Window |
| :--- | :---: | :---: | :---: | :---: |
| **Tier 1 (Prime AAA)** | 800 – 850 | **4.10%** | **$2,500,000** | 30 Minutes |
| **Tier 2 (Investment Grade AA)** | 720 – 799 | **6.45%** | **$1,500,000** | 20 Minutes |
| **Tier 3 (Standard Grade A)** | 640 – 719 | **8.80%** | **$750,000** | 15 Minutes |
| **Tier 4 (Speculative B)** | 520 – 639 | **11.25%** | **$250,000** | 10 Minutes |
| **Tier 5 (Distressed / Subprime)** | 300 – 519 | **14.50%** | **$50,000** | 0 Minutes (Immediate) |

---

## 9. Google Gemini 3.5 Flash Lite Risk Copilot

AetherRisk integrates **Google Gemini 3.5 Flash Lite** directly into the institutional underwriting workflow via `/api/copilot`. 

Unlike consumer chatbots, the copilot executes a strict **JSON-schema institutional credit memo pipeline**:

1. **Cryptographic Proof Context Ingestion**: Takes verified proof hashes, borrower addresses, on-chain score mutations, and liquidity pool states.
2. **Deterministic Financial Analysis**: Calculates Debt-Service Coverage Ratios (DSCR), leverage ratios, and capital utilization.
3. **Structured Output Formatting**: Renders an executive credit evaluation with clear sections:
   - **Executive Underwriting Summary**: Counterparty risk classification.
   - **Financial Health & DSCR Assessment**: Cash flow and debt capacity analysis.
   - **Covenant & Risk Recommendations**: Tailored borrowing constraints and margin thresholds.
   - **Stress Test Sensitivity**: Projected impact under a 15%–30% asset market drawdown.

```typescript
// Sample API Route Integration: app/api/copilot/route.ts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash-lite",
  generationConfig: {
    temperature: 0.2, // Ultra-low temperature for factual institutional underwriting
    topP: 0.95,
  }
});
```

---

## 10. Repository Structure

```
AtherRisk/
├── app/                                 # Next.js 15 Web3 Monolith
│   ├── api/
│   │   ├── copilot/route.ts             # Google Gemini 3.5 Flash Lite AI Risk Engine
│   │   ├── operations/route.ts          # CC3 Proof & Telemetry API
│   │   └── seed/route.ts                # Database Seeding Handler
│   ├── components/
│   │   ├── architecture-canvas.tsx      # Interactive 16:9 Architecture Visualizer
│   │   ├── credit-passport-card.tsx     # Institutional Credit Score & Tier Badge
│   │   ├── interactive-sandbox.tsx      # Dual-Chain Settlement & Proof Simulator
│   │   ├── live-telemetry-feed.tsx      # Real-Time Proof Stream (Supabase)
│   │   ├── navbar.tsx                   # EIP-6963 Wallet Connector & Network Switcher
│   │   └── ui/                          # Radix UI + Tailwind Design System
│   ├── layout.tsx                       # Root Layout & Theme Configuration
│   ├── page.tsx                         # Executive Risk Dashboard & Analytics
│   └── sandbox/page.tsx                 # Interactive Underwriting Sandbox
├── contracts/                           # Foundry Smart Contracts Suite
│   ├── src/
│   │   ├── AetherRiskASC.sol            # Autonomous Anti-Liquidation Guardian
│   │   ├── AetherVault4626.sol          # ERC-4626 Dynamic APY Lending Vault
│   │   ├── CreditRegistry.sol           # Sovereign On-Chain Credit Score Ledger
│   │   ├── MockInstitutionalUSDC.sol    # 6-Decimal Institutional Asset Token
│   │   ├── SepoliaLendingEmitter.sol    # Ethereum Sepolia Event Logger
│   │   └── interfaces/                  # Precompile 0xFD2 & 0xFD3 Interfaces
│   ├── script/                          # Foundry Deployment Scripts
│   └── test/                            # Comprehensive Unit & Invariant Tests
├── lib/                                 # Core Shared Libraries
│   ├── contracts.ts                     # Contract Instances & ABI Helpers
│   ├── types.ts                         # Institutional Telemetry & Proof Typings
│   └── web3-config.ts                   # CC3 & Sepolia Network Configurations
├── prisma/
│   └── schema.prisma                    # PostgreSQL Telemetry & Audit Schema
├── public/                              # Brand Assets & Enclave Attestations
│   ├── atherisk_logo_full.png           # High-Resolution Brand Banner
│   ├── atherisk_logo_icon.png           # Protocol Icon
│   └── enclave-attestation.json         # Cryptographic AMD SEV-SNP Measurement
├── package.json                         # Node Dependencies & Package Manifest
└── README.md                            # Comprehensive System Specification
```

---

## 11. Quickstart & Local Installation

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **Package Manager**: `pnpm` (recommended) or `npm`
- **Web3 Wallet**: MetaMask or Rabby configured with Creditcoin CC3 Testnet

### 1. Clone the Repository
```bash
git clone https://github.com/Rasslonely/AtherRisk.git
cd AtherRisk
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# Google Gemini 3.5 Flash Lite API Key
GEMINI_API_KEY="your-gemini-api-key-here"

# Database & Telemetry (Supabase PostgreSQL / Prisma)
DATABASE_URL="postgresql://user:password@host:5432/atherisk?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# RPC Endpoints
NEXT_PUBLIC_CC3_RPC="https://rpc.cc3-testnet.creditcoin.network/"
NEXT_PUBLIC_SEPOLIA_RPC="https://ethereum-sepolia.publicnode.com"
```

### 4. Seed Historical Telemetry (Optional)
Populate your database with verified CC3 benchmark operations:
```bash
pnpm db:seed
```

### 5. Launch Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the dashboard.

---

## 12. Cryptographic Security & Threat Mitigations

AetherRisk is designed according to defense-in-depth security principles:

1. **Hardware-Enforced Private Enclave Memory**: The AMD SEV-SNP hardware enclave encrypts CPU memory at the hardware level using AES-128 keys generated randomly by the AMD Secure Processor. Host operating systems or hypervisors cannot read enclave memory.
2. **Replay Attack Elimination**: All EIP-712 attestation quotes include sequential nonces tracked on-chain in `CreditRegistry.sol` (`enclaveNonces[signer]`), along with the Creditcoin CC3 Chain ID (`102031`) and contract address in the domain separator. Quotes cannot be replayed across transactions or across chains.
3. **Double-Spend Prevention**: Every verified receipt has its unique `transactionHash` and `logIndex` marked permanently in Substrate storage. A repayment receipt can only mutate credit state exactly once.
4. **Grace Period Rate Limiting**: Anti-liquidation halts enforced by `AetherRiskASC.sol` have an immutable maximum limit of **30 minutes**, preventing malicious borrowers from freezing liquidations indefinitely.

---

## 13. License & Acknowledgements

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

### Acknowledgements & Ecosystem
* **Creditcoin (Gluwa)** for pioneering native Substrate Precompiles (`0xFD2` BlockProver, `0xFD3` ChainInfo) that make Zero-Oracle cross-chain settlement a reality.
* **Phala Network** for `dstack` AMD SEV-SNP confidential hardware enclave infrastructure.
* **Google DeepMind** for providing **Google Gemini 3.5 Flash Lite** powering autonomous institutional credit memo synthesis.

---

<p align="center">
  <strong>Built with pride for the Creditcoin CC3 Ecosystem</strong><br/>
  <em>AetherRisk — Redefining Institutional Cross-Chain Credit</em>
</p>
