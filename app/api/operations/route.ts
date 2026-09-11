import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PRESEEDED_OPERATIONS } from '@/lib/telemetry-seed';
import { OperationRecord } from '@/lib/types';

export const dynamic = 'force-dynamic';

// In-memory cache for live operations submitted during session
let LIVE_MEMORY_OPERATIONS: OperationRecord[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const statusParam = searchParams.get('status');
    const borrowerAddressParam = searchParams.get('borrowerAddress');
    const proofSourceParam = searchParams.get('proofSource');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    let operations: OperationRecord[] = [...LIVE_MEMORY_OPERATIONS];

    try {
      const dbOperations = await prisma.operation.findMany({
        where: {
          ...(statusParam ? { status: statusParam as any } : {}),
          ...(borrowerAddressParam
            ? { borrowerAddress: { equals: borrowerAddressParam, mode: 'insensitive' } }
            : {}),
          ...(proofSourceParam ? { proofSource: proofSourceParam as any } : {}),
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
      });

      if (dbOperations && dbOperations.length > 0) {
        const mapped = dbOperations.map((op) => ({
          id: op.id,
          txCode: op.txCode,
          borrowerAddress: op.borrowerAddress,
          borrowerName: op.borrowerName,
          sourceChain: op.sourceChain,
          sourceChainId: op.sourceChainId,
          chainKey: op.chainKey,
          operationType: op.operationType as any,
          provenAmountUsd: Number(op.provenAmountUsd),
          assetSymbol: op.assetSymbol,
          blockHeight: Number(op.blockHeight),
          sourceTxHash: op.sourceTxHash,
          creditcoinTxHash: op.creditcoinTxHash || op.sourceTxHash,
          proverLatencySec: Number(op.proverLatencySec),
          creditScoreDelta: op.creditScoreDelta,
          oldScore: op.oldScore,
          newScore: op.newScore,
          oldApyBps: op.oldApyBps,
          newApyBps: op.newApyBps,
          status: op.status as any,
          proofSource: op.proofSource as any,
          merkleRoot: op.merkleRoot || '0x0',
          continuityDigest: op.continuityDigest || '0x0',
          timestamp: op.timestamp.toISOString(),
        }));

        // Deduplicate with in-memory ops
        const existingIds = new Set(operations.map((o) => o.id));
        for (const op of mapped) {
          if (!existingIds.has(op.id)) {
            operations.push(op);
          }
        }
      }
    } catch (dbError) {
      console.warn('[API /api/operations] Database query failed, falling back to pre-seeded dataset:', dbError);
    }

    // Merge with preseeded operations
    const existingIds = new Set(operations.map((o) => o.id));
    for (const op of PRESEEDED_OPERATIONS) {
      if (!existingIds.has(op.id)) {
        operations.push(op);
      }
    }

    // Apply filters
    if (statusParam) {
      operations = operations.filter((op) => op.status === statusParam);
    }
    if (borrowerAddressParam) {
      operations = operations.filter(
        (op) => op.borrowerAddress.toLowerCase() === borrowerAddressParam.toLowerCase()
      );
    }
    if (proofSourceParam && proofSourceParam !== 'ALL') {
      operations = operations.filter((op) => op.proofSource === proofSourceParam);
    }

    operations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    operations = operations.slice(0, limit);

    return NextResponse.json({
      success: true,
      count: operations.length,
      operations,
      data: operations,
    });
  } catch (error: any) {
    console.error('[API /api/operations Error]:', error);
    return NextResponse.json({
      success: true,
      count: PRESEEDED_OPERATIONS.length,
      operations: PRESEEDED_OPERATIONS,
      data: PRESEEDED_OPERATIONS,
      fallbackReason: error?.message || 'Server error',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newRecord: OperationRecord = {
      id: body.id || `op-live-${Date.now()}`,
      txCode: body.txCode || `#TX-${Math.floor(920 + Math.random() * 80)}`,
      borrowerAddress: body.borrowerAddress || '0x7a1b4d8120bA8812cE789A120188219001896b26',
      borrowerName: body.borrowerName || 'Connected Vault Participant',
      sourceChain: body.sourceChain || 'Creditcoin CC3 Testnet',
      sourceChainId: body.sourceChainId || 102031,
      chainKey: body.chainKey || 1,
      operationType: body.operationType || 'COLLATERAL_ADDED',
      provenAmountUsd: Number(body.provenAmountUsd) || 1000,
      assetSymbol: body.assetSymbol || 'iUSDC',
      blockHeight: Number(body.blockHeight) || 6192900,
      sourceTxHash: body.sourceTxHash || body.creditcoinTxHash || '0x0',
      creditcoinTxHash: body.creditcoinTxHash || body.sourceTxHash || '0x0',
      proverLatencySec: Number(body.proverLatencySec) || 12.4,
      creditScoreDelta: Number(body.creditScoreDelta) || 15,
      oldScore: Number(body.oldScore) || 780,
      newScore: Number(body.newScore) || 795,
      oldApyBps: Number(body.oldApyBps) || 480,
      newApyBps: Number(body.newApyBps) || 450,
      status: body.status || 'COMPLETED',
      proofSource: body.proofSource || 'LIVE_ATTESTCOIN',
      merkleRoot: body.merkleRoot || '0x0',
      continuityDigest: body.continuityDigest || '0x0',
      timestamp: new Date().toISOString(),
    };

    // Prepend to in-memory live operations
    LIVE_MEMORY_OPERATIONS.unshift(newRecord);

    // Also attempt saving to database asynchronously if prisma is available
    try {
      await prisma.operation.create({
        data: {
          id: newRecord.id,
          txCode: newRecord.txCode,
          borrowerAddress: newRecord.borrowerAddress,
          borrowerName: newRecord.borrowerName,
          sourceChain: newRecord.sourceChain,
          sourceChainId: newRecord.sourceChainId,
          chainKey: newRecord.chainKey,
          operationType: newRecord.operationType as any,
          provenAmountUsd: newRecord.provenAmountUsd,
          assetSymbol: newRecord.assetSymbol,
          blockHeight: newRecord.blockHeight,
          sourceTxHash: newRecord.sourceTxHash,
          creditcoinTxHash: newRecord.creditcoinTxHash,
          proverLatencySec: newRecord.proverLatencySec,
          creditScoreDelta: newRecord.creditScoreDelta,
          oldScore: newRecord.oldScore,
          newScore: newRecord.newScore,
          oldApyBps: newRecord.oldApyBps,
          newApyBps: newRecord.newApyBps,
          status: newRecord.status as any,
          proofSource: newRecord.proofSource as any,
          merkleRoot: newRecord.merkleRoot,
          continuityDigest: newRecord.continuityDigest,
          timestamp: new Date(newRecord.timestamp),
        },
      });
    } catch (dbErr) {
      console.warn('[API /api/operations POST] Could not persist to DB, in-memory live record active:', dbErr);
    }

    return NextResponse.json({
      success: true,
      operation: newRecord,
    });
  } catch (error: any) {
    console.error('[API /api/operations POST Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to record operation' },
      { status: 400 }
    );
  }
}
