'use client';

import React, { useState } from 'react';
import { Wallet, AlertTriangle, ChevronDown } from 'lucide-react';
import { useWeb3 } from './web3-provider';
import { WalletModal } from './wallet-modal';
import { formatAddress } from '@/lib/web3-config';

interface ConnectWalletButtonProps {
  className?: string;
}

export function ConnectWalletButton({ className = '' }: ConnectWalletButtonProps) {
  const { account, isCorrectNetwork, nativeBalance, switchNetwork, isConnecting } = useWeb3();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {!account ? (
        /* Disconnected State */
        <button
          data-testid="connect-wallet-btn"
          onClick={() => setModalOpen(true)}
          disabled={isConnecting}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap ${className}`}
        >
          <Wallet className="h-3.5 w-3.5 fill-slate-950" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      ) : !isCorrectNetwork ? (
        /* Wrong Network State */
        <button
          data-testid="switch-network-btn"
          onClick={switchNetwork}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all animate-pulse whitespace-nowrap ${className}`}
          title="Click to auto-switch to Creditcoin CC3 (Chain ID 102031)"
        >
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          <span>Switch to CC3 (102031)</span>
        </button>
      ) : (
        /* Connected on Creditcoin CC3 State */
        <button
          data-testid="connected-account-btn"
          onClick={() => setModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all ${className}`}
          title="Click to view account and balances"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs">{formatAddress(account)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800/80 font-mono text-[10px] text-cyan-300">
            <span>{nativeBalance}</span>
            <span className="text-slate-500">tCTC</span>
          </div>

          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      )}

      {/* Wallet Modal */}
      <WalletModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
