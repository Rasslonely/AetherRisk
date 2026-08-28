'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  Zap,
  Activity,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { EnclaveCertModal } from './enclave-cert-modal';

export function Navbar() {
  const pathname = usePathname();
  const [certModalOpen, setCertModalOpen] = useState(false);

  const navLinks = [
    { name: 'Executive Overview', href: '/' },
    { name: 'Operations Feed', href: '/operations' },
    { name: '30s Judge Sandbox', href: '/sandbox' },
  ];

  return (
    <>
      <header className="sticky top-4 z-40 w-full px-4 mb-8">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 rounded-full border border-slate-800 bg-slate-950/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Logo & Hackathon Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
                <Shield className="h-5 w-5 fill-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors">
                  Aether<span className="text-cyan-400">Risk</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                  TEE RISK ENGINE
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="h-2.5 w-2.5" />
              BUIDL CTC 2026
            </span>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-full border border-slate-800">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Items: TEE Certificate & Network Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* TEE Certificate Modal Trigger Button */}
            <button
              data-testid="tee-cert-btn"
              onClick={() => setCertModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Inspect AMD SEV-SNP Remote Attestation Certificate"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">TEE Attestation</span>
              <span className="sm:hidden">TEE</span>
            </button>

            {/* Network Pill Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">Creditcoin CC3</span>
              <span className="text-slate-500 text-[10px]">102031</span>
            </div>
          </div>
        </nav>
      </header>

      {/* TEE Attestation Modal */}
      <EnclaveCertModal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} />
    </>
  );
}
