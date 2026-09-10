'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, ExternalLink, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { TelemetryTable } from './telemetry-table';

interface TelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TelemetryModal({ isOpen, onClose }: TelemetryModalProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      data-testid="telemetry-modal"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-800 shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden ring-1 ring-white/5">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Creditcoin CC3 Testnet
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Cpu className="h-3 w-3" />
                Substrate Precompile 0xFD2
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              <span>Verified Cross-Chain Solvency Ledger</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              In-Context Protocol Explorer · 18 of 18 Cross-Chain Proofs Synchronously Verified
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <Link
              href="/operations"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all flex items-center gap-1.5"
            >
              <span>Dedicated Explorer</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <TelemetryTable
            showFilters={true}
            title=""
            subtitle=""
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Cryptographic Merkle receipts proven synchronously without centralized oracle relays.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-mono transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
