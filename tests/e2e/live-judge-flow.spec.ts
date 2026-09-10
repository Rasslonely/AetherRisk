import { test, expect } from '@playwright/test';

test.describe('AetherRisk Grand-Prize E2E Judge Flow Suite', () => {
  test('Test 1: Zero-Empty-State Law — Telemetry Feed displays >= 10 verified operations without blank state', async ({
    page,
  }) => {
    await page.goto('/operations');

    // 1. Assert telemetry table container exists and is visible
    const table = page.locator('[data-testid="telemetry-table"]');
    await expect(table).toBeVisible({ timeout: 15000 });

    // 2. Assert at least 10 operation rows are rendered
    const rows = page.locator('[data-testid="operation-row"]');
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(10);

    // 3. Assert verified badges and precompile references exist in rows
    const firstRow = rows.first();
    await expect(firstRow).toContainText('VERIFIED');
    await expect(firstRow).toContainText('0xFD2');
  });

  test('Test 2: 30-Second Zero-Wallet Judge Simulator — 4-Phase Stepper and Distressed (620) to Prime (810) state morphing', async ({
    page,
  }) => {
    await page.goto('/sandbox');

    // 1. Assert Sandbox container is visible
    const sandbox = page.locator('[data-testid="interactive-sandbox"]');
    await expect(sandbox).toBeVisible({ timeout: 15000 });

    // 2. Select Apex Commodities persona
    const apexBtn = page.locator('[data-testid="persona-btn-apex"]');
    await expect(apexBtn).toBeVisible({ timeout: 10000 });
    await apexBtn.click();

    // 3. Assert initial distressed state score reads 620
    const beforeScoreVal = page.locator('[data-testid="credit-score-value"]');
    await expect(beforeScoreVal).toContainText('620');

    // 4. Click Simulate Repayment button
    const simulateBtn = page.locator('[data-testid="simulate-repay-btn"]');
    await expect(simulateBtn).toBeVisible({ timeout: 10000 });
    await simulateBtn.click();

    // 5. Assert 4-Phase Stepper Canvas is visible during execution
    const canvas = page.locator('[data-testid="visual-pipeline-canvas"]');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // 6. Wait for Precompile 0xFD2 verified badge to appear
    const precompileBadge = page.locator('[data-testid="precompile-verified-badge"]');
    await expect(precompileBadge).toBeVisible({ timeout: 35000 });
    await expect(precompileBadge).toContainText('0xFD2');

    // 7. Assert updated AFTER score morphs to 810 (Prime Tier)
    const afterScoreVal = page.locator('[data-testid="after-credit-score-value"]');
    await expect(afterScoreVal).toContainText('810', { timeout: 35000 });

    // 8. Assert Health Factor in AFTER card reaches 1.84
    const afterHealthVal = page.locator('[data-testid="after-health-factor-value"]');
    await expect(afterHealthVal).toContainText('1.84');
  });

  test('Test 3: Hardware TEE Remote Attestation — AMD SEV-SNP Quote and EIP-712 Signature Modal', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open Live Web3 dApp dropdown to reveal TEE proof trigger
    const web3Trigger = page.locator('[data-testid="mode-switcher"] button:has-text("Live Web3")');
    if (await web3Trigger.isVisible()) {
      await web3Trigger.click();
    }

    // 2. Trigger TEE Attestation button
    const teeBtn = page.locator('[data-testid="tee-cert-btn"]');
    await expect(teeBtn).toBeVisible({ timeout: 15000 });
    await teeBtn.click();

    // 3. Assert Modal Dialog appears
    const modal = page.locator('[data-testid="enclave-cert-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 4. Assert Hardware Quote measurement hash and TEE signer are present
    await expect(modal).toContainText('AMD SEV-SNP');
    await expect(modal).toContainText('0x8891');
    await expect(modal).toContainText('0x90F7');

    // 5. Close modal
    const closeBtn = modal.locator('button:has-text("Close")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('Test 4: Verified On-Chain Contracts Explorer Modal — 5 Contracts on Creditcoin CC3 & Sepolia', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Open Live Web3 dApp dropdown to reveal Contracts trigger
    const web3Trigger = page.locator('[data-testid="mode-switcher"] button:has-text("Live Web3")');
    if (await web3Trigger.isVisible()) {
      await web3Trigger.click();
    }

    // 2. Trigger Verified Contracts button
    const contractsBtn = page.locator('[data-testid="verified-contracts-btn"]').first();
    await expect(contractsBtn).toBeVisible({ timeout: 15000 });
    await contractsBtn.click();

    // 3. Assert Modal Dialog appears
    const modal = page.locator('[data-testid="verified-contracts-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 4. Assert all deployed contract addresses exist
    await expect(modal).toContainText('CreditRegistry.sol');
    await expect(modal).toContainText('AetherRiskASC.sol');
    await expect(modal).toContainText('AetherVault4626.sol');
    await expect(modal).toContainText('MockInstitutionalUSDC.sol');
    await expect(modal).toContainText('SepoliaLendingEmitter.sol');
    await expect(modal).toContainText('0x592380E737758285C809F92e8De176C7ECBC1015');

    // 5. Close modal
    const closeBtn = modal.locator('button:has-text("Close")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('Test 5: Multi-Wallet Web3 Provider & CC3 Switcher Modal — EIP-6963 Discovery & Network Parameters', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Assert Connect Wallet button exists in Navbar
    const connectBtn = page.locator('[data-testid="connect-wallet-btn"]');
    await expect(connectBtn).toBeVisible({ timeout: 15000 });
    await expect(connectBtn).toContainText('Connect Wallet');

    // 2. Click Connect Wallet to open Modal
    await connectBtn.click();

    // 3. Assert WalletModal renders with EIP-6963 and CC3 details
    const modal = page.locator('[data-testid="wallet-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(modal).toContainText('Creditcoin CC3');
    await expect(modal).toContainText('102031');

    // 4. Close modal
    const closeBtn = modal.locator('button:has-text("Close")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('Test 6: 1-Click Institutional Faucet Modal — 10,000 iUSDC Capital Provisioning & CC3 Gas', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Trigger Faucet button in Navbar
    const faucetBtn = page.locator('[data-testid="faucet-modal-btn"]');
    await expect(faucetBtn).toBeVisible({ timeout: 15000 });
    await expect(faucetBtn).toContainText(/10k/i);
    await faucetBtn.click();

    // 2. Assert FaucetModal renders
    const modal = page.locator('[data-testid="faucet-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(modal).toContainText('10,000 iUSDC');
    await expect(modal).toContainText('Creditcoin CC3');
    await expect(modal).toContainText('102031');

    // 3. Assert Claim action button exists
    const claimBtn = modal.locator('[data-testid="faucet-claim-btn"]');
    await expect(claimBtn).toBeVisible();

    // 4. Close modal
    const closeBtn = modal.locator('button:has-text("Close")').or(modal.locator('button:has(svg.lucide-x)'));
    if (await closeBtn.first().isVisible()) {
      await closeBtn.first().click();
    }
  });

  test('Test 7: Live Institutional Lending Desk (/vault) — ERC-4626 Metrics, 4-Tab Operations, & Dynamic Rate Curve', async ({
    page,
  }) => {
    await page.goto('/vault');

    // 1. Assert on-chain metrics grid renders
    const totalAssetsCard = page.locator('[data-testid="metric-total-assets"]');
    await expect(totalAssetsCard).toBeVisible({ timeout: 15000 });
    await expect(totalAssetsCard).toContainText('Total Liquidity');
    await expect(totalAssetsCard).toContainText('50,000');

    const debtCard = page.locator('[data-testid="metric-user-debt"]');
    await expect(debtCard).toBeVisible();

    // 2. Assert Dynamic Rate Curve visualizer renders
    const rateCurve = page.locator('[data-testid="rate-curve-visualizer"]');
    await expect(rateCurve).toBeVisible();
    await expect(rateCurve).toContainText('Dynamic Risk-Adjusted Interest Curve');
    await expect(rateCurve).toContainText('AAA Prime');

    // 3. Assert Vault Operations Card and 4 action tabs exist
    const opsCard = page.locator('[data-testid="vault-operations-card"]');
    await expect(opsCard).toBeVisible();

    const tabDeposit = page.locator('[data-testid="tab-deposit"]');
    const tabBorrow = page.locator('[data-testid="tab-borrow"]');
    const tabRepay = page.locator('[data-testid="tab-repay"]');
    const tabWithdraw = page.locator('[data-testid="tab-withdraw"]');

    await expect(tabDeposit).toBeVisible();
    await expect(tabBorrow).toBeVisible();
    await expect(tabRepay).toBeVisible();
    await expect(tabWithdraw).toBeVisible();

    // 4. Switch between operation tabs and verify input responsiveness
    await tabBorrow.click();
    const amountInput = page.locator('[data-testid="vault-amount-input"]');
    await expect(amountInput).toBeVisible();

    await tabRepay.click();
    await expect(amountInput).toBeVisible();

    await tabWithdraw.click();
    await expect(amountInput).toBeVisible();

    await tabDeposit.click();
    await expect(amountInput).toBeVisible();

    // 5. Assert In-Page Telemetry Modal opens without leaving /vault
    const viewProofsBtn = page.locator('button:has-text("View All 18 Proofs")');
    await expect(viewProofsBtn).toBeVisible();
    await viewProofsBtn.click();

    const telemetryModal = page.locator('[data-testid="telemetry-modal"]');
    await expect(telemetryModal).toBeVisible({ timeout: 10000 });
    await expect(telemetryModal).toContainText('Verified Cross-Chain Solvency Ledger');
    await expect(telemetryModal).toContainText('0xFD2');
    expect(page.url()).toContain('/vault');

    // Close modal via close button
    const closeBtn = telemetryModal.locator('button[aria-label="Close modal"]').or(telemetryModal.locator('button:has-text("Close Viewer")'));
    await closeBtn.first().click();
    await expect(telemetryModal).not.toBeVisible();
  });

  test('Test 8: Live On-Chain Credit Passport (/passport) — CreditRegistry Inspector & Hardware TEE Attestation', async ({
    page,
  }) => {
    await page.goto('/passport');

    // 1. Assert Passport Hero & Contract Links
    await expect(page.locator('h1')).toContainText('Credit Passport');

    // 2. Assert Credit Passport Card
    const passportCard = page.locator('[data-testid="credit-passport-card"]');
    await expect(passportCard).toBeVisible({ timeout: 15000 });

    // 3. Assert Hardware TEE boundary
    await expect(passportCard).toContainText('Hardware TEE Enclave Proof Boundary');
    await expect(passportCard).toContainText('CreditRegistry Contract');

    // 4. Test quick lookup pills
    const quickPill = page.locator('button:has-text("SolarGrid Africa")').first();
    if (await quickPill.isVisible()) {
      await quickPill.click();
      await expect(passportCard).toBeVisible();
    }
  });

  test('Test 9: Remnara Institutional Compliance Modal & Dual-Mode Navigation Switcher', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Assert Mode Switcher in Navbar
    const modeSwitcher = page.locator('[data-testid="mode-switcher"]');
    await expect(modeSwitcher).toBeVisible({ timeout: 15000 });
    await expect(modeSwitcher).toContainText(/Live/i);
    await expect(modeSwitcher).toContainText(/Sandbox/i);

    // 2. Open Terms Modal via Navbar
    const termsBtn = page.locator('[data-testid="terms-modal-btn"]');
    await expect(termsBtn).toBeVisible({ timeout: 15000 });
    await termsBtn.click();

    const termsModal = page.locator('[data-testid="terms-modal"]');
    await expect(termsModal).toBeVisible({ timeout: 15000 });
    await expect(termsModal).toContainText('Terms of Use');
    await expect(termsModal).toContainText('Non-Custodial');
    await expect(termsModal).toContainText('Precompile 0xFD2');

    // Click Accept button
    const acceptBtn = page.locator('[data-testid="accept-terms-btn"]');
    await expect(acceptBtn).toBeVisible({ timeout: 10000 });
    await acceptBtn.click();
    await expect(termsModal).not.toBeVisible({ timeout: 10000 });
  });
});
