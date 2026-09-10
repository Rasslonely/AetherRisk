'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, FlaskConical } from 'lucide-react';

export function ModeSwitcher() {
  const pathname = usePathname();

  const isLiveMode = pathname.startsWith('/vault') || pathname.startsWith('/passport');
  const isSandboxMode = !isLiveMode;

  return (
    <div
      data-testid="mode-switcher"
      className="flex items-center p-1 rounded-full bg-slate-950/90 border border-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
      title="Switch between Live Smart Contract Web3 dApp and 30s Fast-Track Sandbox"
    >
      <Link
        href="/vault"
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
          isLiveMode
            ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
        }`}
      >
        <Zap className={`h-3 w-3 ${isLiveMode ? 'text-cyan-400 fill-cyan-400' : 'text-slate-500'}`} />
        <span className="hidden sm:inline">Live Web3 dApp</span>
        <span className="sm:hidden">Live</span>
      </Link>

      <Link
        href="/sandbox"
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
          isSandboxMode
            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
        }`}
      >
        <FlaskConical
          className={`h-3 w-3 ${isSandboxMode ? 'text-purple-400' : 'text-slate-500'}`}
        />
        <span className="hidden sm:inline">Fast-Track Sandbox</span>
        <span className="sm:hidden">Sandbox</span>
      </Link>
    </div>
  );
}
