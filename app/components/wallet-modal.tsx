'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  LogOut,
  RefreshCw,
  Coins,
  ArrowRight,
} from 'lucide-react';
import { useWeb3 } from './web3-provider';
import { CREDITCOIN_CC3_TESTNET, formatAddress } from '@/lib/web3-config';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFaucet?: () => void;
}

export function WalletModal({ isOpen, onClose, onOpenFaucet }: WalletModalProps) {
  const {
    account,
    chainId,
    isCorrectNetwork,
    nativeBalance,
    usdcBalance,
    isConnecting,
    error,
    discoveredWallets,
    activeWalletInfo,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalances,
  } = useWeb3();

  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const handleCopy = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalances();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
        {/* Backdrop click */}
        <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

        <motion.div
          data-testid="wallet-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg my-auto rounded-3xl border border-slate-800 bg-slate-900/98 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-6 z-10"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                  {account ? 'Connected Account' : 'Connect Web3 Wallet'}
                </h3>
                <p className="text-xs text-slate-400">
                  {account
                    ? 'Creditcoin CC3 Live On-Chain Session'
                    : 'Select your injected provider via EIP-6963'}
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

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Body Content */}
          {!account ? (
            /* Disconnected State: Wallet Selection */
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                  Detected Injected Wallets (EIP-6963)
                </span>

                {discoveredWallets.length > 0 ? (
                  <div className="space-y-2">
                    {discoveredWallets.map((wallet) => (
                      <button
                        key={wallet.info.uuid}
                        onClick={async () => {
                          await connectWallet(wallet.info.rdns);
                          onClose();
                        }}
                        disabled={isConnecting}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-950 hover:border-cyan-500/40 text-slate-200 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          {wallet.info.icon ? (
                            <img
                              src={wallet.info.icon}
                              alt={wallet.info.name}
                              className="h-7 w-7 rounded-lg shrink-0"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                              <Wallet className="h-4 w-4" />
                            </div>
                          )}
                          <div className="text-left">
                            <span className="text-sm font-semibold block group-hover:text-cyan-300 transition-colors">
                              {wallet.info.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {wallet.info.rdns}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Connect <ArrowRight className="h-3 w-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Generic Injected Provider Fallback */
                  <button
                    onClick={async () => {
                      await connectWallet();
                      onClose();
                    }}
                    disabled={isConnecting}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-slate-950 hover:border-cyan-500/40 text-slate-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Wallet className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-semibold block group-hover:text-cyan-300 transition-colors">
                          Browser Injected Wallet
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          MetaMask / Rabby / OKX / Coinbase / Phantom
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                      {isConnecting ? 'Connecting...' : 'Connect'} <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                )}
              </div>

              {/* Target Network Note */}
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Target: Creditcoin CC3
                </span>
                <span className="text-[11px] text-slate-500">Chain ID: 102031</span>
              </div>
            </div>
          ) : (
            /* Connected State: Account Overview & Balances */
            <div className="space-y-5">
              {/* Account Address Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-medium text-slate-300">
                      {activeWalletInfo?.name || 'Injected Wallet'}
                    </span>
                  </div>

                  {/* Network Status Badge */}
                  {isCorrectNetwork ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      CC3 Testnet (102031)
                    </span>
                  ) : (
                    <button
                      onClick={switchNetwork}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                    >
                      Switch to CC3 (102031)
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
                  <span className="truncate">{account}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={handleCopy}
                      className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Copy Address"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <a
                      href={`${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="View on Blockscout"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Real-time Balances Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span>ON-CHAIN BALANCES</span>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono">
                  {/* Native Gas Token (tCTC) */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase text-slate-500 block">
                      Native Gas (tCTC)
                    </span>
                    <span className="text-base font-bold text-slate-100 block truncate">
                      {nativeBalance}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Creditcoin CC3</span>
                  </div>

                  {/* Institutional Asset (iUSDC) */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase text-slate-500 block">
                      Asset Token (iUSDC)
                    </span>
                    <span className="text-base font-bold text-cyan-300 block truncate">
                      ${usdcBalance}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Institutional USDC</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    disconnectWallet();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 border border-red-500/20 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Disconnect</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
