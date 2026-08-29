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

    // 1. Trigger TEE Attestation button in Navbar
    const teeBtn = page.locator('[data-testid="tee-cert-btn"]');
    await expect(teeBtn).toBeVisible({ timeout: 15000 });
    await teeBtn.click();

    // 2. Assert Modal Dialog appears
    const modal = page.locator('[data-testid="enclave-cert-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 3. Assert Hardware Quote measurement hash and TEE signer are present
    await expect(modal).toContainText('AMD SEV-SNP');
    await expect(modal).toContainText('0x8891');
    await expect(modal).toContainText('0x90F7');

    // 4. Close modal
    const closeBtn = modal.locator('button:has-text("Close")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('Test 4: Verified On-Chain Contracts Explorer Modal — 5 Contracts on Creditcoin CC3 & Sepolia', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Trigger Verified Contracts button in Navbar
    const contractsBtn = page.locator('[data-testid="verified-contracts-btn"]');
    await expect(contractsBtn).toBeVisible({ timeout: 15000 });
    await contractsBtn.click();

    // 2. Assert Modal Dialog appears
    const modal = page.locator('[data-testid="verified-contracts-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // 3. Assert all deployed contract addresses exist
    await expect(modal).toContainText('CreditRegistry.sol');
    await expect(modal).toContainText('AetherRiskASC.sol');
    await expect(modal).toContainText('AetherVault4626.sol');
    await expect(modal).toContainText('MockInstitutionalUSDC.sol');
    await expect(modal).toContainText('SepoliaLendingEmitter.sol');
    await expect(modal).toContainText('0x592380E737758285C809F92e8De176C7ECBC1015');

    // 4. Close modal
    const closeBtn = modal.locator('button:has-text("Close")');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });
});
