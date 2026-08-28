'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Cpu, ShieldCheck, Layers, ExternalLink, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { OperationType } from '@/lib/types';

export interface VisualPipelineProps {
  phase: number; // 0 = Idle, 1 = Detected, 2 = Attesting, 3 = Proof Generated, 4 = Precompile Verified
  sourceTxHash?: string;
  creditcoinTxHash?: string;
  blockHeight?: number;
  provenAmountUsd?: number;
  assetSymbol?: string;
  action?: OperationType;
  merkleRoot?: string;
  latencySec?: number;
  isSimulating?: boolean;
}

export function VisualPipelineCanvas({
  phase = 0,
  sourceTxHash = '0x8b3f71c08e102938472918293847192837461928374619283746192837461928',
  creditcoinTxHash = '0x7f4a8c91d03be182938471928374619283746192837461928374619283746192',
  blockHeight = 6192840,
  provenAmountUsd = 250000,
  assetSymbol = 'USDC',
  action = 'LOAN_REPAID',
  merkleRoot = '0x4a9d71c890182938471928374619283746192837461928374619283746192837',
  latencySec = 12.4,
  isSimulating = false,
}: VisualPipelineProps) {
  const phases = [
    {
      id: 1,
      title: '1. Source Tx Mined (Sepolia L1)',
      subtitle: 'Event Emitted & Block Finalized',
      timing: '0.0s – 0.5s',
      icon: ExternalLink,
      details: `${action} • $${provenAmountUsd.toLocaleString('en-US')} ${assetSymbol} (Block #${blockHeight})`,
      hash: sourceTxHash,
      explorerUrl: `https://sepolia.etherscan.io/tx/${sourceTxHash}`,
    },
    {
      id: 2,
      title: '2. Cross-Chain Attestation',
      subtitle: 'Attestcoin Protocol Ingestion',
      timing: '0.5s – 8.0s',
      icon: Layers,
      details: `Header tracking & continuity endpoint sync`,
      hash: 'Digest: 0x91c0e81920394819203948192039481920394819...',
    },
    {
      id: 3,
      title: '3. Merkle & Continuity Proof',
      subtitle: 'Cryptographic Inclusion Proof Built',
      timing: '8.0s – 10.0s',
      icon: Cpu,
      details: `Merkle Root: ${merkleRoot.slice(0, 14)}...${merkleRoot.slice(-8)} (2 Siblings)`,
      hash: merkleRoot,
    },
    {
      id: 4,
      title: '4. Precompile 0xFD2 Verified',
      subtitle: 'Synchronous Substrate EVM Call',
      timing: `10.0s – ${latencySec}s`,
      icon: ShieldCheck,
      details: `INativeQueryVerifier.verifySingle(receipt.status == 0x1)`,
      hash: creditcoinTxHash,
      explorerUrl: `https://creditcoin3-testnet.subscan.io/tx/${creditcoinTxHash}`,
    },
  ];

  return (
    <div
      data-testid="visual-pipeline-canvas"
      className="relative w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <Zap className="h-5 w-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Synchronous Cross-Chain Attestation Pipeline
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Precompile 0xFD2
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live Substrate bytecode verification of Ethereum L1 facts in &lt; 15s without centralized oracles
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {phase === 4 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span data-testid="precompile-verified-badge">
                ✅ Verified by Native Precompile 0xFD2 ({latencySec}s)
              </span>
            </motion.div>
          ) : isSimulating || phase > 0 ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>VERIFYING PHASE {phase}/4...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>PIPELINE READY</span>
            </div>
          )}
        </div>
      </div>

      {/* 4-Phase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {phases.map((p, idx) => {
          const isComplete = phase >= p.id;
          const isActive = phase === p.id && isSimulating;
          const isPending = phase < p.id;
          const Icon = p.icon;

          return (
            <motion.div
              key={p.id}
              initial={false}
              animate={{
                borderColor: isComplete
                  ? p.id === 4
                    ? 'rgba(16, 185, 129, 0.4)'
                    : 'rgba(6, 182, 212, 0.4)'
                  : isActive
                  ? 'rgba(6, 182, 212, 0.6)'
                  : 'rgba(30, 41, 59, 0.6)',
                backgroundColor: isComplete
                  ? p.id === 4
                    ? 'rgba(6, 78, 59, 0.15)'
                    : 'rgba(8, 51, 68, 0.15)'
                  : isActive
                  ? 'rgba(15, 23, 42, 0.9)'
                  : 'rgba(15, 23, 42, 0.4)',
              }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col justify-between rounded-xl border p-4 backdrop-blur-sm"
            >
              {/* Connector line between cards */}
              {idx < 3 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight
                    className={`h-4 w-4 transition-colors ${
                      phase > p.id ? 'text-cyan-400' : 'text-slate-700'
                    }`}
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                      isComplete
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isActive
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {p.timing}
                  </span>

                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      isComplete
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isActive
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse'
                        : 'bg-slate-800/60 text-slate-600 border border-slate-800'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                <h4
                  className={`text-xs font-semibold tracking-wide ${
                    isComplete ? 'text-slate-100' : isActive ? 'text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  {p.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{p.subtitle}</p>
                <p className="text-[11px] text-slate-300 mt-2 font-mono break-all line-clamp-2 bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                  {p.details}
                </p>
              </div>

              {/* Card Footer / Status / Link */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span
                  className={`font-mono uppercase ${
                    isComplete
                      ? 'text-emerald-400 font-semibold'
                      : isActive
                      ? 'text-cyan-400 font-semibold animate-pulse'
                      : 'text-slate-600'
                  }`}
                >
                  {isComplete ? '● Complete' : isActive ? '● In Progress' : '○ Standby'}
                </span>

                {p.explorerUrl && (
                  <a
                    href={p.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
