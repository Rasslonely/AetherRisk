# AETHERRISK: DEVOPS BILL OF MATERIALS & E2E PLAYWRIGHT SPEC
> **Standard:** Production Deployment BOM v6.0 | **CI/CD:** Vercel + GitHub Actions

---

## 1. VERCEL 1-PUSH DEPLOYMENT CONFIG

### A. `package.json`
```json
{
  "name": "aetherrisk-monolith",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && prisma db push && tsx scripts/seed-db.ts && next build",
    "start": "next start",
    "lint": "next lint",
    "test:e2e": "playwright test",
    "contracts:build": "cd contracts && forge build",
    "contracts:test": "cd contracts && forge test"
  },
  "dependencies": {
    "@gluwa/usc-sdk": "^1.0.0",
    "@neondatabase/serverless": "^0.10.4",
    "@prisma/client": "^6.0.0",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.1",
    "clsx": "^2.1.1",
    "ethers": "^6.13.4",
    "framer-motion": "^11.11.17",
    "lucide-react": "^0.460.0",
    "next": "15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.5.4",
    "viem": "^2.21.53"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@types/node": "^20.17.6",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "postcss": "^8.4.49",
    "prisma": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3"
  }
}
```

---

### B. `next.config.ts`
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
```

---

## 2. DATABASE MIGRATION & PRE-SEED SCRIPT (`scripts/seed-db.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { PRESEEDED_OPERATIONS, SIMULATION_PERSONAS } from '../lib/telemetry-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seeding for AetherRisk...');

  // 1. Seed Personas / Borrowers
  for (const persona of SIMULATION_PERSONAS) {
    await prisma.borrower.upsert({
      where: { address: persona.address },
      update: {
        name: persona.name,
        sector: persona.sector,
        creditScore: persona.currentScore,
        maxCreditLineUsd: persona.currentCreditLine,
        currentApyBps: Math.round(persona.currentApy * 100),
      },
      create: {
        address: persona.address,
        name: persona.name,
        sector: persona.sector,
        creditScore: persona.currentScore,
        maxCreditLineUsd: persona.currentCreditLine,
        currentApyBps: Math.round(persona.currentApy * 100),
      },
    });
  }

  // 2. Seed 18 Historical Operations
  for (const op of PRESEEDED_OPERATIONS) {
    const borrower = await prisma.borrower.findUnique({
      where: { address: op.borrowerAddress },
    });

    if (borrower) {
      await prisma.operation.upsert({
        where: { txCode: op.txCode },
        update: {},
        create: {
          txCode: op.txCode,
          borrowerId: borrower.id,
          borrowerAddress: op.borrowerAddress,
          borrowerName: op.borrowerName,
          sourceChain: op.sourceChain,
          sourceChainId: op.sourceChainId,
          chainKey: op.chainKey,
          operationType: op.operationType,
          provenAmountUsd: op.provenAmountUsd,
          assetSymbol: op.assetSymbol,
          blockHeight: BigInt(op.blockHeight),
          sourceTxHash: op.sourceTxHash,
          creditcoinTxHash: op.creditcoinTxHash,
          proverLatencySec: op.proverLatencySec,
          creditScoreDelta: op.creditScoreDelta,
          oldScore: op.oldScore,
          newScore: op.newScore,
          oldApyBps: op.oldApyBps,
          newApyBps: op.newApyBps,
          status: op.status,
          proofSource: op.proofSource,
          merkleRoot: op.merkleRoot,
          continuityDigest: op.continuityDigest,
          timestamp: new Date(op.timestamp),
        },
      });
    }
  }

  console.log(`[Seed] Successfully seeded ${PRESEEDED_OPERATIONS.length} operations. Zero empty states guaranteed.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 3. E2E PLAYWRIGHT VALIDATION SPEC (`tests/e2e/live-judge-flow.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('AetherRisk Grand-Prize E2E Validation Flow', () => {
  test('1. Zero-Empty-State Law: Live Telemetry page displays >= 10 rows', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/operations');
    await page.waitForSelector('[data-testid="telemetry-table"]');

    const rows = await page.$$('[data-testid="operation-row"]');
    expect(rows.length).toBeGreaterThanOrEqual(10);

    // Verify first row contains real explorer link and status badge
    const firstRow = rows[0];
    const explorerLink = await firstRow.$('a[href*="creditcoin.network"]');
    expect(explorerLink).not.toBeNull();

    expect(consoleErrors).toEqual([]);
  });

  test('2. 30-Second Judge Sandbox: Full State Transition in < 15 seconds', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/sandbox');

    // 1. Assert initial DANGER state (Red theme)
    await page.waitForSelector('[data-testid="persona-card-apex"]');
    const scoreBadge = await page.locator('[data-testid="score-counter"]').innerText();
    expect(scoreBadge).toContain('620');

    // 2. Click Simulate Repayment button
    const simulateBtn = page.locator('[data-testid="simulate-repay-btn"]');
    await expect(simulateBtn).toBeVisible();
    await simulateBtn.click();

    // 3. Assert Stepper activates and progresses
    await page.waitForSelector('[data-testid="precompile-verified-badge"]', { timeout: 15000 });
    const precompileBadge = await page.locator('[data-testid="precompile-verified-badge"]').innerText();
    expect(precompileBadge).toContain('Precompile 0xFD2');

    // 4. Assert State Transition to HEALTHY (Green theme)
    await page.waitForSelector('[data-testid="healthy-card-state"]', { timeout: 5000 });
    const newScore = await page.locator('[data-testid="score-counter"]').innerText();
    expect(newScore).toContain('810');

    // 5. Assert APY dropped and credit line increased
    const apyText = await page.locator('[data-testid="apy-display"]').innerText();
    expect(apyText).toContain('4.1%');

    // 6. Assert Zero console errors
    expect(consoleErrors).toEqual([]);
  });
});
```
