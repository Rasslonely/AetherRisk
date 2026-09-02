'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../components/web3-provider';
import {
  VaultOverview,
  UserVaultPosition,
  fetchVaultOverview,
} from '@/lib/contracts/aether-vault';
import { VaultMetricsGrid } from '../components/vault-metrics-grid';
import { VaultOperationsCard } from '../components/vault-operations-card';
import { RateCurveVisualizer } from '../components/rate-curve-visualizer';
import {
  Landmark,
  Coins,
  ShieldCheck,
  ExternalLink,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { CREDITCOIN_CC3_TESTNET, CONTRACT_ADDRESSES } from '@/lib/web3-config';

export default function VaultPage() {
  const { account, chainId, refreshBalances } = useWeb3();
  const [vaultData, setVaultData] = useState<VaultOverview>({
    totalAssets: 50000n * 10n ** 18n,
    totalAssetsFormatted: '50,000.00',
    totalSupply: 50000n * 10n ** 18n,
    totalSupplyFormatted: '50,000.00',
    totalBorrowed: 0n,
    totalBorrowedFormatted: '0.00',
    availableLiquidity: 50000n * 10n ** 18n,
    availableLiquidityFormatted: '50,000.00',
    sharePrice: '1.0000',
    utilizationRate: 0,
  });
  const [userData, setUserData] = useState<UserVaultPosition | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadVaultData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { vault, user } = await fetchVaultOverview(account);
      setVaultData(vault);
      setUserData(user);
    } catch (err) {
      console.warn('Failed to load on-chain vault metrics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  useEffect(() => {
    loadVaultData();
    const interval = setInterval(loadVaultData, 10000);
    return () => clearInterval(interval);
  }, [loadVaultData, chainId]);

  const handleOperationSuccess = async () => {
    await loadVaultData();
    await refreshBalances();
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Asymmetrical Bento Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Bento: Title & Institutional Architecture (7 Cols) */}
        <div className="lg:col-span-7 relative rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-br from-slate-900/95 via-slate-950/90 to-slate-950/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Protocol Eyebrow Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Creditcoin CC3 Testnet
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Landmark className="h-3 w-3" />
                ERC-4626 Vault
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Cpu className="h-3 w-3" />
                Precompile 0xFD2 Underwritten
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                Institutional <span className="text-cyan-400">ERC-4626</span> Lending Desk
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Algorithmic uncollateralized lending and dynamic risk-adjusted yield venue. Borrowing costs scale synchronously with borrower credit health verified in hardware TEE enclaves on Creditcoin CC3.
              </p>
            </div>
          </div>

          {/* Trust Highlights Footer */}
          <div className="relative z-10 pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Seed Capital: $50,000.00 iUSDC Live</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">Block Time: ~15s Finality</span>
          </div>
        </div>

        {/* Right Bento: Integrated Quick-Action Faucet Capsule (5 Cols) */}
        <div className="lg:col-span-5 relative rounded-3xl p-6 sm:p-7 border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 via-slate-950/80 to-slate-900/90 shadow-[0_20px_50px_rgba(6,182,212,0.1)] backdrop-blur-xl flex flex-col justify-between overflow-hidden group hover:border-cyan-500/35 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="h-4 w-4" />
                <span>Testnet Capital Minter</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                1-Click Nonce Relayer
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              Need Capital to Test Vault Operations?
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Instantly claim 10,000 iUSDC testnet capital and native tCTC gas to test deposits, uncollateralized credit line drawdowns, and debt settlements.
            </p>
          </div>

          <div className="pt-4 mt-3">
            <button
              onClick={() => window.dispatchEvent(new Event('open-faucet'))}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-xs bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 fill-slate-950" />
              <span>Claim 10,000 iUSDC in 1-Click</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Metrics Grid */}
      <VaultMetricsGrid
        vault={vaultData}
        user={userData}
        isLoading={isLoading}
        onRefresh={loadVaultData}
      />

      {/* 2-Column Main Trading Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Operations Card (7 Cols) */}
        <div className="lg:col-span-7">
          <VaultOperationsCard
            vault={vaultData}
            user={userData}
            onOperationSuccess={handleOperationSuccess}
          />
        </div>

        {/* Right Column: Dynamic Rate Curve & Contract Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <RateCurveVisualizer
            currentScore={userData?.creditScore || 620}
            currentApy={userData?.borrowApyPercent || '6.50'}
          />

          {/* On-Chain Verified Deployment Registry */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>ACTIVE SMART CONTRACTS (CC3)</span>
              <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
            </h4>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block">AetherVault4626.sol</span>
                  <span className="text-[10px] text-slate-500">ERC-4626 Yield & Lending Desk</span>
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

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block">CreditRegistry.sol</span>
                  <span className="text-[10px] text-slate-500">TEE Hardware Score Trust Boundary</span>
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

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block">MockInstitutionalUSDC.sol</span>
                  <span className="text-[10px] text-slate-500">Underlying Institutional ERC-20 Asset</span>
                </div>
                <a
                  href={`${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/address/${CONTRACT_ADDRESSES.CC3.MOCK_IUSDC}`}
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
      </div>
    </div>
  );
}
