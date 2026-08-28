import { PrismaClient } from '@prisma/client';
import { PRESEEDED_OPERATIONS, SIMULATION_PERSONAS } from '../lib/telemetry-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seeding for AetherRisk...');

  // 1. Seed Personas / Core Borrowers
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
        currentDebtUsd: Math.round(persona.currentCreditLine * 0.6),
        collateralUsd: Math.round(persona.currentCreditLine * 1.2),
        healthFactor: 1.25,
        currentApyBps: Math.round(persona.currentApy * 100),
        liquidationRisk: false,
      },
    });
  }

  // 2. Ensure all borrowers in PRESEEDED_OPERATIONS exist
  for (const op of PRESEEDED_OPERATIONS) {
    await prisma.borrower.upsert({
      where: { address: op.borrowerAddress },
      update: {
        name: op.borrowerName,
      },
      create: {
        address: op.borrowerAddress,
        name: op.borrowerName,
        sector: 'Institutional Cross-Chain Credit',
        creditScore: op.newScore,
        maxCreditLineUsd: 1500000.00,
        currentDebtUsd: 800000.00,
        collateralUsd: 1300000.00,
        healthFactor: 1.20,
        currentApyBps: op.newApyBps,
        liquidationRisk: false,
      },
    });
  }

  // 3. Seed 18 Historical Operations
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

      // 4. Seed CachedProof for Instant Resolution
      await prisma.cachedProof.upsert({
        where: { txHash: op.sourceTxHash },
        update: {},
        create: {
          txHash: op.sourceTxHash,
          chainKey: op.chainKey,
          blockHeight: BigInt(op.blockHeight),
          encodedTransactionHex: '0x02f87301820387843b9aca008502540be40082520894cf7ed3acca5a467e9e704c703e8d87f634fb0fc98084a9059cbb',
          merkleRoot: op.merkleRoot,
          siblingsJson: [
            {
              direction: 0,
              sibling: '0x33449901feda1928374619283746192837461928374619283746192837461928',
            },
          ],
          lowerEndpointDigest: op.continuityDigest,
          continuityRootsJson: [op.merkleRoot],
          proofSource: 'CACHED_REAL_PROOF',
        },
      });
    }
  }

  // 5. Seed EnclaveSigner (Hardware Remote Attestation Anchor)
  await prisma.enclaveSigner.upsert({
    where: { signerAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' },
    update: { isActive: true },
    create: {
      signerAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      hardwareQuoteId: 'AMD-SEV-SNP-PHALA-DSTACK-NODE-01',
      measurementHash: '0x8891029384719283746192837461928374619283746192837461928374619283',
      isActive: true,
    },
  });

  console.log(`[Seed] Successfully seeded ${PRESEEDED_OPERATIONS.length} operations, cached proofs, and TEE signers.`);
  console.log('[Seed] Zero-Empty-State Law satisfied.');
}

main()
  .catch((e) => {
    console.error('[Seed Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
