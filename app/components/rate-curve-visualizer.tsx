'use client';

import React, { useState } from 'react';
import { Activity, Cpu, Sliders, RotateCcw, ShieldCheck } from 'lucide-react';

interface RateCurveVisualizerProps {
  currentScore?: number;
  currentApy?: string;
}

export function RateCurveVisualizer({
  currentScore = 620,
  currentApy = '6.50',
}: RateCurveVisualizerProps) {
  // Allow interactive simulation slider
  const [simScore, setSimScore] = useState<number>(currentScore);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const activeScore = isSimulating ? simScore : currentScore;

  // Calculate dynamic APY from active score
  const getTierInfo = (score: number) => {
    if (score >= 800) {
      return {
        tier: 'AAA Prime',
        apy: '4.10%',
        bps: 410,
        color: 'text-emerald-400',
        bgGlow: 'rgba(16,185,129,0.2)',
        desc: 'Tier-1 Institutional · Zero collateral haircut',
      };
    } else if (score >= 700) {
      return {
        tier: 'BBB Growth',
        apy: '6.50%',
        bps: 650,
        color: 'text-cyan-400',
        bgGlow: 'rgba(6,182,212,0.2)',
        desc: 'Standard Corporate · Low volatility underwrite',
      };
    } else {
      return {
        tier: 'CCC Subprime',
        apy: '9.20%',
        bps: 920,
        color: 'text-amber-400',
        bgGlow: 'rgba(245,158,11,0.2)',
        desc: 'Distressed / Unseasoned · Liquidation guard active',
      };
    }
  };

  const currentTier = getTierInfo(activeScore);

  // SVG dynamic indicator position (Score 300 -> x=20, Score 850 -> x=340)
  const svgWidth = 360;
  const svgHeight = 90;
  const scorePercent = Math.max(0, Math.min(1, (activeScore - 300) / (850 - 300)));
  const dotX = 25 + scorePercent * (svgWidth - 50);
  // Curve: Y starts high (9.20% = low y value or inverted)
  // Let's map 9.20% -> y=70 (down), 4.10% -> y=20 (up)
  const apyValue = currentTier.bps / 100;
  const apyPercent = (apyValue - 4.1) / (9.2 - 4.1); // 0 (prime) to 1 (subprime)
  const dotY = 22 + apyPercent * 48; // lower APY = closer to top (better)

  return (
    <div
      data-testid="rate-curve-visualizer"
      className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.5)] space-y-5"
    >
      {/* Header & Simulator Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Dynamic Risk-Adjusted Interest Curve
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                AetherVault4626
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              On-chain algorithmic spread calibrated by CreditRegistry.sol on Creditcoin CC3
            </p>
          </div>
        </div>

        {isSimulating && (
          <button
            onClick={() => {
              setSimScore(currentScore);
              setIsSimulating(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset to Live Score</span>
          </button>
        )}
      </div>

      {/* Interactive Simulator Slider */}
      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span>Interactive Score Simulator:</span>
          </span>
          <span className="text-slate-200 font-bold">
            <span className="text-cyan-400 text-sm">{activeScore}</span> / 850 pts
            {isSimulating && <span className="ml-1.5 text-[10px] text-amber-400 font-normal">(Simulated)</span>}
          </span>
        </div>

        <input
          type="range"
          min="300"
          max="850"
          step="5"
          value={activeScore}
          onChange={(e) => {
            setIsSimulating(true);
            setSimScore(Number(e.target.value));
          }}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>300 (Distressed)</span>
          <span>700 (Growth)</span>
          <span>800 (Prime AAA)</span>
        </div>
      </div>

      {/* SVG Interactive Rate Curve */}
      <div className="relative p-3 rounded-2xl bg-slate-950/80 border border-slate-800/60 overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1 px-1">
          <span>Borrowing Cost Curve</span>
          <span className="text-emerald-400 font-medium">
            Active Spread: {currentTier.apy} APY ({currentTier.tier})
          </span>
        </div>

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="25" y1="20" x2="335" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.75" />
          <line x1="25" y1="46" x2="335" y2="46" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.75" />
          <line x1="25" y1="70" x2="335" y2="70" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.75" />

          {/* Y Axis Labels */}
          <text x="5" y="24" fill="#64748b" fontSize="8" fontFamily="monospace">4.1%</text>
          <text x="5" y="50" fill="#64748b" fontSize="8" fontFamily="monospace">6.5%</text>
          <text x="5" y="74" fill="#64748b" fontSize="8" fontFamily="monospace">9.2%</text>

          {/* Dynamic Bezier Curve: High APY (y=70) at left -> Low APY (y=20) at right */}
          <path
            d="M 25 70 C 120 70, 180 46, 250 46 C 290 46, 310 20, 335 20"
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Active Score Glowing Node */}
          <g transform={`translate(${dotX}, ${dotY})`}>
            <circle r="9" fill="#06b6d4" opacity="0.3" filter="url(#glow)">
              <animate attributeName="r" values="7;11;7" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* 3 Tier Cards with Clean Responsive Formatting (No text collisions) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Tier 1: Prime AAA */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            activeScore >= 800
              ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
              : 'bg-slate-950/60 border-slate-800/80 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between font-mono mb-1.5">
            <span className="font-semibold text-xs text-slate-200">AAA Prime</span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              800+
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            4.10% <span className="text-[10px] text-slate-400 font-normal">APY</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
            Institutional Tier 1 · Zero haircut
          </p>
        </div>

        {/* Tier 2: BBB Growth */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            activeScore >= 700 && activeScore < 800
              ? 'bg-cyan-950/40 border-cyan-500/50 ring-1 ring-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              : 'bg-slate-950/60 border-slate-800/80 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between font-mono mb-1.5">
            <span className="font-semibold text-xs text-slate-200">BBB Growth</span>
            <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-500/10 px-1.5 py-0.5 rounded">
              700–799
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            6.50% <span className="text-[10px] text-slate-400 font-normal">APY</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
            Standard Corporate · Low volatility
          </p>
        </div>

        {/* Tier 3: CCC Subprime */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            activeScore < 700
              ? 'bg-amber-950/40 border-amber-500/50 ring-1 ring-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
              : 'bg-slate-950/60 border-slate-800/80 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between font-mono mb-1.5">
            <span className="font-semibold text-xs text-slate-200">CCC Subprime</span>
            <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
              300–699
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            9.20% <span className="text-[10px] text-slate-400 font-normal">APY</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug">
            Distressed Tier · Liquidation guard
          </p>
        </div>
      </div>

      {/* Explanatory Protocol Note */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-400 flex items-start gap-2.5">
        <Cpu className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
        <div className="space-y-1">
          <span className="text-slate-200 font-medium">Synchronous Re-rating via Precompile 0xFD2:</span>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Borrowing spreads are directly hardcoded into Creditcoin CC3 state. When external source-chain repayments are validated through Substrate Precompile 0xFD2 and attested by AMD SEV-SNP enclaves, borrower credit scores upgrade instantly, lowering active APY from 9.20% down to 4.10% without oracle lag.
          </p>
        </div>
      </div>
    </div>
  );
}
