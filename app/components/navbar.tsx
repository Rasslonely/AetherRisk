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
  Layers,
} from 'lucide-react';
import { EnclaveCertModal } from './enclave-cert-modal';
import { VerifiedContractsModal } from './verified-contracts-modal';
import { ConnectWalletButton } from './connect-wallet-button';

export function Navbar() {
  const pathname = usePathname();
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [contractsModalOpen, setContractsModalOpen] = useState(false);

  React.useEffect(() => {
    const handleOpenContracts = () => setContractsModalOpen(true);
    const handleOpenTEE = () => setCertModalOpen(true);

    window.addEventListener('open-verified-contracts', handleOpenContracts);
    window.addEventListener('open-tee-attestation', handleOpenTEE);

    return () => {
      window.removeEventListener('open-verified-contracts', handleOpenContracts);
      window.removeEventListener('open-tee-attestation', handleOpenTEE);
    };
  }, []);

  const navLinks = [
    { name: 'Executive Overview', href: '/' },
    { name: 'Operations Feed', href: '/operations' },
    { name: 'Risk Sandbox', href: '/sandbox' },
  ];

  return (
    <>
      <header className="sticky top-4 z-40 w-full px-4 mb-8">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 rounded-full border border-slate-800 bg-slate-950/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {/* Logo & Network Status Badge */}
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
                  INSTITUTIONAL UNDERWRITER
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Creditcoin CC3
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
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Group: Verified Contracts, TEE Attestation & Wallet Connect */}
          <div className="flex items-center gap-2">
            {/* Verified Contracts Modal Trigger */}
            <button
              data-testid="verified-contracts-btn"
              onClick={() => setContractsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="View Deployed Smart Contracts"
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Verified Contracts</span>
              <span className="xl:hidden hidden sm:inline">Contracts</span>
            </button>

            {/* TEE Attestation Modal Trigger */}
            <button
              data-testid="tee-cert-btn"
              onClick={() => setCertModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Inspect AMD SEV-SNP Remote Attestation"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden md:inline">TEE Attestation</span>
            </button>

            {/* Connect Wallet Button */}
            <ConnectWalletButton />
          </div>
        </nav>
      </header>

      {/* TEE Remote Attestation Modal */}
      <EnclaveCertModal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} />

      {/* Verified Smart Contracts Modal */}
      <VerifiedContractsModal isOpen={contractsModalOpen} onClose={() => setContractsModalOpen(false)} />
    </>
  );
}
