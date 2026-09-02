'use client';

import React from 'react';
import { VaultOverview, UserVaultPosition } from '@/lib/contracts/aether-vault';
import {
  Landmark,
  PiggyBank,
  Receipt,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

interface VaultMetricsGridProps {
  vault: VaultOverview;
  user?: UserVaultPosition;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function VaultMetricsGrid({
  vault,
  user,
  isLoading = false,
  onRefresh,
}: VaultMetricsGridProps) {
  return (
    <div className="space-y-3">
      {/* Header bar with auto-refresh */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-mono tracking-wider text-slate-400 uppercase flex items-center gap-2">
          <span>ON-CHAIN PROTOCOL METRICS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </span>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
            title="Refresh on-chain vault state"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Ledger</span>
          </button>
        )}
      </div>

      {/* 5-Card Metrics Grid with Double-Bezel Nested Architecture */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Vault Capital */}
        <div
          data-testid="metric-total-assets"
          className="rounded-3xl p-0.5 bg-gradient-to-b from-cyan-500/20 via-slate-800/40 to-slate-900/60 ring-1 ring-white/5 group hover:ring-cyan-500/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="h-full rounded-[1.375rem] p-4 bg-slate-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Total Liquidity
                </span>
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Landmark className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 tracking-tight tabular-nums">
                ${vault.totalAssetsFormatted}
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-2 flex items-center justify-between border-t border-slate-900 pt-2">
              <span>Pool: iUSDC</span>
              <span className="text-cyan-400 font-medium">
                {(100 - vault.utilizationRate).toFixed(0)}% Avail
              </span>
            </div>
          </div>
        </div>

        {/* 2. Your Deposited Yield Position */}
        <div
          data-testid="metric-user-shares"
          className="rounded-3xl p-0.5 bg-gradient-to-b from-emerald-500/20 via-slate-800/40 to-slate-900/60 ring-1 ring-white/5 group hover:ring-emerald-500/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="h-full rounded-[1.375rem] p-4 bg-slate-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Your Position
                </span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <PiggyBank className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
                {user ? `${user.sharesFormatted}` : '0.00'}
                <span className="text-xs text-slate-400 ml-1 font-normal">avUSD</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-2 border-t border-slate-900 pt-2 truncate">
              {user && user.shares > 0n
                ? `≈ $${user.underlyingAssetsFormatted} iUSDC`
                : 'Zero deposited capital'}
            </div>
          </div>
        </div>

        {/* 3. Active Borrowed Debt */}
        <div
          data-testid="metric-user-debt"
          className="rounded-3xl p-0.5 bg-gradient-to-b from-amber-500/20 via-slate-800/40 to-slate-900/60 ring-1 ring-white/5 group hover:ring-amber-500/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="h-full rounded-[1.375rem] p-4 bg-slate-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Active Debt
                </span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Receipt className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 tracking-tight tabular-nums">
                ${user ? user.totalDebtDueFormatted : '0.00'}
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-2 border-t border-slate-900 pt-2 truncate">
              {user && user.totalDebtDue > 0n
                ? `Principal: $${user.borrowedPrincipalFormatted}`
                : 'No debt outstanding'}
            </div>
          </div>
        </div>

        {/* 4. Available Credit Line Limit */}
        <div
          data-testid="metric-available-credit"
          className="rounded-3xl p-0.5 bg-gradient-to-b from-blue-500/20 via-slate-800/40 to-slate-900/60 ring-1 ring-white/5 group hover:ring-blue-500/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="h-full rounded-[1.375rem] p-4 bg-slate-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Credit Limit
                </span>
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-cyan-300 tracking-tight tabular-nums">
                ${user ? user.availableCreditFormatted : '1,000,000.00'}
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-2 flex items-center justify-between border-t border-slate-900 pt-2">
              <span>Score: {user ? user.creditScore : 620}</span>
              <span className="text-emerald-400 font-medium">TEE-Attested</span>
            </div>
          </div>
        </div>

        {/* 5. Dynamic Borrowing APY */}
        <div
          data-testid="metric-dynamic-apy"
          className="rounded-3xl p-0.5 bg-gradient-to-b from-purple-500/20 via-slate-800/40 to-slate-900/60 ring-1 ring-white/5 group hover:ring-purple-500/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <div className="h-full rounded-[1.375rem] p-4 bg-slate-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Borrow APY
                </span>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
                {user ? `${user.borrowApyPercent}%` : '6.50%'}
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-2 border-t border-slate-900 pt-2">
              Dynamic risk-spread curve
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
