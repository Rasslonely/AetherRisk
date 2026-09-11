'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useWeb3 } from '../components/web3-provider';
import {
  OnChainCreditProfile,
  fetchOnChainCreditProfile,
  KNOWN_PERSONA_ADDRESSES,
} from '@/lib/contracts/credit-registry';
import { CreditPassportCard } from '../components/credit-passport-card';
import {
  ShieldCheck,
  Cpu,
  Landmark,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CREDITCOIN_CC3_TESTNET, CONTRACT_ADDRESSES } from '@/lib/web3-config';

const DEFAULT_INITIAL_PROFILE: OnChainCreditProfile = {
  borrowerAddress: KNOWN_PERSONA_ADDRESSES[0].address,
  score: 620,
  maxCreditLineUsd: 1200000n * 10n ** 18n,
  maxCreditLineFormatted: '1,200,000.00',
  apyBps: 920,
  apyPercent: '9.20',
  lastUpdated: 1787853285,
  lastUpdatedDate: 'Aug 29, 2026, 04:34:45 PM',
  lastProofHash: '0x3aF8120bA8812cE789A1201882190018910b910B-proof-cc3',
  isAttested: true,
  tier: 'Distressed CCC',
  tierColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  enclaveSignerStatus: {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    isAuthorized: true,
  },
};

export default function PassportPage() {
  const { account, chainId } = useWeb3();
  const [currentProfile, setCurrentProfile] = useState<OnChainCreditProfile>(DEFAULT_INITIAL_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadProfile = useCallback(async (targetAddress: string) => {
    setIsLoading(true);
    try {
      const data = await fetchOnChainCreditProfile(targetAddress);
      setCurrentProfile(data);
    } catch (err) {
      console.warn('Failed to load on-chain credit profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If account is connected, inspect user's wallet; otherwise inspect Apex Commodities persona
    const initialTarget = account || KNOWN_PERSONA_ADDRESSES[0].address;
    loadProfile(initialTarget);
  }, [account, chainId, loadProfile]);

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Institutional Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-br from-slate-900/95 via-slate-950/90 to-slate-950/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Creditcoin CC3 Testnet (102031)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Landmark className="h-3 w-3" />
              CreditRegistry.sol
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu className="h-3 w-3" />
              Phala AMD SEV-SNP Hardware TEE
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
              Institutional <span className="text-cyan-400">On-Chain Credit Passport</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed font-sans">
              Inspect borrower credit profiles, enclave signatures, and borrowing limits registered in <code className="text-cyan-300 font-mono">CreditRegistry.sol</code> on Creditcoin CC3. Credit ratings are cryptographically attested via AMD SEV-SNP confidential computing.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>EIP-712 Attestation Active</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">Signer: 0x90F7...b906</span>
        </div>
      </div>

      {/* Main Credit Passport Card with Address Search */}
      <CreditPassportCard
        profile={currentProfile}
        isLoading={isLoading}
        onSearch={loadProfile}
        connectedAccount={account}
      />

      {/* Active On-Chain Smart Contracts Footnote */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>ACTIVE REGISTRY CONTRACTS ON CC3</span>
          <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-mono">
            <ShieldCheck className="h-3 w-3" /> Hardware Verified
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-200 block">CreditRegistry.sol</span>
              <span className="text-[10px] text-slate-500">TEE Score Trust Boundary (0x5923...1015)</span>
            </div>
            <a
              href={`${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/address/${CONTRACT_ADDRESSES.CC3.CREDIT_REGISTRY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 p-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-200 block">AetherVault4626.sol</span>
              <span className="text-[10px] text-slate-500">ERC-4626 Lending Desk (0xD9B3...eFd39)</span>
            </div>
            <a
              href={`${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/address/${CONTRACT_ADDRESSES.CC3.AETHER_VAULT_4626}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 p-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
