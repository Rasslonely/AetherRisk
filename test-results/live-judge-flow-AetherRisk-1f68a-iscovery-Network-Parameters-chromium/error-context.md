# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-judge-flow.spec.ts >> AetherRisk Grand-Prize E2E Judge Flow Suite >> Test 5: Multi-Wallet Web3 Provider & CC3 Switcher Modal — EIP-6963 Discovery & Network Parameters
- Location: tests\e2e\live-judge-flow.spec.ts:121:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="wallet-modal"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="wallet-modal"]')

```

```yaml
- banner:
  - navigation:
    - link "AetherRiskINSTITUTIONAL UNDERWRITER":
      - /url: /
      - img
      - text: AetherRiskINSTITUTIONAL UNDERWRITER
    - text: Creditcoin CC3
    - link "Executive Overview":
      - /url: /
    - link "Operations Feed":
      - /url: /operations
    - link "Risk Sandbox":
      - /url: /sandbox
    - button "Verified ContractsContracts":
      - img
      - text: Verified ContractsContracts
    - button "TEE Attestation":
      - img
      - text: TEE Attestation
    - button "Connect Wallet":
      - img
      - text: Connect Wallet
- main:
  - text: Creditcoin CC3 Testnet · Substrate Precompile 0xFD2
  - heading "Autonomous TEE-Guarded Cross-Chain Credit & Liquidation Underwriter" [level=1]
  - paragraph: Eliminating 15-minute cross-chain oracle sync latency and false liquidations by verifying source-chain transactions synchronously in Creditcoin CC3 precompile bytecode within 15 seconds.
  - link "Launch Risk Sandbox":
    - /url: "#sandbox-section"
    - img
    - text: Launch Risk Sandbox
    - img
  - link "Explore Verified Operations":
    - /url: /operations
    - img
    - text: Explore Verified Operations
  - text: Total Volume Proven
  - img
  - text: $8,450,000
  - img
  - text: 18 Verified Events Precompile Verification
  - img
  - text: 12.4s
  - img
  - text: Native Substrate 0xFD2 Institutional Personas
  - img
  - text: 3 Entities
  - img
  - text: Global Trade & DePIN Max Bayesian Score Delta
  - img
  - text: +190 pts
  - img
  - text: 620 → 810 Prime Re-rate
  - img
  - text: Autonomous Risk EngineCreditcoin CC3 Fast-Path
  - heading "Institutional Risk Mutation Simulator" [level=2]
  - paragraph: Synchronous cross-chain credit re-underwriting on Creditcoin CC3 in real time
  - button "ApexGlobal":
    - img
    - text: ApexGlobal
  - button "SolarGridRenewable":
    - img
    - text: SolarGridRenewable
  - button "AlphaInstitutional":
    - img
    - text: AlphaInstitutional
  - img
  - text: T-0 State • Initial Risk Tier
  - heading "Apex Commodities Corp" [level=3]
  - text: "● LIQUIDATION WARNING Credit ScoreSubprime Tier 620/ 850 Health Factor< 1.00 Danger 0.87HF Borrowing APY 9.2%Rate Credit Limit $1,200,000 Pending Event: LOAN_REPAID $250,000 USDCSepolia L1"
  - img
  - text: T+15s Re-underwritten State
  - heading "Apex Commodities Corp" [level=3]
  - text: ○ AWAITING SIMULATION Credit Score ---/ 850 Health Factor ---HF Borrowing APY --- Credit Limit --- Hardware AttestationStanding By
  - button "Simulate Repayment ($250,000 USDC)":
    - img
    - text: Simulate Repayment ($250,000 USDC)
    - img
  - img
  - text: Synchronous Substrate Precompile Bytecode
  - img
  - heading "Synchronous Cross-Chain Attestation PipelinePrecompile 0xFD2" [level=3]
  - paragraph: Live Substrate bytecode verification of Ethereum L1 facts in < 15s without centralized oracles
  - img
  - text: PIPELINE READY
  - img
  - text: 0.0s – 0.5s
  - img
  - heading "1. Source Tx Mined (Sepolia L1)" [level=4]
  - paragraph: Event Emitted & Block Finalized
  - paragraph: "LOAN_REPAID • $250,000 USDC (Block #6192840)"
  - text: ○ Standby
  - link "Explorer":
    - /url: https://sepolia.etherscan.io/tx/0x8b3f71c08e102938472918293847192837461928374619283746192837461928
    - text: Explorer
    - img
  - img
  - text: 0.5s – 8.0s
  - img
  - heading "2. Cross-Chain Attestation" [level=4]
  - paragraph: Attestcoin Protocol Ingestion
  - paragraph: Header tracking & continuity endpoint sync
  - text: ○ Standby
  - img
  - text: 8.0s – 10.0s
  - img
  - heading "3. Merkle & Continuity Proof" [level=4]
  - paragraph: Cryptographic Inclusion Proof Built
  - paragraph: "Merkle Root: 0x4a9d71c89018...46192837 (2 Siblings)"
  - text: ○ Standby 10.0s – 12.4s
  - img
  - heading "4. Precompile 0xFD2 Verified" [level=4]
  - paragraph: Synchronous Substrate EVM Call
  - paragraph: INativeQueryVerifier.verifySingle(receipt.status == 0x1)
  - text: ○ Standby
  - link "Explorer":
    - /url: https://creditcoin3-testnet.subscan.io/tx/0x7f4a8c91d03be182938471928374619283746192837461928374619283746192
    - text: Explorer
    - img
  - img
  - text: Synchronous Architecture
  - heading "Dual-Engine Architectural Matrix" [level=2]
  - paragraph: Engine 1 delivers hard-tech Substrate precompile primitives; Engine 2 provides confidential TEE risk underwriting.
  - img
  - text: Engine 1 • Smart Contract Primitives
  - heading "Creditcoin CC3 Precompile Core" [level=3]
  - list:
    - listitem:
      - img
      - strong: 0xFD2 BlockProver
      - text: ": Synchronously verifies Merkle inclusion proofs directly in Substrate bytecode without external relayer lag."
    - listitem:
      - img
      - strong: 0xFD3 ChainInfo
      - text: ": Validates finality and header progression on Ethereum Sepolia."
    - listitem:
      - img
      - strong: EvmV1Decoder
      - text: ": Extracts execution receipt status (`0x1`) with strict replay protection mapping."
    - listitem:
      - img
      - strong: CreditRegistry.sol
      - text: ": On-chain credit scoring governed by authorized TEE enclave signers."
  - img
  - text: Engine 2 • Risk Underwriting
  - heading "Confidential TEE Risk Underwriter" [level=3]
  - list:
    - listitem:
      - img
      - strong: Triple-Layer Proof Resilience
      - text: ": Live Prover RPC (5s timeout) → Database Cache → Deterministic Mock for 100% demo uptime."
    - listitem:
      - img
      - strong: AMD SEV-SNP TEE Attestation
      - text: ": Ephemeral EIP-712 typed signing inside confidential hardware containers."
    - listitem:
      - img
      - strong: Bayesian Risk Kernel
      - text: ": Dynamically adjusts institutional borrowing APY (4.1% to 9.2%) and unlocks credit limits."
    - listitem:
      - img
      - strong: AetherVault4626
      - text: ": Dynamic-rate ERC-4626 institutional lending pool adjusting yield in real time."
  - img
  - heading "Bayesian Risk Metric Radar6-Axis Matrix" [level=3]
  - paragraph: Multi-dimensional underwriter confidence profile for Apex Commodities Corp
  - text: T-0 Distress T+15s Prime
  - img: Credit Score Health Factor Liquidity Coverage Collateral Quality Volatility Defense Settlement Velocity
  - text: Credit Score 620→810 Health Factor 0.87→1.84 Liquidity Coverage 48%→89% Collateral Quality 52%→94% Volatility Defense 45%→91% Settlement Velocity 38%→98%
  - img
  - text: Verified Operations StreamSubstrate 0xFD2
  - heading "Recent Verified Telemetry" [level=2]
  - paragraph: Latest 5 cross-chain operations verified synchronously on Creditcoin CC3
  - button "Refresh Stream":
    - img
    - text: Refresh Stream
  - table:
    - rowgroup:
      - row "Tx Code Borrower Entity Type Proven Volume Credit Score Delta Proof Source & Precompile Status Explorers":
        - columnheader "Tx Code":
          - text: Tx Code
          - img
        - columnheader "Borrower Entity"
        - columnheader "Type"
        - columnheader "Proven Volume"
        - columnheader "Credit Score Delta"
        - columnheader "Proof Source & Precompile"
        - columnheader "Status"
        - columnheader "Explorers"
    - rowgroup:
      - row "#TX-901Aug 25, 02:15 PM Apex Commodities Corp0x3aF8...910B LOAN REPAID $250,000USDC +42 pts(740 → 782) CACHED REAL ⚡ 11.2s • Native 0xFD2 VERIFIED SepoliaCC3":
        - cell "#TX-901Aug 25, 02:15 PM"
        - cell "Apex Commodities Corp0x3aF8...910B"
        - cell "LOAN REPAID"
        - cell "$250,000USDC"
        - cell "+42 pts(740 → 782)":
          - img
          - text: +42 pts(740 → 782)
        - cell "CACHED REAL ⚡ 11.2s • Native 0xFD2"
        - cell "VERIFIED":
          - img
          - text: VERIFIED
        - cell "SepoliaCC3":
          - link "Sepolia":
            - /url: https://sepolia.etherscan.io/tx/0x8b3f71c08e102938472918293847192837461928374619283746192837461928
            - text: Sepolia
            - img
          - link "CC3":
            - /url: https://creditcoin3-testnet.subscan.io/tx/0x7f4a8c91d03be182938471928374619283746192837461928374619283746192
            - text: CC3
            - img
      - row "#TX-902Aug 25, 01:50 PM SolarGrid Africa Ltd0x98b1...2901 COLLATERAL ADDED $117,000stETH +65 pts(610 → 675) CACHED REAL ⚡ 13.8s • Native 0xFD2 VERIFIED SepoliaCC3":
        - cell "#TX-902Aug 25, 01:50 PM"
        - cell "SolarGrid Africa Ltd0x98b1...2901"
        - cell "COLLATERAL ADDED"
        - cell "$117,000stETH"
        - cell "+65 pts(610 → 675)":
          - img
          - text: +65 pts(610 → 675)
        - cell "CACHED REAL ⚡ 13.8s • Native 0xFD2"
        - cell "VERIFIED":
          - img
          - text: VERIFIED
        - cell "SepoliaCC3":
          - link "Sepolia":
            - /url: https://sepolia.etherscan.io/tx/0x1928374619283746192837461928374619283746192837461928374619283746
            - text: Sepolia
            - img
          - link "CC3":
            - /url: https://creditcoin3-testnet.subscan.io/tx/0x892a01ce94b19283746192837461928374619283746192837461928374619283
            - text: CC3
            - img
      - row "#TX-903Aug 25, 01:10 PM Alpha Quant Arbitrage0x12c4...aa12 DEBT SETTLED $1,200,000DAI +18 pts(810 → 828) CACHED REAL ⚡ 10.9s • Native 0xFD2 VERIFIED SepoliaCC3":
        - cell "#TX-903Aug 25, 01:10 PM"
        - cell "Alpha Quant Arbitrage0x12c4...aa12"
        - cell "DEBT SETTLED"
        - cell "$1,200,000DAI"
        - cell "+18 pts(810 → 828)":
          - img
          - text: +18 pts(810 → 828)
        - cell "CACHED REAL ⚡ 10.9s • Native 0xFD2"
        - cell "VERIFIED":
          - img
          - text: VERIFIED
        - cell "SepoliaCC3":
          - link "Sepolia":
            - /url: https://sepolia.etherscan.io/tx/0x9928374619283746192837461928374619283746192837461928374619283746
            - text: Sepolia
            - img
          - link "CC3":
            - /url: https://creditcoin3-testnet.subscan.io/tx/0x44bc0991ae881928374619283746192837461928374619283746192837461928
            - text: CC3
            - img
      - row "#TX-904Aug 25, 12:30 PM Nairobi Agri-Export Ltd0x88f1...b288 INVOICE PAID $85,000USDC +80 pts(550 → 630) CACHED REAL ⚡ 14.1s • Native 0xFD2 VERIFIED SepoliaCC3":
        - cell "#TX-904Aug 25, 12:30 PM"
        - cell "Nairobi Agri-Export Ltd0x88f1...b288"
        - cell "INVOICE PAID"
        - cell "$85,000USDC"
        - cell "+80 pts(550 → 630)":
          - img
          - text: +80 pts(550 → 630)
        - cell "CACHED REAL ⚡ 14.1s • Native 0xFD2"
        - cell "VERIFIED":
          - img
          - text: VERIFIED
        - cell "SepoliaCC3":
          - link "Sepolia":
            - /url: https://sepolia.etherscan.io/tx/0x7728374619283746192837461928374619283746192837461928374619283746
            - text: Sepolia
            - img
          - link "CC3":
            - /url: https://creditcoin3-testnet.subscan.io/tx/0x61a80c43ef119283746192837461928374619283746192837461928374619283
            - text: CC3
            - img
      - row "#TX-905Aug 25, 11:45 AM Delta Yield Liquidity Vault0x51c2...e151 COLLATERAL ADDED $120,000CTC +30 pts(710 → 740) CACHED REAL ⚡ 12s • Native 0xFD2 VERIFIED SepoliaCC3":
        - cell "#TX-905Aug 25, 11:45 AM"
        - cell "Delta Yield Liquidity Vault0x51c2...e151"
        - cell "COLLATERAL ADDED"
        - cell "$120,000CTC"
        - cell "+30 pts(710 → 740)":
          - img
          - text: +30 pts(710 → 740)
        - cell "CACHED REAL ⚡ 12s • Native 0xFD2"
        - cell "VERIFIED":
          - img
          - text: VERIFIED
        - cell "SepoliaCC3":
          - link "Sepolia":
            - /url: https://sepolia.etherscan.io/tx/0x6628374619283746192837461928374619283746192837461928374619283746
            - text: Sepolia
            - img
          - link "CC3":
            - /url: https://creditcoin3-testnet.subscan.io/tx/0x9021bf99ac421928374619283746192837461928374619283746192837461928
            - text: CC3
            - img
  - text: Showing 5 of 18 verified operationsSynchronously verified via BlockProver (0xFD2)
  - link "View Full 18 Operations Telemetry Feed":
    - /url: /operations
    - text: View Full 18 Operations Telemetry Feed
    - img
  - img
  - heading "Smart Contracts Deployed & Verified On-Chain5 Contracts" [level=4]
  - paragraph: Live on Creditcoin CC3 Testnet (102031) and Ethereum Sepolia (11155111).
  - button "View Verified Contracts":
    - img
    - text: View Verified Contracts
    - img
