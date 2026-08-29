'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Zap,
  Cpu,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { TelemetryTable } from '../components/telemetry-table';

export default function OperationsPage() {
  const statChips = [
    {
      label: 'Verified Operations',
      value: '18 of 18',
      desc: 'Creditcoin CC3 Verified',
      icon: ShieldCheck,
      color: 'emerald',
    },
    {
      label: 'Total Proven Volume',
      value: '$8,450,000',
      desc: 'USDC, stETH, WBTC',
      icon: Zap,
      color: 'cyan',
    },
    {
      label: 'Avg Prover Latency',
      value: '12.4s',
      desc: 'BlockProver 0xFD2',
      icon: Clock,
      color: 'purple',
    },
    {
      label: 'Precompile Status',
      value: '0x1 (Success)',
      desc: 'Zero Oracle Latency',
      icon: Cpu,
      color: 'amber',
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Layers className="h-3 w-3" />
                Live Operations Stream
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Audited Dataset
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Cross-Chain Operations Telemetry Feed
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Every loan repayment, collateral addition, and debt settlement is proven synchronously in Creditcoin CC3 precompile bytecode without oracle relayers.
            </p>
          </div>

          {/* Quick Network Status Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-xs font-mono space-y-1 shrink-0">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Creditcoin CC3 Testnet</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Precompile: <span className="text-cyan-400">0x00...FD2</span> (Native Prover)
            </div>
          </div>
        </div>

        {/* 4 Stat Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          {statChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <div
                key={chip.label}
                className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 flex items-center gap-3.5"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    chip.color === 'cyan'
                      ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30'
                      : chip.color === 'emerald'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : chip.color === 'purple'
                      ? 'bg-purple-950/80 text-purple-400 border border-purple-500/30'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">
                    {chip.label}
                  </span>
                  <span className="text-base font-bold font-mono text-slate-100 block">
                    {chip.value}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {chip.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Filterable Table Component */}
      <TelemetryTable
        title="Live Operations Telemetry Stream"
        subtitle="18 Historical Cross-Chain Credit Events Synchronously Verified on Creditcoin CC3"
      />
    </div>
  );
}
