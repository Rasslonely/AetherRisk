'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  Code2,
  Terminal,
  Landmark,
  Coins,
} from 'lucide-react';
import { RiskMetricRadar } from './components/risk-metric-radar';
import { TelemetryTable } from './components/telemetry-table';

export default function HomePage() {
  const kpiStats = [
    {
      label: 'Total Volume Proven',
      value: '$8,450,000',
      change: '18 Verified Events',
      icon: Zap,
      accent: 'cyan',
    },
    {
      label: 'Verification Latency',
      value: '12.4s',
      change: 'Native Precompile 0xFD2',
      icon: Cpu,
      accent: 'emerald',
    },
    {
      label: 'Borrower Profiles',
      value: '3 Entities',
      change: 'Trade & Infrastructure',
      icon: Building2,
      accent: 'purple',
    },
    {
      label: 'Max Score Gain',
      value: '+190 pts',
      change: '620 → 810 Score Upgrade',
      icon: TrendingUp,
      accent: 'amber',
    },
  ];

  return (
    <div className="space-y-16 py-6">
      {/* 1. HERO PITCH SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4 pb-8">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Creditcoin CC3 Testnet · Substrate Precompile 0xFD2</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15]"
        >
          Cross-Chain{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Credit Underwriting
          </span>{' '}
          for Institutional Lending
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Real-time borrower solvency verification on Creditcoin CC3 to eliminate overcollateralization penalties and prevent false liquidations.
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/sandbox"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-slate-950 shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:scale-105 active:scale-95 transition-all"
          >
            <Terminal className="h-4 w-4 fill-slate-950 text-slate-950" />
            <span>Launch Sandbox</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>

          <Link
            href="/vault"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/60 backdrop-blur-md transition-all hover:scale-105"
          >
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>Open Lending Pool</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </motion.div>
      </section>

      {/* 2. INSTITUTIONAL KPI STATS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className="relative rounded-2xl border border-slate-800 bg-slate-950/70 p-5 backdrop-blur-xl shadow-lg hover:border-slate-700 transition-colors group"
            >
              <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.accent === 'cyan'
                      ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30'
                      : stat.accent === 'emerald'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                        : stat.accent === 'purple'
                          ? 'bg-purple-950/80 text-purple-400 border border-purple-500/30'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* 3. TWO INSTITUTIONAL GATEWAY PORTALS (SOLVES PAGE DUPLICATION) */}
      <section className="space-y-4">
        <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Ecosystem Navigation
            </span>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight mt-1">
              Select Your Execution Mode
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gateway 1: Fast-Track Sandbox */}
          <div className="relative rounded-3xl border border-purple-500/30 bg-slate-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between group hover:border-purple-500/60 transition-all">
            <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Terminal className="h-3 w-3" />
                  30s Demo Simulator
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  Zero Wallet Setup
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  Interactive Credit Simulator
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Test cross-chain credit re-evaluation in 30 seconds. Simulate debt settlements on Ethereum Sepolia, verify proofs with Precompile 0xFD2, and view generated credit memos without connecting a wallet.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono block">Latency</span>
                  <span className="text-xs font-semibold text-purple-300 font-mono">12.4s Verification</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono block">AI Copilot</span>
                  <span className="text-xs font-semibold text-cyan-300 font-mono">Gemini 3.5 Flash Lite</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono block">Score Upgrade</span>
                  <span className="text-xs font-semibold text-emerald-300 font-mono">620 → 810 Prime</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono block">Prerequisite</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">No Gas Needed</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/sandbox"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Credit Simulator</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Gateway 2: Live Web3 dApp */}
          <div className="relative rounded-3xl border border-emerald-500/30 bg-slate-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between group hover:border-emerald-500/60 transition-all">
            <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="h-3 w-3" />
                  Live Smart Contracts
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  CC3 Testnet (102031)
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                  Live Lending Pool & Credit Passport
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Interact with verified smart contracts on Creditcoin CC3. Claim testnet iUSDC from the faucet, inspect on-chain borrower ratings in CreditRegistry.sol, and deposit or borrow capital in real time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono block">Seed Liquidity</span>
                  <span className="text-xs font-semibold text-emerald-300 font-mono">$50,000.00 iUSDC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono block">Hardware Security</span>
                  <span className="text-xs font-semibold text-cyan-300 font-mono">AMD SEV-SNP Quote</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono block">Vault Standard</span>
                  <span className="text-xs font-semibold text-emerald-300 font-mono">ERC-4626 avUSD</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono block">Test Tokens</span>
                  <span className="text-xs font-semibold text-cyan-300 font-mono">1-Click 10k iUSDC</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/vault"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Enter Lending Pool</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURAL OVERVIEW */}
      <section className="relative rounded-3xl border border-slate-800 bg-slate-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

        <div className="border-b border-slate-800/80 pb-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3" />
              Verified Architecture
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mt-2 tracking-tight">
            Protocol Architecture
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Native Substrate precompiles verify cross-chain settlement; confidential TEE enclaves compute private risk assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engine 1 Card */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/50 p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Layer 1 • On-Chain Settlement
                </span>
                <h3 className="text-base font-semibold text-slate-100">
                  Creditcoin CC3 Precompile Core
                </h3>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-100 font-mono">0xFD2 BlockProver</strong>: Synchronously verifies Merkle inclusion proofs in Substrate bytecode without external relayer delay.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-100 font-mono">0xFD3 ChainInfo</strong>: Validates block finality and header progression on Ethereum Sepolia.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-100 font-mono">EvmV1Decoder</strong>: Verifies execution status (<code className="text-cyan-300">0x1</code>) with strict replay protection.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-100 font-mono">CreditRegistry.sol</strong>: On-chain credit scoring signed by authorized TEE enclave signers.
                </span>
              </li>
            </ul>
          </div>

          {/* Engine 2 Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/50 p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Layer 2 • Risk Assessment
                </span>
                <h3 className="text-base font-semibold text-slate-100">
                  Confidential TEE Enclave (AMD SEV-SNP)
                </h3>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-100">High-Availability Architecture</strong>: Multi-tier fallback (Live RPC → Database Cache → Deterministic Proof) ensuring 100% demo uptime.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-100">Hardware Attestation</strong>: Cryptographic EIP-712 signatures generated inside confidential AMD SEV-SNP enclaves.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-100">Risk-Adjusted Pricing</strong>: Calibrates borrowing APY (4.1% to 9.2%) according to borrower credit rating.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-100">AetherVault4626</strong>: Tokenized ERC-4626 lending pool providing liquidity with algorithmic rate curves.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. RISK RADAR & RECENT TELEMETRY PREVIEW */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6">
          <RiskMetricRadar isResolved={true} borrowerName="Apex Commodities Corp" />
        </div>

        <div className="lg:col-span-6 space-y-4">
          <TelemetryTable
            initialLimit={5}
            showFilters={false}
            title="Recent Verified Telemetry"
            subtitle="Latest 5 cross-chain operations verified synchronously on Creditcoin CC3"
          />

          <div className="text-center pt-2">
            <Link
              href="/operations"
              className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors p-2 rounded-lg hover:bg-slate-900 border border-slate-800/60"
            >
              <span>View Full 18 Operations Telemetry Feed</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CONTRACTS DRAWER TRIGGER BANNER */}
      <section className="relative rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Smart Contracts Deployed & Verified On-Chain
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                5 Contracts
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Live on Creditcoin CC3 Testnet (102031) and Ethereum Sepolia (11155111).
            </p>
          </div>
        </div>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-verified-contracts'))}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all hover:scale-105 shrink-0"
        >
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>View Verified Contracts</span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </section>
    </div>
  );
}
