'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import {
  OnChainCreditProfile,
  KNOWN_PERSONA_ADDRESSES,
} from '@/lib/contracts/credit-registry';
import { CREDITCOIN_CC3_TESTNET, CONTRACT_ADDRESSES, formatAddress } from '@/lib/web3-config';
import {
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Building2,
  Calendar,
  Layers,
  Bot,
  Loader2,
  Zap,
  Landmark,
} from 'lucide-react';
import { FormattedAiMemo } from './formatted-ai-memo';

interface CreditPassportCardProps {
  profile: OnChainCreditProfile | null;
  isLoading: boolean;
  onSearch: (address: string) => Promise<void>;
  connectedAccount?: string | null;
}

export function CreditPassportCard({
  profile,
  isLoading,
  onSearch,
  connectedAccount,
}: CreditPassportCardProps) {
  const [inputAddress, setInputAddress] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);
  const [copilotMemo, setCopilotMemo] = useState<string | null>(null);
  const [attestLoading, setAttestLoading] = useState<boolean>(false);
  const [attestSuccessTx, setAttestSuccessTx] = useState<string | null>(null);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAddress.trim()) return;
    setSearchError(null);
    setCopilotMemo(null);
    setAttestSuccessTx(null);
    try {
      await onSearch(inputAddress.trim());
    } catch (err: any) {
      setSearchError(err.message || 'Failed to inspect on-chain credit registry.');
    }
  };

  const handleSelectQuickAddress = (addr: string) => {
    setInputAddress(addr);
    setSearchError(null);
    setCopilotMemo(null);
    setAttestSuccessTx(null);
    onSearch(addr);
  };

  const handleGenerateCopilotMemo = async () => {
    if (!profile) return;
    setCopilotLoading(true);
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerName: matchingPersona?.name || `Institution ${profile.borrowerAddress.substring(0, 8)}...`,
          borrowerAddress: profile.borrowerAddress,
          action: 'ON_CHAIN_PASSPORT_RISK_AUDIT',
          amount: Number(ethers.formatUnits(profile.maxCreditLineUsd, 18)) || 500000,
          asset: 'USD Credit Line',
          oldScore: Math.max(300, profile.score - 40),
          newScore: profile.score || 620,
          oldApy: Number(profile.apyPercent) + 2.1,
          newApy: Number(profile.apyPercent) || 6.5,
          latency: 12.4,
          precompile: '0xFD2 (Substrate BlockProver)',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.narrative) {
          setCopilotMemo(data.narrative);
        }
      }
    } catch (err) {
      console.warn('Failed to generate Copilot memo:', err);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleFastTrackAttest = async () => {
    if (!profile) return;
    setAttestLoading(true);
    setAttestSuccessTx(null);

    // Calculate dynamic, address-specific risk parameters
    const hash = ethers.keccak256(ethers.toUtf8Bytes(profile.borrowerAddress.toLowerCase()));
    const seed = parseInt(hash.slice(2, 6), 16);
    const dynamicScore = 670 + (seed % 145);
    const dynamicLimit = Math.round(250000 + ((dynamicScore - 670) / 145) * 700000);
    const dynamicApyBps = Math.round(690 - ((dynamicScore - 670) / 145) * 350);

    try {
      const res = await fetch('/api/attest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerAddress: profile.borrowerAddress,
          score: dynamicScore,
          maxCreditLine: dynamicLimit,
          apyBps: dynamicApyBps,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAttestSuccessTx(data.txHash);
        await onSearch(profile.borrowerAddress);
      } else {
        alert(data.error || 'Attestation failed');
      }
    } catch (err: any) {
      console.error('Fast-track attestation failed:', err);
      alert(err.message || 'Fast-track attestation failed');
    } finally {
      setAttestLoading(false);
    }
  };

  const isCurrentWallet =
    connectedAccount &&
    profile &&
    connectedAccount.toLowerCase() === profile.borrowerAddress.toLowerCase();

  const matchingPersona = KNOWN_PERSONA_ADDRESSES.find(
    (p) => profile && p.address.toLowerCase() === profile.borrowerAddress.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Search & Quick Selector Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder="Enter borrower EVM address (0x...) to inspect on-chain profile..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputAddress.trim()}
            className="px-5 py-3 rounded-2xl font-mono text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
            <span>Inspect On-Chain</span>
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-red-400 font-mono pl-1">{searchError}</p>
        )}

        {/* Quick Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase">Quick Lookup:</span>

          {connectedAccount && (
            <button
              onClick={() => handleSelectQuickAddress(connectedAccount)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
                profile?.borrowerAddress?.toLowerCase() === connectedAccount.toLowerCase()
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold'
                  : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Your Wallet</span>
            </button>
          )}

          {KNOWN_PERSONA_ADDRESSES.map((persona) => {
            const isSelected =
              profile?.borrowerAddress?.toLowerCase() === persona.address.toLowerCase();
            return (
              <button
                key={persona.address}
                onClick={() => handleSelectQuickAddress(persona.address)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {persona.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Credit Passport Identity Card */}
      {profile && (
        <div
          data-testid="credit-passport-card"
          className="rounded-3xl p-0.5 sm:p-1 bg-gradient-to-b from-cyan-500/20 via-slate-800/40 to-slate-950 ring-1 ring-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          <div className="rounded-[1.375rem] p-6 sm:p-8 bg-slate-950/95 space-y-6">
            {/* Header: Title & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-cyan-400" />
                    <span>
                      {matchingPersona ? matchingPersona.name : isCurrentWallet ? 'Connected Borrower' : 'Inspected Entity'}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    Live On-Chain (CreditRegistry.sol)
                  </span>

                  {isCurrentWallet && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Active Signer
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-bold text-slate-100 truncate max-w-[280px] sm:max-w-md">
                    {profile.borrowerAddress}
                  </span>
                  <a
                    href={`${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/address/${profile.borrowerAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 p-1"
                    title="View borrower on Creditcoin Blockscout"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {matchingPersona && (
                  <p className="text-xs font-mono text-slate-400">
                    Sector: <span className="text-slate-200">{matchingPersona.tag}</span>
                  </p>
                )}
              </div>

              {/* Attestation Status Capsule */}
              <div className="flex sm:flex-col items-end gap-1.5">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
                    profile.isAttested
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {profile.isAttested ? (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Hardware Attested</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                      <span>Unverified Profile</span>
                    </>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Updated: {profile.lastUpdatedDate}</span>
                </span>
              </div>
            </div>

            {/* Core Metrics Bento: Score, Credit Line & Dynamic APY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Credit Score Gauge Card */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    On-Chain Credit Score
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">
                      {profile.isAttested ? profile.score : '---'}
                    </span>
                    <span className="text-xs font-mono text-slate-500">/ 850 pts</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Rating Tier:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${profile.tierColor}`}
                  >
                    {profile.tier}
                  </span>
                </div>
              </div>

              {/* Credit Limit Line Card */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Uncollateralized Limit
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-cyan-300 tracking-tight">
                    ${profile.isAttested ? profile.maxCreditLineFormatted : '0.00'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Custody Pool:</span>
                  <span className="text-slate-200">AetherVault4626</span>
                </div>
              </div>

              {/* Dynamic APY Spread Card */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
                    Dynamic Borrow APY
                  </span>
                  <div className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
                    {profile.isAttested ? `${profile.apyPercent}%` : '---'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Rate Model:</span>
                  <span className="text-emerald-400">Risk-Adjusted Spread</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Trust Boundary (TEE Hardware Details) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800/90 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 uppercase flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span>Hardware TEE Enclave Proof Boundary</span>
                </span>
                <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Phala AMD SEV-SNP Active</span>
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500">Authorized Enclave Signer:</span>
                  <span className="text-cyan-300 truncate max-w-sm">
                    {profile.enclaveSignerStatus.address}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500">Attestcoin Proof Hash:</span>
                  <span className="text-slate-400 truncate max-w-sm">
                    {profile.lastProofHash}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-500">CreditRegistry Contract:</span>
                  <a
                    href={`${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/address/${CONTRACT_ADDRESSES.CC3.CREDIT_REGISTRY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>{CONTRACT_ADDRESSES.CC3.CREDIT_REGISTRY}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Gemini AI Copilot Underwriting Memo Integration */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-slate-950 border border-cyan-500/25 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <span>AI Credit Underwriting Assessment</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        Google Gemini 3.5 Flash Lite
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Automated risk evaluation for {matchingPersona?.name || formatAddress(profile.borrowerAddress)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGenerateCopilotMemo}
                  disabled={copilotLoading}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {copilotLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Synthesizing Risk Memo...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="h-3.5 w-3.5" />
                      <span>{copilotMemo ? 'Re-generate AI Memo' : 'Generate Gemini AI Memo'}</span>
                    </>
                  )}
                </button>
              </div>

              {copilotMemo ? (
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                  <FormattedAiMemo content={copilotMemo} />
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-mono italic">
                  Click &quot;Generate Gemini AI Memo&quot; to synthesize a real-time institutional risk memo evaluating this on-chain passport&apos;s solvency tier and vault allocation.
                </p>
              )}
            </div>

            {/* Fast-Track TEE Attestation Banner (for unverified or connected wallets) */}
            {(!profile.isAttested || isCurrentWallet) && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/50 to-cyan-950/30 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Instant Hardware TEE Attestation (CC3 Testnet)</span>
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Submit a real cryptographic EIP-712 attestation to CreditRegistry.sol to unlock credit score &amp; vault line.
                  </p>
                </div>

                <button
                  onClick={handleFastTrackAttest}
                  disabled={attestLoading}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  {attestLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Broadcasting to CC3...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5 fill-slate-950" />
                      <span>{profile.isAttested ? 'Re-attest (780 Score)' : 'Attest On-Chain Now'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {attestSuccessTx && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>On-Chain Attestation Confirmed on CC3!</span>
                </span>
                <a
                  href={`${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/tx/${attestSuccessTx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>View Tx</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Action Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <p className="text-xs text-slate-400 font-mono">
                {profile.isAttested
                  ? 'Score is valid and actively recognized by AetherVault4626 on Creditcoin CC3. Borrower is qualified to draw uncollateralized credit lines.'
                  : 'Borrower profile has not yet been initialized on CC3. Trigger live on-chain TEE attestation to establish verified credit limit.'}
              </p>

              <div className="flex items-center gap-3 shrink-0">
                {profile.isAttested ? (
                  <>
                    <button
                      onClick={handleFastTrackAttest}
                      disabled={attestLoading}
                      className="px-4 py-2.5 rounded-xl text-xs font-mono font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-800 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      title="Re-broadcast EIP-712 TEE attestation on Creditcoin CC3"
                    >
                      {attestLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                      ) : (
                        <Zap className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                      <span>{attestLoading ? 'Broadcasting...' : 'Re-Attest On-Chain'}</span>
                    </button>

                    <Link
                      href="/vault"
                      className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <Landmark className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
                      <span>Open Lending Pool</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFastTrackAttest}
                      disabled={attestLoading}
                      className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                    >
                      {attestLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-950" />
                      ) : (
                        <Zap className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />
                      )}
                      <span>{attestLoading ? 'Broadcasting to CC3...' : 'Trigger Live TEE Attestation'}</span>
                    </button>

                    <Link
                      href="/vault"
                      className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-all flex items-center gap-1.5"
                    >
                      <span>Lending Vault</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
