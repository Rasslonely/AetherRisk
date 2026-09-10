'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Cpu,
  Lock,
  Landmark,
  Scale,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { CREDITCOIN_CC3_TESTNET, CONTRACT_ADDRESSES } from '@/lib/web3-config';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'aetherrisk_terms_accepted_v1';

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [agreedItems, setAgreedItems] = useState({
    custody: true,
    precompile: true,
    tee: true,
    dynamicYield: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
        {/* Backdrop overlay */}
        <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

        <motion.div
          data-testid="terms-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl my-auto rounded-3xl p-0.5 bg-gradient-to-b from-cyan-500/30 via-slate-800/60 to-slate-950 ring-1 ring-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10"
        >
          <div className="rounded-[1.375rem] p-6 sm:p-8 bg-slate-950/98 max-h-[85vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                    <Scale className="h-3 w-3" />
                    <span>Institutional Compliance Protocol</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Creditcoin CC3
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                  Terms of Use & Protocol Disclaimers
                </h2>
                <p className="text-xs text-slate-400 font-sans">
                  AetherRisk operates decentralized institutional risk infrastructure on Creditcoin CC3. Review the 4 pillars of cryptographic agreement before proceeding.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 4 Pillars Agreement List */}
            <div className="space-y-3 font-sans text-xs">
              {/* 1. Non-Custodial */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-cyan-400" />
                    <span>1. Non-Custodial Smart Contract Custody</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Verified</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  User funds and liquidity shares are governed exclusively by audited, immutable ERC-4626 smart contracts (<code className="text-cyan-300 font-mono">AetherVault4626.sol</code>) deployed on Creditcoin CC3 Testnet (<code className="text-cyan-300 font-mono">102031</code>). No centralized custodian holds private custody.
                </p>
              </div>

              {/* 2. Substrate Precompile Ingestion */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-400" />
                    <span>2. Substrate Precompile 0xFD2 Synchronous Ingestion</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Sub-15s Finality</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Cross-chain settlement proofs from Ethereum Sepolia are verified directly inside Creditcoin&apos;s native Substrate precompile <code className="text-purple-300 font-mono">0x00...0FD2</code>. Settlement data is mathematically proven without reliance on multi-sig relayer oracles.
                </p>
              </div>

              {/* 3. Hardware TEE Enclave */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>3. Hardware-Isolated TEE Risk Kernel (AMD SEV-SNP)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">EIP-712 Signed</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Borrower credit scores and uncollateralized line limits are evaluated in confidential AMD SEV-SNP enclaves on Phala Network. Risk mutations are cryptographically attested and written to <code className="text-emerald-300 font-mono">CreditRegistry.sol</code> via EIP-712 signatures.
                </p>
              </div>

              {/* 4. Algorithmic Risk-Adjusted Dynamic APY */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-amber-400" />
                    <span>4. Dynamic Risk-Spread Borrowing &amp; Yield Rates</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Algorithmic</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Borrowing rates scale dynamically between 4.10% (Prime AAA) and 9.20% (Subprime CCC) based on borrower credit health and pool utilization. All testnet tokens (iUSDC, tCTC) are strictly for demonstration and hackathon testing purposes.
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-500">
                Contract: {CONTRACT_ADDRESSES.CC3.CREDIT_REGISTRY.slice(0, 10)}...
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-mono text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  data-testid="accept-terms-btn"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-mono text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 fill-slate-950" />
                  <span>Accept &amp; Enter Protocol</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