- contentinfo:
  - img
  - text: AetherRisk
  - paragraph: Autonomous Cross-Chain Credit Risk Engine · Creditcoin CC3
  - img
  - text: Creditcoin CC3 (0xFD2)
  - img
  - text: Attestcoin Protocol
  - img
  - text: Phala AMD SEV-SNP
  - img
  - text: ERC-4626 Vault
  - paragraph: Substrate EVM 0xFD2 · Phala AMD SEV-SNP TEE
```

# Test source

```ts
  36  |     await expect(apexBtn).toBeVisible({ timeout: 10000 });
  37  |     await apexBtn.click();
  38  | 
  39  |     // 3. Assert initial distressed state score reads 620
  40  |     const beforeScoreVal = page.locator('[data-testid="credit-score-value"]');
  41  |     await expect(beforeScoreVal).toContainText('620');
  42  | 
  43  |     // 4. Click Simulate Repayment button
  44  |     const simulateBtn = page.locator('[data-testid="simulate-repay-btn"]');
  45  |     await expect(simulateBtn).toBeVisible({ timeout: 10000 });
  46  |     await simulateBtn.click();
  47  | 
  48  |     // 5. Assert 4-Phase Stepper Canvas is visible during execution
  49  |     const canvas = page.locator('[data-testid="visual-pipeline-canvas"]');
  50  |     await expect(canvas).toBeVisible({ timeout: 10000 });
  51  | 
  52  |     // 6. Wait for Precompile 0xFD2 verified badge to appear
  53  |     const precompileBadge = page.locator('[data-testid="precompile-verified-badge"]');
  54  |     await expect(precompileBadge).toBeVisible({ timeout: 35000 });
  55  |     await expect(precompileBadge).toContainText('0xFD2');
  56  | 
  57  |     // 7. Assert updated AFTER score morphs to 810 (Prime Tier)
  58  |     const afterScoreVal = page.locator('[data-testid="after-credit-score-value"]');
  59  |     await expect(afterScoreVal).toContainText('810', { timeout: 35000 });
  60  | 
  61  |     // 8. Assert Health Factor in AFTER card reaches 1.84
  62  |     const afterHealthVal = page.locator('[data-testid="after-health-factor-value"]');
  63  |     await expect(afterHealthVal).toContainText('1.84');
  64  |   });
  65  | 
  66  |   test('Test 3: Hardware TEE Remote Attestation — AMD SEV-SNP Quote and EIP-712 Signature Modal', async ({
  67  |     page,
  68  |   }) => {
  69  |     await page.goto('/');
  70  | 
  71  |     // 1. Trigger TEE Attestation button in Navbar
  72  |     const teeBtn = page.locator('[data-testid="tee-cert-btn"]');
  73  |     await expect(teeBtn).toBeVisible({ timeout: 15000 });
  74  |     await teeBtn.click();
  75  | 
  76  |     // 2. Assert Modal Dialog appears
  77  |     const modal = page.locator('[data-testid="enclave-cert-modal"]');
  78  |     await expect(modal).toBeVisible({ timeout: 10000 });
  79  | 
  80  |     // 3. Assert Hardware Quote measurement hash and TEE signer are present
  81  |     await expect(modal).toContainText('AMD SEV-SNP');
  82  |     await expect(modal).toContainText('0x8891');
  83  |     await expect(modal).toContainText('0x90F7');
  84  | 
  85  |     // 4. Close modal
  86  |     const closeBtn = modal.locator('button:has-text("Close")');
  87  |     if (await closeBtn.isVisible()) {
  88  |       await closeBtn.click();
  89  |     }
  90  |   });
  91  | 
  92  |   test('Test 4: Verified On-Chain Contracts Explorer Modal — 5 Contracts on Creditcoin CC3 & Sepolia', async ({
  93  |     page,
  94  |   }) => {
  95  |     await page.goto('/');
  96  | 
  97  |     // 1. Trigger Verified Contracts button in Navbar
  98  |     const contractsBtn = page.locator('[data-testid="verified-contracts-btn"]');
  99  |     await expect(contractsBtn).toBeVisible({ timeout: 15000 });
  100 |     await contractsBtn.click();
  101 | 
  102 |     // 2. Assert Modal Dialog appears
  103 |     const modal = page.locator('[data-testid="verified-contracts-modal"]');
  104 |     await expect(modal).toBeVisible({ timeout: 10000 });
  105 | 
  106 |     // 3. Assert all deployed contract addresses exist
  107 |     await expect(modal).toContainText('CreditRegistry.sol');
  108 |     await expect(modal).toContainText('AetherRiskASC.sol');
  109 |     await expect(modal).toContainText('AetherVault4626.sol');
  110 |     await expect(modal).toContainText('MockInstitutionalUSDC.sol');
  111 |     await expect(modal).toContainText('SepoliaLendingEmitter.sol');
  112 |     await expect(modal).toContainText('0x592380E737758285C809F92e8De176C7ECBC1015');
  113 | 
  114 |     // 4. Close modal
  115 |     const closeBtn = modal.locator('button:has-text("Close")');
  116 |     if (await closeBtn.isVisible()) {
  117 |       await closeBtn.click();
  118 |     }
  119 |   });
  120 | 
  121 |   test('Test 5: Multi-Wallet Web3 Provider & CC3 Switcher Modal — EIP-6963 Discovery & Network Parameters', async ({
  122 |     page,
  123 |   }) => {
  124 |     await page.goto('/');
  125 | 
  126 |     // 1. Assert Connect Wallet button exists in Navbar
  127 |     const connectBtn = page.locator('[data-testid="connect-wallet-btn"]');
  128 |     await expect(connectBtn).toBeVisible({ timeout: 15000 });
  129 |     await expect(connectBtn).toContainText('Connect Wallet');
  130 | 
  131 |     // 2. Click Connect Wallet to open Modal
  132 |     await connectBtn.click();
  133 | 
  134 |     // 3. Assert WalletModal renders with EIP-6963 and CC3 details
  135 |     const modal = page.locator('[data-testid="wallet-modal"]');
> 136 |     await expect(modal).toBeVisible({ timeout: 10000 });
      |                         ^ Error: expect(locator).toBeVisible() failed
  137 |     await expect(modal).toContainText('Creditcoin CC3');
  138 |     await expect(modal).toContainText('102031');
  139 | 
  140 |     // 4. Close modal
  141 |     const closeBtn = modal.locator('button:has-text("Close")');
  142 |     if (await closeBtn.isVisible()) {
  143 |       await closeBtn.click();
  144 |     }
  145 |   });
  146 | });
  147 | 
```