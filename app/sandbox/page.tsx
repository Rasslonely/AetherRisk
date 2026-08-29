'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Shield,
  Zap,
  Cpu,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { InteractiveSandbox } from '../components/interactive-sandbox';
import { RiskMetricRadar } from '../components/risk-metric-radar';

export default function SandboxPage() {
  const guideSteps = [
    {
      step: '01',
      title: 'Select Borrower Persona',
      desc: 'Pick between Apex Commodities (Distress), SolarGrid Energy (Mid-Tier), or AlphaQuant (High Volume).',
    },
    {
      step: '02',
      title: 'Simulate Cross-Chain Repayment',
      desc: 'Click "Simulate Cross-Chain Repayment" to trigger the 4-phase Substrate precompile verification pipeline.',
    },
    {
      step: '03',
      title: 'Inspect TEE Attestation & Vault',
      desc: 'Examine the AMD SEV-SNP hardware quote, EIP-712 signature, and dynamic ERC-4626 APY discount.',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl border border-slate-800 bg-slate-950/80 p-6 md:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden"
      >
        {/* Double Bezel Inset Highlight */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Terminal className="h-3 w-3" />
                Autonomous Risk Simulator
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Substrate Precompile 0xFD2
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Institutional Zero-Wallet Risk Sandbox
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Simulate cross-chain borrower repayments and test synchronous credit re-underwriting on Creditcoin CC3 in under 15 seconds without connecting an external wallet.
            </p>
          </div>

          {/* Quick Enclave Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-xs font-mono space-y-1 shrink-0">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Phala AMD SEV-SNP Enclave</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Signer: <span className="text-emerald-400">0x90F7...b906</span> (EIP-712)
            </div>
          </div>
        </div>

        {/* 3-Step Guided Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          {guideSteps.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 relative"
            >
              <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">
                Step {item.step}
              </span>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Interactive Sandbox Component */}
      <InteractiveSandbox />

      {/* Deep-Dive Architectural Explainer Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6">
          <RiskMetricRadar isResolved={true} borrowerName="Apex Commodities Corp" />
        </div>

        <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 md:p-8 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Why Synchronous Precompile Verification Matters
              </h3>
              <p className="text-xs text-slate-400">
                Traditional vs Attestcoin Proof Architecture
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Traditional cross-chain credit protocols rely on asynchronous multisig oracles that take 15–30 minutes to propagate L1 loan settlements. During volatile market conditions, this lag causes catastrophic <strong className="text-red-400">false liquidations</strong> of solvent institutions.
          </p>

          <p className="text-xs text-slate-300 leading-relaxed">
            AetherRisk uses Creditcoin CC3&apos;s native <code className="text-cyan-400 font-mono">0xFD2 BlockProver</code> precompile to query source-chain state root inclusion proofs synchronously inside EVM transaction execution, updating the on-chain <code className="text-emerald-400 font-mono">CreditRegistry.sol</code> within 12.4 seconds.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 font-mono text-xs text-slate-300 space-y-1">
            <div className="text-slate-500 text-[11px]">// Creditcoin CC3 Native Call:</div>
            <div className="text-cyan-300">
              INativeQueryVerifier(0x00...FD2).verifyBlockProof(targetBlock, receiptProof)
            </div>
            <div className="text-emerald-400 text-[11px] pt-1">
              ↳ Result: 0x01 (SUCCESS) • Gas: 23,400 units
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
