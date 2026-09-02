'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './web3-provider';
import {
  VaultOverview,
  UserVaultPosition,
  approveVault,
  depositToVault,
  withdrawFromVault,
  borrowFromVault,
  repayToVault,
} from '@/lib/contracts/aether-vault';
import { CREDITCOIN_CC3_TESTNET, CONTRACT_ADDRESSES } from '@/lib/web3-config';
import {
  Coins,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Wallet,
  Sparkles,
  Info,
} from 'lucide-react';

interface VaultOperationsCardProps {
  vault: VaultOverview;
  user?: UserVaultPosition;
  onOperationSuccess: () => Promise<void>;
}

type TabType = 'deposit' | 'borrow' | 'repay' | 'withdraw';

export function VaultOperationsCard({
  vault,
  user,
  onOperationSuccess,
}: VaultOperationsCardProps) {
  const { account, signer, isCorrectNetwork, switchNetwork, connectWallet } = useWeb3();
  const [activeTab, setActiveTab] = useState<TabType>('deposit');
  const [amountInput, setAmountInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txStep, setTxStep] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Max helpers
  const handleSetMax = () => {
    if (!user) return;
    if (activeTab === 'deposit') {
      setAmountInput(user.usdcBalanceFormatted.replace(/,/g, ''));
    } else if (activeTab === 'borrow') {
      const maxBorrow =
        user.availableCredit < vault.availableLiquidity
          ? user.availableCredit
          : vault.availableLiquidity;
      setAmountInput(ethers.formatUnits(maxBorrow, 18));
    } else if (activeTab === 'repay') {
      const maxRepay =
        user.totalDebtDue < user.usdcBalance ? user.totalDebtDue : user.usdcBalance;
      setAmountInput(ethers.formatUnits(maxRepay, 18));
    } else if (activeTab === 'withdraw') {
      setAmountInput(user.sharesFormatted.replace(/,/g, ''));
    }
  };

  const handleExecute = async () => {
    if (!account || !signer) {
      setErrorMessage('Please connect your Web3 wallet.');
      return;
    }

    if (!isCorrectNetwork) {
      setErrorMessage('Please switch to Creditcoin CC3 Testnet (102031).');
      return;
    }

    const cleanAmount = amountInput.trim();
    if (!cleanAmount || isNaN(Number(cleanAmount)) || Number(cleanAmount) <= 0) {
      setErrorMessage('Please enter a valid positive numerical amount.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setLastTxHash(null);

    try {
      const parsedAmount = ethers.parseUnits(cleanAmount, 18);

      if (activeTab === 'deposit') {
        // 1. Check Allowance
        if (!user || user.allowance < parsedAmount) {
          setTxStep('Step 1/2: Approving iUSDC for AetherVault4626...');
          const appReceipt = await approveVault(parsedAmount, signer);
          if (!appReceipt) throw new Error('Token approval rejected.');
        }

        // 2. Deposit
        setTxStep('Step 2/2: Depositing iUSDC into Vault...');
        const depReceipt = await depositToVault(parsedAmount, account, signer);
        if (!depReceipt) throw new Error('Deposit transaction failed.');
        setLastTxHash(depReceipt.hash);
      } else if (activeTab === 'borrow') {
        setTxStep('Origination: Borrowing uncollateralized capital from Vault...');
        const borrowReceipt = await borrowFromVault(parsedAmount, signer);
        if (!borrowReceipt) throw new Error('Borrow transaction failed.');
        setLastTxHash(borrowReceipt.hash);
      } else if (activeTab === 'repay') {
        // 1. Check Allowance
        if (!user || user.allowance < parsedAmount) {
          setTxStep('Step 1/2: Approving iUSDC for Debt Repayment...');
          const appReceipt = await approveVault(parsedAmount, signer);
          if (!appReceipt) throw new Error('Token approval rejected.');
        }

        // 2. Repay
        setTxStep('Step 2/2: Repaying principal & interest to Vault...');
        const repayReceipt = await repayToVault(parsedAmount, signer);
        if (!repayReceipt) throw new Error('Repay transaction failed.');
        setLastTxHash(repayReceipt.hash);
      } else if (activeTab === 'withdraw') {
        setTxStep('Redeeming: Burning avUSD shares and withdrawing iUSDC...');
        const withdrawReceipt = await withdrawFromVault(parsedAmount, account, account, signer);
        if (!withdrawReceipt) throw new Error('Withdrawal transaction failed.');
        setLastTxHash(withdrawReceipt.hash);
      }

      setAmountInput('');
      await onOperationSuccess();
    } catch (err: any) {
      console.error('Vault operation failed:', err);
      setErrorMessage(err.reason || err.message || 'Transaction failed on Creditcoin CC3.');
    } finally {
      setIsProcessing(false);
      setTxStep(null);
    }
  };

  return (
    <div
      data-testid="vault-operations-card"
      className="rounded-3xl p-0.5 sm:p-1 bg-gradient-to-b from-slate-800/80 via-slate-900/60 to-slate-950 ring-1 ring-white/5 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
    >
      <div className="rounded-[1.375rem] p-5 sm:p-6 bg-slate-900/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-6">
        {/* 4-Tab Navigation Header */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
        <button
          data-testid="tab-deposit"
          onClick={() => {
            setActiveTab('deposit');
            setErrorMessage(null);
            setAmountInput('');
          }}
          className={`py-2.5 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'deposit'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <ArrowDownRight className="h-3.5 w-3.5 text-emerald-400" />
          <span>Deposit</span>
        </button>

        <button
          data-testid="tab-borrow"
          onClick={() => {
            setActiveTab('borrow');
            setErrorMessage(null);
            setAmountInput('');
          }}
          className={`py-2.5 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'borrow'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Coins className="h-3.5 w-3.5 text-cyan-400" />
          <span>Borrow</span>
        </button>

        <button
          data-testid="tab-repay"
          onClick={() => {
            setActiveTab('repay');
            setErrorMessage(null);
            setAmountInput('');
          }}
          className={`py-2.5 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'repay'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5 text-purple-400" />
          <span>Repay</span>
        </button>

        <button
          data-testid="tab-withdraw"
          onClick={() => {
            setActiveTab('withdraw');
            setErrorMessage(null);
            setAmountInput('');
          }}
          className={`py-2.5 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'withdraw'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <ArrowUpRight className="h-3.5 w-3.5 text-amber-400" />
          <span>Withdraw</span>
        </button>
      </div>

      {/* Tab Context Banner */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-cyan-400" />
          {activeTab === 'deposit' && 'Lend iUSDC to earn dynamic borrower interest'}
          {activeTab === 'borrow' && 'Drawdown uncollateralized capital within credit line'}
          {activeTab === 'repay' && 'Settle loan balance to restore available credit limit'}
          {activeTab === 'withdraw' && 'Burn avUSD vault shares to redeem capital + yield'}
        </span>

        {user && (
          <span className="text-slate-500">
            {activeTab === 'deposit' && `Wallet: $${user.usdcBalanceFormatted}`}
            {activeTab === 'borrow' && `Credit Line: $${user.availableCreditFormatted}`}
            {activeTab === 'repay' && `Total Due: $${user.totalDebtDueFormatted}`}
            {activeTab === 'withdraw' && `Shares: ${user.sharesFormatted} avUSD`}
          </span>
        )}
      </div>

      {/* Input Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono text-slate-300">
            {activeTab === 'withdraw' ? 'SHARES TO BURN (avUSD)' : 'TRANSACTION AMOUNT (iUSDC)'}
          </label>
          <button
            onClick={handleSetMax}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase font-semibold"
          >
            Max Amount
          </button>
        </div>

        <div className="relative">
          <input
            data-testid="vault-amount-input"
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="0.00"
            disabled={isProcessing}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 font-mono text-base text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
            <span>{activeTab === 'withdraw' ? 'avUSD' : 'iUSDC'}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Operation Parameters */}
      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-400">
          <span>Target Contract:</span>
          <span className="text-slate-200">AetherVault4626 (0xD9B3...eFd39)</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Target Network:</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Creditcoin CC3 Testnet (102031)
          </span>
        </div>
        {activeTab === 'borrow' && user && (
          <div className="flex items-center justify-between text-slate-400">
            <span>Borrower APY Spread:</span>
            <span className="text-cyan-300 font-bold">{user.borrowApyPercent}% (Dynamic)</span>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Processing Status Notice */}
      {isProcessing && txStep && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2.5">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cyan-400" />
          <span>{txStep}</span>
        </div>
      )}

      {/* Success Transaction Confirmation */}
      {lastTxHash && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Transaction Confirmed on Creditcoin CC3!</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-slate-400 truncate max-w-[200px]">Tx: {lastTxHash}</span>
            <a
              href={`${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/tx/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:underline"
            >
              <span>Blockscout</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!account ? (
        <button
          onClick={() => connectWallet()}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all"
        >
          <Wallet className="h-4 w-4 fill-slate-950" />
          <span>Connect Wallet to Execute</span>
        </button>
      ) : !isCorrectNetwork ? (
        <button
          onClick={switchNetwork}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
        >
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span>Switch Network to Creditcoin CC3 (102031)</span>
        </button>
      ) : (
        <button
          data-testid="vault-execute-btn"
          onClick={handleExecute}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Broadcasting on Creditcoin CC3...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 fill-slate-950" />
              <span>
                {activeTab === 'deposit' && 'Execute Deposit & Mint Shares'}
                {activeTab === 'borrow' && 'Execute Uncollateralized Borrow'}
                {activeTab === 'repay' && 'Execute Debt Repayment'}
                {activeTab === 'withdraw' && 'Execute Share Redemption'}
              </span>
            </>
          )}
        </button>
      )}
      </div>
    </div>
  );
}
