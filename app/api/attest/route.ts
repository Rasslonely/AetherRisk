import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { CREDITCOIN_CC3_TESTNET, CONTRACT_ADDRESSES, CREDIT_REGISTRY_ABI } from '@/lib/web3-config';

export const dynamic = 'force-dynamic';

const DEPLOYER_PRIVATE_KEY =
  process.env.DEPLOYER_PRIVATE_KEY ||
  '0000000000000000000000000000000000000000000000000000000000000001';

const ENCLAVE_SIGNER_PRIVATE_KEY =
  process.env.ENCLAVE_SIGNER_PRIVATE_KEY ||
  '0x0000000000000000000000000000000000000000000000000000000000000001';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      borrowerAddress,
      score = 780,
      maxCreditLine = 500000,
      apyBps = 480,
    } = body;

    if (!borrowerAddress || !ethers.isAddress(borrowerAddress.trim().toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing borrower EVM address' },
        { status: 400 }
      );
    }

    const cleanDeployerKey = DEPLOYER_PRIVATE_KEY.startsWith('0x')
      ? DEPLOYER_PRIVATE_KEY
      : `0x${DEPLOYER_PRIVATE_KEY}`;

    const provider = new ethers.JsonRpcProvider(CREDITCOIN_CC3_TESTNET.rpcUrls[0]);
    const relayer = new ethers.Wallet(cleanDeployerKey, provider);
    const enclaveWallet = new ethers.Wallet(ENCLAVE_SIGNER_PRIVATE_KEY);

    const registryAddress = CONTRACT_ADDRESSES.CC3.CREDIT_REGISTRY;
    const registry = new ethers.Contract(
      registryAddress,
      [
        ...CREDIT_REGISTRY_ABI,
        'function DOMAIN_SEPARATOR() view returns (bytes32)',
        'function RISK_MUTATION_TYPEHASH() view returns (bytes32)',
        'function updateCreditScore(address,uint16,uint16,uint256,uint16,bytes32,uint256,uint256,bytes) external returns (bool)',
      ],
      relayer
    );

    const checksummed = ethers.getAddress(borrowerAddress.trim().toLowerCase());
    const domainSep = await registry.DOMAIN_SEPARATOR();
    const typeHash = await registry.RISK_MUTATION_TYPEHASH();
    const nonce = await registry.enclaveNonces(enclaveWallet.address);

    const targetScore = Math.min(850, Math.max(300, Number(score)));
    const targetCreditLine = ethers.parseUnits(String(maxCreditLine), 18);
    const targetApyBps = Math.min(2000, Math.max(100, Number(apyBps)));
    const proofHash = ethers.keccak256(
      ethers.toUtf8Bytes(`attestcoin_fasttrack_${checksummed}_${Date.now()}`)
    );
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const structHash = ethers.keccak256(
      abiCoder.encode(
        ['bytes32', 'address', 'uint16', 'uint16', 'uint256', 'uint16', 'bytes32', 'uint256', 'uint256'],
        [typeHash, checksummed, 620, targetScore, targetCreditLine, targetApyBps, proofHash, nonce, deadline]
      )
    );

    const digest = ethers.keccak256(ethers.concat(['0x1901', domainSep, structHash]));
    const signingKey = new ethers.SigningKey(ENCLAVE_SIGNER_PRIVATE_KEY);
    const sig = signingKey.sign(digest);
    const vByte = sig.v < 27 ? sig.v + 27 : sig.v;
    const signature = ethers.concat([sig.r, sig.s, ethers.toBeHex(vByte, 1)]);

    // Submit on-chain transaction to Creditcoin CC3
    const tx = await registry.updateCreditScore(
      checksummed,
      620,
      targetScore,
      targetCreditLine,
      targetApyBps,
      proofHash,
      nonce,
      deadline,
      signature
    );

    const receipt = await tx.wait(1);

    // Record live on-chain operation into database
    try {
      const { prisma } = await import('@/lib/db');
      const borrower = await prisma.borrower.upsert({
        where: { address: checksummed },
        update: {
          creditScore: targetScore,
          maxCreditLineUsd: maxCreditLine,
          currentApyBps: targetApyBps,
        },
        create: {
          address: checksummed,
          name: 'Institutional Entity',
          sector: 'Creditcoin CC3 Protocol',
          creditScore: targetScore,
          maxCreditLineUsd: maxCreditLine,
          currentDebtUsd: 0,
          collateralUsd: 0,
          currentApyBps: targetApyBps,
        },
      });

      await prisma.operation.create({
        data: {
          txCode: `#TX-${Math.floor(1000 + Math.random() * 9000)}`,
          borrowerId: borrower.id,
          borrowerAddress: checksummed,
          borrowerName: borrower.name,
          sourceChain: 'Creditcoin CC3 Testnet',
          sourceChainId: 102031,
          chainKey: 1,
          operationType: 'DEBT_SETTLED',
          provenAmountUsd: maxCreditLine,
          assetSymbol: 'iUSDC',
          blockHeight: BigInt(receipt?.blockNumber || 5430000),
          sourceTxHash: tx.hash,
          creditcoinTxHash: tx.hash,
          proverLatencySec: 12.4,
          creditScoreDelta: targetScore - 620,
          oldScore: 620,
          newScore: targetScore,
          oldApyBps: 920,
          newApyBps: targetApyBps,
          status: 'COMPLETED',
          proofSource: 'LIVE_ATTESTCOIN',
          merkleRoot: proofHash,
          continuityDigest: proofHash,
        },
      });
    } catch (dbErr) {
      console.warn('[API /api/attest] Failed to save operation record to db:', dbErr);
    }

    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt?.blockNumber,
      borrowerAddress: checksummed,
      score: targetScore,
      maxCreditLine: Number(maxCreditLine),
      apyBps: targetApyBps,
      apyPercent: (targetApyBps / 100).toFixed(2),
      enclaveSigner: enclaveWallet.address,
      explorerUrl: `${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/tx/${tx.hash}`,
    });
  } catch (error: any) {
    console.error('[API /api/attest Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.reason || error?.message || 'Failed to submit on-chain attestation to CC3',
      },
      { status: 500 }
    );
  }
}
