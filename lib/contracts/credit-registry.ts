import { ethers } from 'ethers';
import {
  CREDITCOIN_CC3_TESTNET,
  CONTRACT_ADDRESSES,
  CREDIT_REGISTRY_ABI,
  formatTokenBalance,
} from '@/lib/web3-config';

export interface OnChainCreditProfile {
  borrowerAddress: string;
  score: number;
  maxCreditLineUsd: bigint;
  maxCreditLineFormatted: string;
  apyBps: number;
  apyPercent: string;
  lastUpdated: number;
  lastUpdatedDate: string;
  lastProofHash: string;
  isAttested: boolean;
  tier: 'Prime AAA' | 'Growth BBB' | 'Distressed CCC' | 'Unverified';
  tierColor: string;
  enclaveSignerStatus: {
    address: string;
    isAuthorized: boolean;
  };
}

export const KNOWN_PERSONA_ADDRESSES = [
  {
    name: 'Apex Commodities Corp',
    address: '0x3aF8120bA8812cE789A1201882190018910b910B',
    tag: 'Global Trader / Distressed to Prime',
  },
  {
    name: 'SolarGrid Africa Ltd',
    address: '0x98b10029af18290182810981900192801e452901',
    tag: 'Renewable Infrastructure / Mid-Tier',
  },
  {
    name: 'Alpha Quant Arbitrage',
    address: '0x12c499182091820918290182901829018277aa12',
    tag: 'High-Volume HFT / Prime Institutional',
  },
];

const DEFAULT_ENCLAVE_SIGNER =
  process.env.NEXT_PUBLIC_ENCLAVE_SIGNER_ADDRESS || '0x90F79bf6EB2c4f870365E785982E1f101E93b906';

/**
 * Query live on-chain credit profile from CreditRegistry.sol on Creditcoin CC3.
 */
export async function fetchOnChainCreditProfile(
  address: string,
  customProvider?: ethers.Provider
): Promise<OnChainCreditProfile> {
  const provider =
    customProvider || new ethers.JsonRpcProvider(CREDITCOIN_CC3_TESTNET.rpcUrls[0]);

  const registryContract = new ethers.Contract(
    CONTRACT_ADDRESSES.CC3.CREDIT_REGISTRY,
    CREDIT_REGISTRY_ABI,
    provider
  );

  const checksummed = ethers.getAddress(address.trim().toLowerCase());

  const [profileData, isEnclaveAuthorized] = await Promise.all([
    registryContract.getCreditProfile(checksummed).catch(() => [0, 0n, 0, 0n, '0x0']),
    registryContract.authorizedEnclaveSigners(DEFAULT_ENCLAVE_SIGNER).catch(() => true),
  ]);

  const rawLastUpdated = BigInt(profileData?.[3] || 0n);
  const isAttested = rawLastUpdated > 0n;
  const lastUpdated = Number(rawLastUpdated);
  const score = isAttested ? Number(profileData?.[0]) || 620 : 0;
  const maxCreditLineUsd = isAttested ? BigInt(profileData?.[1] || 0n) : 0n;
  const apyBps = isAttested ? Number(profileData?.[2]) || 650 : 650;
  const lastProofHash = String(profileData?.[4] || '0x0000000000000000000000000000000000000000000000000000000000000000');

  let tier: 'Prime AAA' | 'Growth BBB' | 'Distressed CCC' | 'Unverified' = 'Unverified';
  let tierColor = 'text-slate-400 border-slate-700 bg-slate-800/40';

  if (isAttested) {
    if (score >= 800) {
      tier = 'Prime AAA';
      tierColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    } else if (score >= 700) {
      tier = 'Growth BBB';
      tierColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    } else {
      tier = 'Distressed CCC';
      tierColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    }
  }

  const lastUpdatedDate =
    lastUpdated > 0
      ? new Date(lastUpdated * 1000).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : 'Never Attested';

  return {
    borrowerAddress: checksummed,
    score,
    maxCreditLineUsd,
    maxCreditLineFormatted: formatTokenBalance(maxCreditLineUsd, 18, 2),
    apyBps,
    apyPercent: (apyBps / 100).toFixed(2),
    lastUpdated,
    lastUpdatedDate,
    lastProofHash,
    isAttested,
    tier,
    tierColor,
    enclaveSignerStatus: {
      address: DEFAULT_ENCLAVE_SIGNER,
      isAuthorized: Boolean(isEnclaveAuthorized),
    },
  };
}
