'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
  Fuel,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useWeb3 } from './web3-provider';
import { requestFaucetFunds, FaucetClaimResult } from '@/lib/contracts/mock-usdc';
import { CREDITCOIN_CC3_TESTNET, CONTRACT_ADDRESSES } from '@/lib/web3-config';

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FaucetModal({ isOpen, onClose }: FaucetModalProps) {
  const { account, refreshBalances } = useWeb3();
  const [recipientInput, setRecipientInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [claimResult, setClaimResult] = useState<FaucetClaimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (account) {
      setRecipientInput(account);
    }
  }, [account]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClaim = async () => {
    const targetAddress = recipientInput.trim() || account;
    if (!targetAddress) {
      setError('Please enter or connect a valid EVM recipient address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await requestFaucetFunds(targetAddress);
      setClaimResult(result);
      // Refresh Web3 balances immediately
      await refreshBalances();
    } catch (err: any) {
      setError(err.message || 'Failed to claim testnet tokens.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleReset = () => {
    setClaimResult(null);
    setError(null);
    if (account) setRecipientInput(account);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
        {/* Backdrop overlay */}
        <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

        <motion.div
          data-testid="faucet-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg my-auto rounded-3xl border border-slate-800 bg-slate-900/98 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-6 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Coins className="h-5 w-5 fill-slate-950" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                  Institutional Capital Faucet
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    1-Click Minter
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Instant 10,000 iUSDC allocation on Creditcoin CC3 Testnet
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {!claimResult ? (
            /* Claim Form State */
            <div className="space-y-5">
              {/* Allocation Summary Cards */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase text-slate-500 block">
                    Institutional Asset
                  </span>
                  <span className="text-lg font-bold text-cyan-300 block">10,000 iUSDC</span>
                  <span className="text-[10px] text-slate-400 block">ERC-20 Capital</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase text-slate-500 block">
                    Testnet Gas Reserve
                  </span>
                  <span className="text-lg font-bold text-emerald-400 block">+0.50 tCTC</span>
                  <span className="text-[10px] text-slate-400 block">Auto-Provisioned</span>
                </div>
              </div>

              {/* Recipient Input */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span>RECIPIENT ADDRESS</span>
                  {account && recipientInput !== account && (
                    <button
                      onClick={() => setRecipientInput(account)}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Use Connected Wallet
                    </button>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    placeholder="0x..."
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Contract Metadata Details */}
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5 text-xs font-mono text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Target Network:</span>
                  <span className="text-slate-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Creditcoin CC3 (102031)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Token Contract:</span>
                  <span className="text-slate-300 truncate max-w-[200px]">
                    {CONTRACT_ADDRESSES.CC3.MOCK_IUSDC}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                data-testid="faucet-claim-btn"
                onClick={handleClaim}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Minting 10,000 iUSDC on Creditcoin CC3...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 fill-slate-950" />
                    <span>Claim 10,000 iUSDC Capital</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Success State */
            <div className="space-y-5 text-center py-2">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-100">Capital Disbursed Successfully!</h4>
                <p className="text-xs text-slate-400">
                  10,000 iUSDC testnet tokens transferred to your wallet on Creditcoin CC3.
                </p>
              </div>

              {/* Transaction Receipt Pill */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>DISPERSED CAPITAL:</span>
                  <span className="text-cyan-300 font-bold">10,000.00 iUSDC</span>
                </div>

                {claimResult.gasSent && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>GAS PROVISIONED:</span>
                    <span className="text-emerald-400 font-bold">+0.50 tCTC</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-slate-500">TX HASH:</span>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="truncate max-w-[150px]">{claimResult.txHash}</span>
                    <button
                      onClick={() => handleCopy(claimResult.txHash || '')}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                      title="Copy Tx Hash"
                    >
                      {copiedHash ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <a
                  href={claimResult.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
                >
                  <span>View on Blockscout</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800 pt-3">
            <span>Creditcoin CC3 (Frontier EVM)</span>
            <span>Non-custodial Testnet Faucet</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
