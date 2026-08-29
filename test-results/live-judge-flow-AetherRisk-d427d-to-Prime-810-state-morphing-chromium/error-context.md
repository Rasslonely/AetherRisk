# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-judge-flow.spec.ts >> AetherRisk Grand-Prize E2E Judge Flow Suite >> Test 2: 30-Second Zero-Wallet Judge Simulator — 4-Phase Stepper and Distressed (620) to Prime (810) state morphing
- Location: tests\e2e\live-judge-flow.spec.ts:25:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="precompile-verified-badge"]')
Expected: visible
Timeout: 35000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 35000ms
  - waiting for locator('[data-testid="precompile-verified-badge"]')

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
  - img
  - text: Autonomous Risk SimulatorSubstrate Precompile 0xFD2
  - heading "Institutional Zero-Wallet Risk Sandbox" [level=1]
  - paragraph: Simulate cross-chain borrower repayments and test synchronous credit re-underwriting on Creditcoin CC3 in under 15 seconds without connecting an external wallet.
  - text: "Phala AMD SEV-SNP Enclave Signer: 0x90F7...b906 (EIP-712) Step 01"
  - heading "Select Borrower Persona" [level=3]
  - paragraph: Pick between Apex Commodities (Distress), SolarGrid Energy (Mid-Tier), or AlphaQuant (High Volume).
  - text: Step 02
  - heading "Simulate Cross-Chain Repayment" [level=3]
  - paragraph: Click "Simulate Cross-Chain Repayment" to trigger the 4-phase Substrate precompile verification pipeline.
  - text: Step 03
  - heading "Inspect TEE Attestation & Vault" [level=3]
  - paragraph: Examine the AMD SEV-SNP hardware quote, EIP-712 signature, and dynamic ERC-4626 APY discount.
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
  - heading "Bayesian Risk Metric Radar6-Axis Matrix" [level=3]
  - paragraph: Multi-dimensional underwriter confidence profile for Apex Commodities Corp
  - text: T-0 Distress T+15s Prime
  - img: Credit Score Health Factor Liquidity Coverage Collateral Quality Volatility Defense Settlement Velocity
  - text: Credit Score 620→810 Health Factor 0.87→1.84 Liquidity Coverage 48%→89% Collateral Quality 52%→94% Volatility Defense 45%→91% Settlement Velocity 38%→98%
  - img
  - heading "Why Synchronous Precompile Verification Matters" [level=3]
  - paragraph: Traditional vs Attestcoin Proof Architecture
  - paragraph:
    - text: Traditional cross-chain credit protocols rely on asynchronous multisig oracles that take 15–30 minutes to propagate L1 loan settlements. During volatile market conditions, this lag causes catastrophic
    - strong: false liquidations
    - text: of solvent institutions.
  - paragraph:
    - text: AetherRisk uses Creditcoin CC3's native
    - code: 0xFD2 BlockProver
    - text: precompile to query source-chain state root inclusion proofs synchronously inside EVM transaction execution, updating the on-chain
    - code: CreditRegistry.sol
    - text: within 12.4 seconds.
  - text: "// Creditcoin CC3 Native Call: INativeQueryVerifier(0x00...FD2).verifyBlockProof(targetBlock, receiptProof) ↳ Result: 0x01 (SUCCESS) • Gas: 23,400 units"
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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('AetherRisk Grand-Prize E2E Judge Flow Suite', () => {
  4   |   test('Test 1: Zero-Empty-State Law — Telemetry Feed displays >= 10 verified operations without blank state', async ({
  5   |     page,
  6   |   }) => {
  7   |     await page.goto('/operations');
  8   | 
  9   |     // 1. Assert telemetry table container exists and is visible
  10  |     const table = page.locator('[data-testid="telemetry-table"]');
  11  |     await expect(table).toBeVisible({ timeout: 15000 });
  12  | 
  13  |     // 2. Assert at least 10 operation rows are rendered
  14  |     const rows = page.locator('[data-testid="operation-row"]');
  15  |     await expect(rows.first()).toBeVisible({ timeout: 10000 });
  16  |     const count = await rows.count();
  17  |     expect(count).toBeGreaterThanOrEqual(10);
  18  | 
  19  |     // 3. Assert verified badges and precompile references exist in rows
  20  |     const firstRow = rows.first();
  21  |     await expect(firstRow).toContainText('VERIFIED');
  22  |     await expect(firstRow).toContainText('0xFD2');
  23  |   });
  24  | 
  25  |   test('Test 2: 30-Second Zero-Wallet Judge Simulator — 4-Phase Stepper and Distressed (620) to Prime (810) state morphing', async ({
  26  |     page,
  27  |   }) => {
  28  |     await page.goto('/sandbox');
  29  | 
  30  |     // 1. Assert Sandbox container is visible
  31  |     const sandbox = page.locator('[data-testid="interactive-sandbox"]');
  32  |     await expect(sandbox).toBeVisible({ timeout: 15000 });
  33  | 
  34  |     // 2. Select Apex Commodities persona
  35  |     const apexBtn = page.locator('[data-testid="persona-btn-apex"]');
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
> 54  |     await expect(precompileBadge).toBeVisible({ timeout: 35000 });
      |                                   ^ Error: expect(locator).toBeVisible() failed
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
  136 |     await expect(modal).toBeVisible({ timeout: 10000 });
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