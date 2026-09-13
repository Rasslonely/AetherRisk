<p align="center">
  <img src="public/atherisk_logo_full.png" alt="AetherRisk Protocol Logo" width="620"/>
</p>

<h1 align="center">AetherRisk</h1>

<p align="center">
  <strong>Deterministic Cross-Chain Credit Attestation and Dynamic Lending Protocol for Creditcoin CC3</strong><br/>
  <em>Zero-Oracle Proofs · Substrate Native Precompile <code>0xFD2</code> · AMD SEV-SNP Hardware Enclaves · Grounded Underwriting Synthesis via Google Gemini 3.5 Flash Lite</em>
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

## Table of Contents
- [1. Executive Summary](#1-executive-summary)
- [2. Problem Formulation: Cross-Chain Debt & Oracle Fragility](#2-problem-formulation-cross-chain-debt--oracle-fragility)
- [3. Protocol Solution: Zero-Oracle Credit Infrastructure](#3-protocol-solution-zero-oracle-credit-infrastructure)
- [4. System Architecture (16:9 Visual Model)](#4-system-architecture-169-visual-model)
- [5. Cross-Chain Settlement & Verification Sequence](#5-cross-chain-settlement--verification-sequence)
- [6. Deep Technical Specification: Four Structural Pillars](#6-deep-technical-specification-four-structural-pillars)
  - [Pillar 1: Cross-Chain Log Settlement Layer (Ethereum Sepolia L1)](#pillar-1-cross-chain-log-settlement-layer-ethereum-sepolia-l1)
  - [Pillar 2: Confidential Enclave Attestation (AMD SEV-SNP)](#pillar-2-confidential-enclave-attestation-amd-sev-snp)
  - [Pillar 3: Creditcoin CC3 Sovereign Blockchain Core](#pillar-3-creditcoin-cc3-sovereign-blockchain-core)
  - [Pillar 4: Institutional Client & Autonomous Underwriting Synthesis](#pillar-4-institutional-client--autonomous-underwriting-synthesis)
- [7. Verified On-Chain Deployments](#7-verified-on-chain-deployments)
- [8. Mathematical Formulation & Risk Parameterization](#8-mathematical-formulation--risk-parameterization)
- [9. Institutional Credit Memo Synthesis (Google Gemini 3.5 Flash Lite)](#9-institutional-credit-memo-synthesis-google-gemini-35-flash-lite)
- [10. Repository Organization](#10-repository-organization)
- [11. Installation & Local Reproduction](#11-installation--local-reproduction)
- [12. Threat Model & Cryptographic Guarantees](#12-threat-model--cryptographic-guarantees)
- [13. License & Ecosystem References](#13-license--ecosystem-references)

---

## 1. Executive Summary

AetherRisk is a non-custodial cross-chain credit underwriting and dynamic lending protocol designed natively for the **Creditcoin CC3 Testnet** (Chain ID `102031`).

Decentralized debt markets operating across heterogeneous blockchains face a fundamental coordination barrier: verifying that a borrower has serviced debt or deposited collateral on an external network without relying on trusted intermediaries. Conventional protocols employ multi-signature relayer bridges, which have historically accounted for over $3.5 billion in cryptographic exploits and systematically induce erroneous liquidations during cross-chain network congestion.

AetherRisk resolves this coordination failure by integrating **Creditcoin CC3 Substrate Native Precompile `0xFD2` (BlockProver)**. Foreign loan repayments executed on Ethereum Sepolia are validated synchronously by Substrate Rust bytecode within **12.4 seconds**, bypassing third-party oracles and multi-signature committees. 

To preserve corporate privacy while enabling risk-sensitive capital pricing, off-chain telemetry is evaluated inside **AMD SEV-SNP confidential hardware enclaves** running an isolated Bayesian scoring algorithm ($S \in [300, 850]$). On-chain smart contracts (`CreditRegistry.sol`, `AetherRiskASC.sol`, and `AetherVault4626.sol`) enforce dynamic interest rates (4.10% to 14.50% APY) and autonomous 30-minute anti-liquidation grace windows. Finally, **Google Gemini 3.5 Flash Lite** functions as an Autonomous Underwriting Memo Synthesizer, transforming verified cryptographic proofs into structured credit committee documentation with mathematically bounded factual grounding.

---

## 2. Problem Formulation: Cross-Chain Debt & Oracle Fragility

Institutional borrowing across separate layer-1 blockchains exhibits three structural vulnerabilities:

1. **Relayer Trust Assumptions and Attack Surfaces**: Standard cross-chain messaging depends on centralized validator sets (e.g., 5-of-9 multisig schemes). Compromise of relayer keys or state inconsistency directly exposes pooled lending capital to unauthorized drains.
2. **The Settlement Latency Race Condition**: When an institutional borrower settles debt obligations or posts collateral on an external chain (e.g., Ethereum L1), foreign event confirmation often requires 15 to 45 minutes to reach secondary networks. If localized asset volatility triggers a margin threshold during this synchronization window, automated liquidator bots auction the borrower's collateral despite timely principal settlement.
3. **The Transparency Paradox in Underwriting**: Institutional credit assessment requires granular financial telemetry, such as cash flow statements, debt-service coverage, and operational liabilities. Publishing unencrypted corporate data onto public ledgers exposes proprietary trading strategies, forcing decentralized debt protocols into inefficient, static over-collateralization models (150% to 200%).

---

## 3. Protocol Solution: Zero-Oracle Credit Infrastructure

AetherRisk replaces off-chain trust assumptions with native cryptographic verification and confidential computing:

| Architectural Property | Conventional Cross-Chain Lending | AetherRisk Zero-Oracle Architecture |
| :--- | :--- | :--- |
| **Verification Primitive** | Off-chain multi-signature oracle / bridge relayer | Substrate Precompile `0xFD2` native Merkle receipt verification |
| **Settlement Latency** | 15–45 minutes across multi-sig consensus | 12.4 seconds synchronous Substrate bytecode execution |
| **Liquidation Handling** | Blind execution by external liquidator bots | `AetherRiskASC.sol` autonomous 30-minute grace window |
| **Capital Pricing** | Static over-collateralization (150%–200%) | Dynamic risk-adjusted borrow APY (4.10%–14.50%) |
| **Data Privacy** | Public exposure of institutional transaction logs | Hardware-isolated AMD SEV-SNP encrypted memory |
| **Credit Evaluation** | Manual, periodic off-chain audit reports | Google Gemini 3.5 Flash Lite grounded institutional memos |

---

## 4. System Architecture (16:9 Visual Model)

The following diagram illustrates the four-pillar system architecture of AetherRisk, formatted for standard 16:9 widescreen presentation:

```mermaid
flowchart LR
    %% Global Styling Classes
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

    %% Balanced Inter-Column Pipeline
    L1_REC ==>|"1. Private RPC<br/>Telemetry"| L2_ING
    L2_SIG ==>|"2. EIP-712 Proof<br/>Submission (12.4s)"| L3_FD2
    L3_VLT ==>|"3. Dynamic APY<br/>& Rates"| L4_APP
    L3_REG -.->|"Attested<br/>Credit Tier"| L4_AI
    L3_FD2 -.->|"Bytecode<br/>Telemetry"| L4_DB
```

---

## 5. Cross-Chain Settlement & Verification Sequence

The execution sequence below traces a debt repayment transaction from source emission on Ethereum Sepolia through Substrate precompile verification to dynamic interest rate calibration on Creditcoin CC3:

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

## 6. Deep Technical Specification: Four Structural Pillars

### Pillar 1: Cross-Chain Log Settlement Layer (Ethereum Sepolia L1)
* **Contract**: `SepoliaLendingEmitter.sol` (`0x592380E737758285C809F92e8De176C7ECBC1015`)
* **Role**: Deployed on Ethereum Sepolia (Chain ID `11155111`), the contract serves as the origin point for institutional capital events.
* **Standardized Logs**: Emits `LoanRepaid(address indexed borrower, uint256 amount, uint256 timestamp)` and `CollateralAdded(address indexed borrower, uint256 amount, uint256 timestamp)`.
* **Cryptographic Commitment**: Transactions produce deterministic Patricia-Merkle receipt roots anchored in canonical Ethereum block headers, requiring 12-block reorg finality verification.

### Pillar 2: Confidential Enclave Attestation (AMD SEV-SNP)
* **Runtime**: Phala Network `dstack` Confidential Virtual Machine executing on AMD SEV-SNP hardware.
* **Confidential Memory Isolation**: Financial telemetry is ingested via TLS directly into encrypted CPU registers. Full memory encryption prevents hypervisors and infrastructure operators from inspecting proprietary corporate cash flows.
* **Proof Construction**: Evaluates Merkle inclusion proofs linking transaction receipt hashes to canonical Sepolia block headers.
* **Deterministic Risk Model**: Computes an institutional rating between 300 and 850 points based on repayment velocity, cash flow coverage, and collateral volatility.
* **Hardware EIP-712 Attestation**: An internal hardware-bound secp256k1 key signs a structured EIP-712 attestation quote containing the borrower address, score, approved credit ceiling, and proof digest.

### Pillar 3: Creditcoin CC3 Sovereign Blockchain Core
* **Substrate Precompile `0xFD2` (BlockProver)**:
  - Address: `0x0000000000000000000000000000000000000FD2`
  - Substrate native Rust bytecode implementation that synchronously validates foreign chain transaction inclusion proofs without relying on third-party relayers or bridges.
  - Verification latency: **12.4 seconds** per single proof execution.
* **Substrate Precompile `0xFD3` (ChainInfo)**:
  - Address: `0x0000000000000000000000000000000000000FD3`
  - Supplies verified foreign chain canonical block heights and state roots.
* **CreditRegistry.sol**:
  - Address: `0x592380E737758285C809F92e8De176C7ECBC1015`
  - Maintains sovereign on-chain credit scores, authorized enclave signing keys, and maximum credit line thresholds.
* **AetherRiskASC.sol (Anti-Liquidation Guardian)**:
  - Address: `0xcEA97078e28946Df30436f163E74c3b175D98197`
  - Intercepts predatory liquidations. When an institutional borrower possesses an active verified proof resolving on-chain, `AetherRiskASC` enforces an immutable **30-minute grace window**, preventing erroneous liquidation cascades.
* **AetherVault4626.sol**:
  - Address: `0xD9B3F2C699fCfC219d35F7709245312a621eFd39`
  - Institutional ERC-4626 lending and yield vault backed by `MockInstitutionalUSDC` (`0xb906...7397`). Dynamically calibrates interest rate spreads based on the borrower's on-chain credit tier.

### Pillar 4: Institutional Client & Autonomous Underwriting Synthesis
* **Web3 Monolith**: Next.js 15 application utilizing Viem and Ethers.js for asynchronous chain interaction.
* **EIP-6963 Wallet Management**: Universal compatibility with MetaMask, Rabby, and enterprise custody signers.
* **Google Gemini 3.5 Flash Lite**: Autonomous Underwriting Memo Synthesizer. Translates cryptographic proofs, debt-service coverage metrics, and liquidity conditions into formal executive underwriting memos for risk committees.
* **PostgreSQL Telemetry Ledger**: Real-time Supabase stream capturing benchmarked verification transactions, proof hashes, and lending lifecycle transitions.

---

## 7. Verified On-Chain Deployments

All contracts are deployed and verified on their respective test networks:

### Creditcoin CC3 Testnet (Chain ID: `102031` / `0x18e8f`)
* **RPC Endpoint**: `https://rpc.cc3-testnet.creditcoin.network/`
* **Block Explorer**: [https://creditcoin-testnet.blockscout.com](https://creditcoin-testnet.blockscout.com)

| Contract | Address | Technical Function | Explorer Link |
| :--- | :--- | :--- | :--- |
| **CreditRegistry.sol** | `0x592380E737758285C809F92e8De176C7ECBC1015` | On-chain credit ledger and enclave key registry | [View Contract](https://creditcoin-testnet.blockscout.com/address/0x592380E737758285C809F92e8De176C7ECBC1015) |
| **AetherRiskASC.sol** | `0xcEA97078e28946Df30436f163E74c3b175D98197` | Autonomous liquidation guardian and grace window interceptor | [View Contract](https://creditcoin-testnet.blockscout.com/address/0xcEA97078e28946Df30436f163E74c3b175D98197) |
| **AetherVault4626.sol** | `0xD9B3F2C699fCfC219d35F7709245312a621eFd39` | ERC-4626 dynamic APY institutional lending vault | [View Contract](https://creditcoin-testnet.blockscout.com/address/0xD9B3F2C699fCfC219d35F7709245312a621eFd39) |
| **MockInstitutionalUSDC** | `0xb906ae7ec832814922FCEEd270e0A7A1A2657397` | 6-decimal institutional asset token (`iUSDC`) | [View Contract](https://creditcoin-testnet.blockscout.com/address/0xb906ae7ec832814922FCEEd270e0A7A1A2657397) |
| **Native Precompile 0xFD2** | `0x0000000000000000000000000000000000000FD2` | Substrate native `BlockProver` bytecode verifier | *Substrate Bytecode* |
| **Native Precompile 0xFD3** | `0x0000000000000000000000000000000000000FD3` | Substrate native `ChainInfo` canonical header feed | *Substrate Bytecode* |
| **EvmV1Decoder** | `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f` | Standardized EVM receipt status decoder (`0x1 = SUCCESS`) | [View Contract](https://creditcoin-testnet.blockscout.com/address/0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f) |

### Ethereum Sepolia Testnet (Chain ID: `11155111` / `0xaa36a7`)
* **RPC Endpoint**: `https://ethereum-sepolia.publicnode.com`
* **Block Explorer**: [https://sepolia.etherscan.io](https://sepolia.etherscan.io)

| Contract | Address | Technical Function | Explorer Link |
| :--- | :--- | :--- | :--- |
| **SepoliaLendingEmitter.sol** | `0x592380E737758285C809F92e8De176C7ECBC1015` | Cross-chain emitter for repayment and collateral logs | [View Contract](https://sepolia.etherscan.io/address/0x592380E737758285C809F92e8De176C7ECBC1015) |

---

## 8. Mathematical Formulation & Risk Parameterization

### 1. Deterministic Bayesian Credit Score ($S$)
Borrower risk is quantified continuously within the closed interval $[300, 850]$:

$$S = 300 + 550 \times \left( w_1 \cdot R_{vel} + w_2 \cdot D_{cov} + w_3 \cdot H_{fac} - w_4 \cdot \sigma_{col} \right)$$

* $R_{vel} \in [0, 1]$: Repayment Velocity (Ratio of on-time principal settlements to scheduled obligations)
* $D_{cov} \in [0, 1]$: Debt-Service Coverage Ratio (Verified operating cash flow relative to aggregate debt service)
* $H_{fac} \in [0, 1]$: Cross-Chain Collateral Health Factor ($\frac{Collateral \times LiquidationThreshold}{TotalDebt}$)
* $\sigma_{col} \in [0, 1]$: Normalized 30-Day Realized Volatility of the underlying collateral asset base
* Empirical Weight Distribution: $w_1 = 0.35, w_2 = 0.30, w_3 = 0.25, w_4 = 0.10$ where $\sum_{i=1}^4 w_i = 1.0$

### 2. Dynamic APY Calibration Function
Interest rate spreads in `AetherVault4626` are indexed to the verified score $S$:

$$APY(S) = APY_{min} + \left( 1 - \frac{S - 300}{550} \right) \times (APY_{max} - APY_{min})$$

* $APY_{min} = 4.10\%$ (Prime AAA, score range 800–850)
* $APY_{max} = 14.50\%$ (Distressed / Unrated, score range 300–519)

### 3. Credit Tier Governance Matrix

| Credit Tier | Score Interval | Base Borrow APY | Approved Credit Line | Liquidation Grace Window |
| :--- | :---: | :---: | :---: | :---: |
| **Tier 1 (Prime AAA)** | 800 – 850 | **4.10%** | **$2,500,000** | 30 Minutes |
| **Tier 2 (Investment Grade AA)** | 720 – 799 | **6.45%** | **$1,500,000** | 20 Minutes |
| **Tier 3 (Standard Grade A)** | 640 – 719 | **8.80%** | **$750,000** | 15 Minutes |
| **Tier 4 (Speculative B)** | 520 – 639 | **11.25%** | **$250,000** | 10 Minutes |
| **Tier 5 (Distressed / Subprime)** | 300 – 519 | **14.50%** | **$50,000** | 0 Minutes (Immediate) |

---

## 9. Institutional Credit Memo Synthesis (Google Gemini 3.5 Flash Lite)

AetherRisk incorporates **Google Gemini 3.5 Flash Lite** through `/api/copilot` to solve an institutional reporting bottleneck: converting complex cryptographic verification logs and mathematical score vectors into standardized credit committee documentation.

### Architectural Boundary: Deterministic Consensus vs. LLM Synthesis
It is critical to distinguish the role of on-chain computation from natural language synthesis:
* **Consensus & Capital Pricing**: 100% deterministic and on-chain. Numerical credit scores, interest rate calculations, and liquidation freezes are executed entirely by Solidity smart contracts and Substrate precompiles. No large language model participates in the consensus or state-transition loop.
* **Grounded Memo Synthesis**: Google Gemini 3.5 Flash Lite operates as a dedicated natural language synthesizer. It ingests verified on-chain state (Merkle proof digests, Substrate verification timestamps, DSCR, and volatility indices) and formats them into institutional credit memos. Because all underlying inputs are mathematically validated on-chain prior to prompt assembly, the synthesis is factual and resistant to input hallucination.

```typescript
// Integration Pattern: app/api/copilot/route.ts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash-lite',
  generationConfig: {
    temperature: 0.2, // Low temperature for deterministic, factual underwriting
    topP: 0.95,
  },
});
```

### Structured Output Specification
The synthesis generates four standardized sections tailored for credit committees:
1. **Executive Underwriting Summary**: Counterparty classification, risk grading, and approved credit lines.
2. **Debt-Service Capacity & Health Analysis**: Analysis of operating cash flows relative to cross-chain debt service.
3. **Covenant & Threshold Recommendations**: Liquidation tolerances, collateral top-up margins, and monitoring triggers.
4. **Market Stress Sensitivity**: Projected counterparty solvency under simulated 15% to 30% asset market drawdowns.

---

## 10. Repository Organization

```
AetherRisk/
├── app/                                 # Next.js 15 Web3 Client Monolith
│   ├── api/
│   │   ├── attest/route.ts              # EIP-712 Attestation Handler
│   │   ├── copilot/route.ts             # Google Gemini 3.5 Flash Lite Underwriting API
│   │   ├── faucet/route.ts              # Institutional Testnet Capital Dispenser
│   │   ├── operations/route.ts          # CC3 Proof & Telemetry Query API
│   │   ├── seed/route.ts                # Database Seeding Endpoint
│   │   └── simulate/route.ts            # Enclave Proof Simulation Route
│   ├── components/
│   │   ├── architecture-canvas.tsx      # Interactive 16:9 Architecture Visualizer
│   │   ├── credit-passport-card.tsx     # Institutional Credit Tier Display
│   │   ├── interactive-sandbox.tsx      # Cross-Chain Proof & Settlement Simulator
│   │   ├── live-telemetry-feed.tsx      # Real-Time Proof Stream (Supabase)
│   │   ├── navbar.tsx                   # EIP-6963 Wallet Connection & Network Switcher
│   │   └── ui/                          # Radix UI Design Components
│   ├── layout.tsx                       # Root Layout & Theme Configuration
│   ├── page.tsx                         # Primary Risk Dashboard & Metrics
│   └── sandbox/page.tsx                 # Interactive Verification Sandbox
├── contracts/                           # Foundry Smart Contract Suite
│   ├── src/
│   │   ├── AetherRiskASC.sol            # Autonomous Anti-Liquidation Guardian
│   │   ├── AetherVault4626.sol          # ERC-4626 Dynamic APY Vault
│   │   ├── CreditRegistry.sol           # Sovereign On-Chain Credit Score Ledger
│   │   ├── MockInstitutionalUSDC.sol    # 6-Decimal Institutional Asset Token
│   │   ├── SepoliaLendingEmitter.sol    # Ethereum Sepolia Event Logger
│   │   └── interfaces/                  # Precompile 0xFD2 & 0xFD3 Interfaces
│   ├── script/                          # Deployment & Verification Scripts
│   └── test/                            # Invariant & Unit Test Suite
├── lib/                                 # Core Utility Libraries
│   ├── contracts/                       # Typed Contract ABIs & Viem Bindings
│   ├── tee-signer.ts                    # AMD SEV-SNP EIP-712 Attestation Engine
│   ├── types.ts                         # System Type Definitions
│   └── web3-config.ts                   # Chain Configurations & Contract Registry
├── prisma/
│   └── schema.prisma                    # Telemetry & Audit Schema (PostgreSQL)
├── public/                              # Brand Assets & Enclave Quotes
│   ├── atherisk_logo_full.png           # High-Resolution Protocol Banner
│   ├── atherisk_logo_icon.png           # Protocol Favicon & Icon
│   └── enclave-attestation.json         # Cryptographic AMD SEV-SNP Measurement
├── package.json                         # Dependencies & Scripts Manifest
└── README.md                            # Complete Protocol Specification
```

---

## 11. Installation & Local Reproduction

### System Requirements
* **Node.js**: v20.x or v22.x LTS
* **Package Manager**: `pnpm` (version 9 or higher recommended)
* **Web3 Wallet**: MetaMask or Rabby configured with Creditcoin CC3 Testnet (Chain ID `102031`)

### 1. Clone the Codebase
```bash
git clone https://github.com/Rasslonely/AetherRisk.git
cd AetherRisk
```

### 2. Install Project Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables
Copy the template configuration and supply the required API keys:
```bash
cp .env.example .env.local
```

Ensure `.env.local` contains valid credentials:
```env
# Google Gemini 3.5 Flash Lite API Key
GEMINI_API_KEY="your-gemini-api-key-here"

# Database & Telemetry (Supabase PostgreSQL / Prisma)
DATABASE_URL="postgresql://user:password@host:5432/atherisk?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Creditcoin CC3 Network
NEXT_PUBLIC_CC3_RPC_URL="https://rpc.cc3-testnet.creditcoin.network"
NEXT_PUBLIC_CC3_CHAIN_ID="102031"
```

### 4. Database Initialization (Optional)
To initialize the telemetry tables and populate historical verification operations:
```bash
pnpm db:seed
```

### 5. Launch the Local Development Server
```bash
pnpm dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to access the interface.

---

## 12. Threat Model & Cryptographic Guarantees

AetherRisk applies defense-in-depth principles across all execution tiers:

1. **Hardware-Enforced Memory Confidentiality**: The AMD SEV-SNP confidential enclave encrypts physical memory at the silicon level using ephemeral AES-128 keys generated by the AMD Secure Processor. Host hypervisors cannot access runtime state or secret signing keys.
2. **Cryptographic Replay Resistance**: Every EIP-712 attestation quote includes a sequential nonce tracked on-chain in `CreditRegistry.sol` (`enclaveNonces[signer]`), alongside the Creditcoin CC3 Chain ID (`102031`) and target contract address in the domain separator. Quotes cannot be submitted more than once or replayed across foreign chains.
3. **Double-Spend Mitigation**: Verified foreign receipts have their unique `transactionHash` and `logIndex` committed permanently to Substrate storage. A repayment event cannot trigger multiple credit score adjustments.
4. **Liquidation Rate-Limiting**: Grace periods initiated by `AetherRiskASC.sol` are constrained by an immutable upper bound of **30 minutes**, preventing counterparty attempts to freeze collateral auctions indefinitely.

---

## 13. License & Ecosystem References

This repository is distributed under the **MIT License**. Refer to the [LICENSE](LICENSE) file for terms of use.

### Technical References
* **Creditcoin Ecosystem (Gluwa)**: Substrate Native Precompile `0xFD2` (`BlockProver`) and `0xFD3` (`ChainInfo`) specification for zero-oracle foreign chain receipt verification.
* **Phala Network**: `dstack` confidential virtual machine runtime on AMD SEV-SNP hardware enclaves.
* **Google DeepMind**: **Google Gemini 3.5 Flash Lite** model runtime for structured institutional credit memo synthesis.

---

<p align="center">
  <strong>AetherRisk Protocol</strong><br/>
  <em>Deterministic Cross-Chain Credit Attestation for Creditcoin CC3</em>
</p>
