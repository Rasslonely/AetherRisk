import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { SIMULATION_PERSONAS } from '@/lib/telemetry-seed';
import { OperationType, SimulationPersona } from '@/lib/types';

export const dynamic = 'force-dynamic';

const DEFAULT_ENCLAVE_PRIVATE_KEY =
  process.env.ENCLAVE_SIGNER_PRIVATE_KEY ||
  '0x0000000000000000000000000000000000000000000000000000000000000001';

const CC3_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CC3_CHAIN_ID || '102031', 10);
const CREDIT_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_CREDIT_REGISTRY_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      personaId = 'persona-apex',
      action = 'LOAN_REPAID' as OperationType,
      amountUsd,
      assetSymbol,
      fastForward = true,
    } = body;

    // Find requested or default persona
    const persona: SimulationPersona =
      SIMULATION_PERSONAS.find((p) => p.id === personaId) || SIMULATION_PERSONAS[0];

    // Calculate Bayesian Risk Mutation
    let oldScore = persona.currentScore;
    let newScore = persona.targetScore;
    let oldApyBps = Math.round(persona.currentApy * 100);
    let newApyBps = Math.round(persona.targetApy * 100);
    let newCreditLineUsd = persona.targetCreditLine;
    let healthFactor = 1.84;

    // Adjust metrics dynamically if persona or custom amount differs
    if (personaId === 'persona-solargrid') {
      oldScore = 610;
      newScore = 675;
      oldApyBps = 1050;
      newApyBps = 720;
      newCreditLineUsd = 750000;
      healthFactor = 1.45;
    } else if (personaId === 'persona-alphafund') {
      oldScore = 810;
      newScore = 828;
      oldApyBps = 410;
      newApyBps = 350;
      newCreditLineUsd = 6500000;
      healthFactor = 2.40;
    }

    const scoreDelta = newScore - oldScore;
    const operationId = `op-sim-${Date.now().toString(36)}`;
    const sourceTxHash = (
      '0x' +
      ethers
        .keccak256(ethers.toUtf8Bytes(`${persona.address}-${operationId}-source`))
        .slice(2)
    ) as `0x${string}`;

    const creditcoinTxHash = (
      '0x' +
      ethers
        .keccak256(ethers.toUtf8Bytes(`${persona.address}-${operationId}-cc3`))
        .slice(2)
    ) as `0x${string}`;

    const attestcoinProofHash = ethers.keccak256(
      ethers.toUtf8Bytes(`${sourceTxHash}-${persona.address}`)
    ) as `0x${string}`;

    const enclaveNonce = Math.floor(Date.now() / 1000);
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour validity

    // EIP-712 Signing via Enclave Key
    const wallet = new ethers.Wallet(DEFAULT_ENCLAVE_PRIVATE_KEY);
    const signerAddress = await wallet.getAddress();

    const domain = {
      name: 'AetherRisk CreditRegistry',
      version: '1',
      chainId: CC3_CHAIN_ID,
      verifyingContract: CREDIT_REGISTRY_ADDRESS,
    };

    const types = {
      CreditScoreUpdate: [
        { name: 'borrower', type: 'address' },
        { name: 'oldScore', type: 'uint16' },
        { name: 'newScore', type: 'uint16' },
        { name: 'maxCreditLineUsd', type: 'uint256' },
        { name: 'apyBps', type: 'uint16' },
        { name: 'attestcoinProofHash', type: 'bytes32' },
        { name: 'enclaveNonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const maxCreditLineWei = ethers.parseUnits(newCreditLineUsd.toString(), 18);

    const value = {
      borrower: ethers.getAddress(persona.address.toLowerCase()),
      oldScore,
      newScore,
      maxCreditLineUsd: maxCreditLineWei,
      apyBps: newApyBps,
      attestcoinProofHash,
      enclaveNonce,
      deadline,
    };

    const rawSignature = await wallet.signTypedData(domain, types, value);
    const sig = ethers.Signature.from(rawSignature);

    return NextResponse.json({
      success: true,
      operationId,
      sourceTxHash,
      creditcoinTxHash,
      persona: {
        id: persona.id,
        name: persona.name,
        sector: persona.sector,
        address: persona.address,
      },
      precompileVerification: {
        precompileAddress: '0x0000000000000000000000000000000000000FD2',
        verified: true,
        receiptStatus: '0x1',
        latencySec: 12.4,
        sourceBlock: 6192840,
        provenAmountUsd: amountUsd || persona.defaultAmount,
        assetSymbol: assetSymbol || persona.defaultAsset,
      },
      teeMutation: {
        signerAddress,
        borrower: persona.address,
        oldScore,
        newScore,
        scoreDelta,
        oldApyBps,
        newApyBps,
        newCreditLineUsd,
        healthFactor,
        attestcoinProofHash,
        enclaveNonce,
        deadline,
        signature: rawSignature,
        r: sig.r,
        s: sig.s,
        v: sig.v,
      },
      visualState: 'HEALTHY',
    });
  } catch (error: any) {
    console.error('[API /api/simulate Error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Simulation execution failed' },
      { status: 500 }
    );
  }
}
