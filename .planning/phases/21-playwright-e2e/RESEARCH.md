# Phase 21 Research: Playwright E2E Test Suite Automation

## Objective
Implement `playwright.config.ts` and `tests/e2e/live-judge-flow.spec.ts` to automate the verification of the Zero-Empty-State Law, the 30-Second Zero-Wallet Judge Simulator Flow, and the TEE Remote Attestation Certificate Inspector.

## Test Suite Requirements

### 1. `playwright.config.ts`
- Uses `baseURL: 'http://localhost:3000'`
- Configures `webServer` with command `pnpm run dev`, port `3000`, `reuseExistingServer: true`.
- Headless execution with Chromium.
- Action and assertion timeouts tailored for asynchronous canvas steps (e.g. 15s - 30s).

### 2. `tests/e2e/live-judge-flow.spec.ts`
- **Test 1 (Zero-Empty-State Telemetry Verification)**:
  - Navigates to `/operations`.
  - Asserts `data-testid="telemetry-table"` is visible.
  - Asserts `data-testid="operation-row"` count $\ge 10$.
  - Asserts at least one row contains text `"VERIFIED"` and `"0xFD2"`.
  - Asserts zero unhandled console errors.
- **Test 2 (30-Second Zero-Wallet Judge Simulator Flow)**:
  - Navigates to `/sandbox` (or `/`).
  - Asserts `data-testid="interactive-sandbox"` is present.
  - Selects persona `data-testid="persona-btn-apex"`.
  - Asserts initial score contains `"620"`.
  - Clicks `data-testid="simulate-repay-btn"`.
  - Waits for `data-testid="visual-pipeline-canvas"` steps to complete.
  - Asserts `data-testid="precompile-verified-badge"` is visible and contains `"0xFD2"`.
  - Asserts final updated score contains `"810"`.
- **Test 3 (TEE Enclave Attestation Certificate Modal)**:
  - Clicks button to open TEE attestation modal.
  - Asserts modal dialog is visible.
  - Asserts AMD SEV-SNP hardware quote hash and signer address are rendered.
  - Closes modal.

## Verification Gate
- `rtk npx playwright test` passes all tests.
