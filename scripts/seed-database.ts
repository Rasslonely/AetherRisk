import { PrismaClient } from '@prisma/client';
import { PRESEEDED_OPERATIONS, SIMULATION_PERSONAS } from '../lib/telemetry-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Supabase PostgreSQL Database with Institutional Data...');

  // 1. Seed Borrowers
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
        currentDebtUsd: persona.currentCreditLine * 0.6,
        collateralUsd: persona.currentCreditLine * 1.25,
        healthFactor: 1.15,
        currentApyBps: Math.round(persona.currentApy * 100),
        liquidationRisk: persona.currentScore < 650,
      },
    });
  }
  console.log(`✅ Seeded ${SIMULATION_PERSONAS.length} Borrowers`);

  // 2. Ensure all 18 Borrowers exist before creating Operations
  const borrowerMap = new Map<string, string>();
  for (const op of PRESEEDED_OPERATIONS) {
    const existing = await prisma.borrower.upsert({
      where: { address: op.borrowerAddress },
      update: {
        name: op.borrowerName,
      },
      create: {
        address: op.borrowerAddress,
        name: op.borrowerName,
        sector: 'Institutional Credit Counterparty',
        creditScore: op.newScore,
        maxCreditLineUsd: 1500000,
        currentDebtUsd: 800000,
        collateralUsd: 1800000,
        healthFactor: 1.45,
        currentApyBps: op.newApyBps,
        liquidationRisk: false,
      },
    });
    borrowerMap.set(op.borrowerAddress, existing.id);
  }

  // 3. Seed Operations
  for (const op of PRESEEDED_OPERATIONS) {
    const borrowerId = borrowerMap.get(op.borrowerAddress)!;
    await prisma.operation.upsert({
      where: { txCode: op.txCode },
      update: {
        provenAmountUsd: op.provenAmountUsd,
        oldScore: op.oldScore,
        newScore: op.newScore,
        oldApyBps: op.oldApyBps,
        newApyBps: op.newApyBps,
        creditScoreDelta: op.creditScoreDelta,
        status: op.status as any,
        proofSource: op.proofSource as any,
      },
      create: {
        txCode: op.txCode,
        borrowerId,
        borrowerAddress: op.borrowerAddress,
        borrowerName: op.borrowerName,
        sourceChain: op.sourceChain,
        sourceChainId: op.sourceChainId,
        chainKey: op.chainKey,
        operationType: op.operationType as any,
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
        status: op.status as any,
        proofSource: op.proofSource as any,
        merkleRoot: op.merkleRoot || '0x4a9d7105797618ae928374619283746192837461928374619283746192837461',
        continuityDigest: op.continuityDigest || '0x91c0e81249bce781928374619283746192837461928374619283746192837461',
        timestamp: new Date(op.timestamp),
      },
    });
  }
  console.log(`✅ Seeded ${PRESEEDED_OPERATIONS.length} Verified Operations`);

  // 4. Seed Enclave Signer
  await prisma.enclaveSigner.upsert({
    where: { signerAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' },
    update: { isActive: true },
    create: {
      signerAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      hardwareQuoteId: 'AMD-SEV-SNP-PHALA-DSTACK-NODE-01',
      measurementHash: '0x8891029384719283746192837461928374619283746192837461928374619283',
      isActive: true,
    },
  });
  console.log(`✅ Seeded TEE Enclave Signer record`);

  console.log('\n🎉 Database Seeding 100% Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
