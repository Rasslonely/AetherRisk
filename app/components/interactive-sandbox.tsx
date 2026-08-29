'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Cpu,
  Building2,
  CheckCircle2,
  Bot,
  FileText,
  Loader2,
} from 'lucide-react';
import { SIMULATION_PERSONAS } from '@/lib/telemetry-seed';
import { SimulationPersona } from '@/lib/types';
import { VisualPipelineCanvas } from './visual-pipeline-canvas';

interface InteractiveSandboxProps {
  isCompact?: boolean;
  initialPersonaId?: string;
}

export function InteractiveSandbox({
  isCompact = false,
  initialPersonaId = 'persona-apex',
}: InteractiveSandboxProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(initialPersonaId);
  const [simulationState, setSimulationState] = useState<'IDLE' | 'SIMULATING' | 'RESOLVED'>('IDLE');
  const [pipelinePhase, setPipelinePhase] = useState<number>(0);

  const selectedPersona: SimulationPersona =
    SIMULATION_PERSONAS.find((p) => p.id === selectedPersonaId) || SIMULATION_PERSONAS[0];

  const [displayScore, setDisplayScore] = useState<number>(selectedPersona.currentScore);
  const [displayHealth, setDisplayHealth] = useState<number>(
    selectedPersona.currentScore >= 800 ? 1.84 : 0.87
  );
  const [displayApy, setDisplayApy] = useState<number>(selectedPersona.currentApy);
  const [displayCreditLine, setDisplayCreditLine] = useState<number>(selectedPersona.currentCreditLine);

  // Gemini Copilot state
  const [copilotBriefing, setCopilotBriefing] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);

  // Reset metrics when persona changes
  useEffect(() => {
    setSimulationState('IDLE');
    setPipelinePhase(0);
    setDisplayScore(selectedPersona.currentScore);
    setDisplayHealth(selectedPersona.currentScore >= 800 ? 1.84 : 0.87);
    setDisplayApy(selectedPersona.currentApy);
    setDisplayCreditLine(selectedPersona.currentCreditLine);
    setCopilotBriefing(null);
    setCopilotLoading(false);
  }, [selectedPersonaId, selectedPersona]);

  // Fetch Gemini Copilot briefing
  const fetchCopilotBriefing = async (targetScore: number, targetApy: number) => {
    try {
      setCopilotLoading(true);
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerName: selectedPersona.name,
          borrowerAddress: selectedPersona.address,
          action: selectedPersona.defaultAction,
          amount: selectedPersona.defaultAmount,
          asset: selectedPersona.defaultAsset,
          oldScore: selectedPersona.currentScore,
          newScore: targetScore,
          oldApy: selectedPersona.currentApy,
          newApy: targetApy,
          latency: 12.4,
          precompile: '0xFD2 (NativeQueryVerifier)',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.narrative) {
          setCopilotBriefing(data.narrative);
        }
      }
    } catch (err) {
      console.warn('Copilot briefing fetch error:', err);
    } finally {
      setCopilotLoading(false);
    }
  };

  // Execute Simulation
  const handleSimulate = async () => {
    if (simulationState === 'SIMULATING') return;

    setSimulationState('SIMULATING');
    setPipelinePhase(1);
    setCopilotBriefing(null);

    try {
      setTimeout(() => setPipelinePhase(2), 600);
      setTimeout(() => setPipelinePhase(3), 1400);

      // Trigger the backend simulation API with fallback
      let data: any = null;
      try {
        const response = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            borrowerAddress: selectedPersona.address,
            personaId: selectedPersona.id,
            action: selectedPersona.defaultAction,
            amount: selectedPersona.defaultAmount,
          }),
        });
        if (response.ok) {
          data = await response.json();
        }
      } catch (fetchErr) {
        console.warn('Simulation API offline fallback:', fetchErr);
      }

      // Phase 4 (Precompile 0xFD2 Verified): 2400ms
      setTimeout(() => {
        setPipelinePhase(4);
        setSimulationState('RESOLVED');

        const targetScore = data?.afterState?.creditScore || selectedPersona.targetScore;
        const targetHealth =
          data?.afterState?.healthFactor ||
          (selectedPersona.id === 'persona-apex'
            ? 1.84
            : selectedPersona.id === 'persona-solargrid'
            ? 1.45
            : 2.4);
        const targetApy = data?.afterState?.apy || selectedPersona.targetApy;
        const targetCredit = data?.afterState?.maxCreditLineUsd || selectedPersona.targetCreditLine;

        const duration = 1200;
        const startTime = performance.now();
        const startScore = selectedPersona.currentScore;
        const startHealth = selectedPersona.currentScore >= 800 ? 1.84 : 0.87;
        const startApy = selectedPersona.currentApy;
        const startCredit = selectedPersona.currentCreditLine;

        const animateCounters = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          setDisplayScore(Math.round(startScore + (targetScore - startScore) * easeProgress));
          setDisplayHealth(
            Number((startHealth + (targetHealth - startHealth) * easeProgress).toFixed(2))
          );
          setDisplayApy(Number((startApy + (targetApy - startApy) * easeProgress).toFixed(1)));
          setDisplayCreditLine(
            Math.round(startCredit + (targetCredit - startCredit) * easeProgress)
          );

          if (progress < 1) {
            requestAnimationFrame(animateCounters);
          }
        };

        requestAnimationFrame(animateCounters);

        // Auto-fetch Gemini AI Underwriting Memo
        fetchCopilotBriefing(targetScore, targetApy);
      }, 2400);
    } catch (err) {
      console.error('Simulation error:', err);
      setSimulationState('IDLE');
      setPipelinePhase(0);
    }
  };

  const handleReset = () => {
    setSimulationState('IDLE');
    setPipelinePhase(0);
    setDisplayScore(selectedPersona.currentScore);
    setDisplayHealth(selectedPersona.currentScore >= 800 ? 1.84 : 0.87);
    setDisplayApy(selectedPersona.currentApy);
    setDisplayCreditLine(selectedPersona.currentCreditLine);
    setCopilotBriefing(null);
    setCopilotLoading(false);
  };

  const isResolved = simulationState === 'RESOLVED';
  const isSimulating = simulationState === 'SIMULATING';

  return (
    <div
      data-testid="interactive-sandbox"
      className="relative w-full rounded-3xl border border-slate-800 bg-slate-950 p-6 md:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden"
    >
      {/* Double Bezel Inset Highlight */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

      {/* Dynamic Ambient Background Glow */}
      <motion.div
        animate={{
          background: isResolved
            ? 'radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)'
            : 'radial-gradient(circle at 25% 25%, rgba(239, 68, 68, 0.1) 0%, transparent 60%)',
        }}
        transition={{ duration: 1 }}
        className="absolute -inset-24 rounded-full blur-3xl pointer-events-none"
      />

      {/* Top Bar: Title & Persona Selector */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="h-3 w-3" />
              Autonomous Risk Engine
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-slate-900 text-slate-400 border border-slate-800">
              Creditcoin CC3 Fast-Path
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-2 tracking-tight">
            Institutional Risk Mutation Simulator
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Synchronous cross-chain credit re-underwriting on Creditcoin CC3 in real time
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
          {SIMULATION_PERSONAS.map((p) => {
            const isSelected = p.id === selectedPersonaId;
            return (
              <button
                key={p.id}
                data-testid={`persona-btn-${p.id.replace('persona-', '')}`}
                onClick={() => setSelectedPersonaId(p.id)}
                disabled={isSimulating}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{p.name.split(' ')[0]}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {p.sector.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual-State Viewport: BEFORE vs AFTER Cards */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        {/* BEFORE CARD (🔴 High Risk / Distress State) */}
        <motion.div
          animate={{
            borderColor: isResolved ? 'rgba(51, 65, 85, 0.4)' : 'rgba(239, 68, 68, 0.4)',
            opacity: isResolved ? 0.65 : 1,
            scale: isResolved ? 0.98 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border bg-slate-950/80 p-6 backdrop-blur-xl shadow-xl overflow-hidden"
        >
          {/* Double Bezel Inset Highlight */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

          <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-950/80 border border-red-500/40 text-red-400">
                <ShieldAlert className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-semibold">
                  T-0 State • Initial Risk Tier
                </span>
                <h3 className="text-sm font-semibold text-slate-200">{selectedPersona.name}</h3>
              </div>
            </div>

            <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              ● {selectedPersona.currentScore < 700 ? 'LIQUIDATION WARNING' : 'STANDARD RATE'}
            </span>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Credit Score</span>
                <span className="text-[10px] font-mono text-red-400">
                  {selectedPersona.currentScore < 700 ? 'Subprime Tier' : 'Prime Tier'}
                </span>
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span
                  data-testid="credit-score-value"
                  className="text-2xl font-bold font-mono text-red-400"
                >
                  {isResolved ? selectedPersona.currentScore : displayScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 850</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(selectedPersona.currentScore / 850) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Health Factor</span>
                <span className="text-[10px] font-mono text-red-400">
                  {selectedPersona.currentScore < 700 ? '< 1.00 Danger' : 'Standard'}
                </span>
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span
                  data-testid="health-factor-value"
                  className="text-2xl font-bold font-mono text-red-400"
                >
                  {isResolved
                    ? selectedPersona.currentScore >= 800
                      ? '1.84'
                      : '0.87'
                    : displayHealth}
                </span>
                <span className="text-xs text-slate-500 font-mono">HF</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${selectedPersona.currentScore < 700 ? 40 : 80}%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800/80">
              <span className="text-[11px] text-slate-400">Borrowing APY</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span data-testid="apy-value" className="text-xl font-bold font-mono text-red-400">
                  {isResolved ? selectedPersona.currentApy : displayApy}%
                </span>
                <span className="text-xs text-red-500/80 font-mono">Rate</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800/80">
              <span className="text-[11px] text-slate-400">Credit Limit</span>
              <div className="text-xl font-bold font-mono text-slate-200 mt-1.5">
                $
                {(isResolved
                  ? selectedPersona.currentCreditLine
                  : displayCreditLine
                ).toLocaleString('en-US')}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-red-950/30 border border-red-500/20 flex items-center justify-between text-xs text-red-300">
            <span>
              Pending Event: {selectedPersona.defaultAction} ${selectedPersona.defaultAmount.toLocaleString('en-US')} {selectedPersona.defaultAsset}
            </span>
            <span className="font-mono text-[10px] text-red-400">Sepolia L1</span>
          </div>
        </motion.div>

        {/* AFTER CARD (🟢 Prime Tier / Re-underwritten Healthy State) */}
        <motion.div
          animate={{
            borderColor: isResolved ? 'rgba(16, 185, 129, 0.5)' : 'rgba(51, 65, 85, 0.4)',
            boxShadow: isResolved
              ? '0 0 35px rgba(16, 185, 129, 0.15)'
              : '0 0 0px rgba(0, 0, 0, 0)',
            scale: isResolved ? 1.01 : 0.98,
          }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border bg-slate-950/80 p-6 backdrop-blur-xl shadow-xl overflow-hidden"
        >
          {/* Double Bezel Inset Highlight */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

          <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  isResolved
                    ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-600'
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                    isResolved ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  T+15s Re-underwritten State
                </span>
                <h3 className="text-sm font-semibold text-slate-200">{selectedPersona.name}</h3>
              </div>
            </div>

            <span
              className={`flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-full ${
                isResolved
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {isResolved ? '✅ PRIME INVESTMENT TIER' : '○ AWAITING SIMULATION'}
            </span>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Credit Score</span>
                {isResolved && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />+
                    {selectedPersona.targetScore - selectedPersona.currentScore}
                  </span>
                )}
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span
                  data-testid="after-credit-score-value"
                  className={`text-2xl font-bold font-mono ${
                    isResolved ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {isResolved ? displayScore : '---'}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 850</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{
                    width: isResolved
                      ? `${(selectedPersona.targetScore / 850) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Health Factor</span>
                {isResolved && (
                  <span className="text-[10px] font-mono text-emerald-400">Prime Overcollateralized</span>
                )}
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span
                  data-testid="after-health-factor-value"
                  className={`text-2xl font-bold font-mono ${
                    isResolved ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {isResolved ? displayHealth : '---'}
                </span>
                <span className="text-xs text-slate-500 font-mono">HF</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{
                    width: isResolved ? '92%' : '0%',
                  }}
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Borrowing APY</span>
                {isResolved && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                    <TrendingDown className="h-3 w-3" />-
                    {(selectedPersona.currentApy - selectedPersona.targetApy).toFixed(1)}%
                  </span>
                )}
              </span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span
                  className={`text-xl font-bold font-mono ${
                    isResolved ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {isResolved ? `${displayApy}%` : '---'}
                </span>
                {isResolved && <span className="text-xs text-emerald-500/80 font-mono">Prime</span>}
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Credit Limit</span>
                {isResolved && (
                  <span className="text-[10px] font-mono text-emerald-400">
                    +$
                    {(
                      selectedPersona.targetCreditLine - selectedPersona.currentCreditLine
                    ).toLocaleString('en-US')}
                  </span>
                )}
              </span>
              <div
                className={`text-xl font-bold font-mono mt-1.5 ${
                  isResolved ? 'text-slate-100' : 'text-slate-500'
                }`}
              >
                {isResolved ? `$${displayCreditLine.toLocaleString('en-US')}` : '---'}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              {isResolved ? 'TEE Enclave Signature EIP-712' : 'Hardware Attestation'}
            </span>
            <span
              className={`font-mono text-[10px] ${
                isResolved ? 'text-emerald-400 font-semibold' : 'text-slate-500'
              }`}
            >
              {isResolved ? '0x90F7...b906 (AMD SEV-SNP)' : 'Standing By'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Action Controls & Triggers */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            data-testid="simulate-repay-btn"
            onClick={handleSimulate}
            disabled={isSimulating}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-lg ${
              isSimulating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            <Zap className={`h-4 w-4 ${isSimulating ? 'animate-spin' : 'fill-slate-950'}`} />
            <span>
              {isSimulating
                ? 'Verifying Cross-Chain Proof...'
                : isResolved
                ? 'Re-Run Proof Verification'
                : `Simulate Repayment ($${selectedPersona.defaultAmount.toLocaleString('en-US')} ${selectedPersona.defaultAsset})`}
            </span>
            <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center">
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {isResolved && (
            <button
              data-testid="reset-sim-btn"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset State</span>
            </button>
          )}
        </div>

        {/* Proof Resolution Status Badge */}
        <div className="flex items-center gap-2">
          {isResolved ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Resolved in 12.4s (Zero Oracle Latency)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>Synchronous Substrate Precompile Bytecode</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Underwriting Briefing (Gemini Agentic Copilot) */}
      <AnimatePresence>
        {(copilotLoading || copilotBriefing) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 mt-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-5 backdrop-blur-xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    Institutional Underwriting Memo
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      Google Gemini AI Studio
                    </span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Autonomous Credit Copilot • Real-Time Bayesian Synthesis
                  </span>
                </div>
              </div>

              {copilotLoading && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Synthesizing Memo...</span>
                </div>
              )}
            </div>

            {copilotBriefing ? (
              <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-sans">
                {copilotBriefing.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <div className="h-16 flex items-center justify-center text-xs text-slate-500 font-mono">
                Generating credit risk evaluation...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded Visual Stepper Pipeline Canvas */}
      <div className="relative z-10 mt-6">
        <VisualPipelineCanvas
          phase={pipelinePhase}
          isSimulating={isSimulating}
          provenAmountUsd={selectedPersona.defaultAmount}
          action={selectedPersona.defaultAction}
          latencySec={12.4}
        />
      </div>
    </div>
  );
}
