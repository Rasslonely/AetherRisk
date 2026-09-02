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
import { FaucetModal } from './faucet-modal';
import { ConnectWalletButton } from './connect-wallet-button';
import { Coins } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [contractsModalOpen, setContractsModalOpen] = useState(false);
  const [faucetModalOpen, setFaucetModalOpen] = useState(false);

  React.useEffect(() => {
    const handleOpenContracts = () => setContractsModalOpen(true);
    const handleOpenTEE = () => setCertModalOpen(true);
    const handleOpenFaucet = () => setFaucetModalOpen(true);

    window.addEventListener('open-verified-contracts', handleOpenContracts);
    window.addEventListener('open-tee-attestation', handleOpenTEE);
    window.addEventListener('open-faucet', handleOpenFaucet);

    return () => {
      window.removeEventListener('open-verified-contracts', handleOpenContracts);
      window.removeEventListener('open-tee-attestation', handleOpenTEE);
      window.removeEventListener('open-faucet', handleOpenFaucet);
    };
  }, []);

  const navLinks = [
    { name: 'Overview', href: '/' },
    { name: 'Lending Vault', href: '/vault' },
    { name: 'Operations', href: '/operations' },
    { name: 'Risk Sandbox', href: '/sandbox' },
  ];

  return (
    <>
      <header className="sticky top-3 z-40 w-full px-3 sm:px-6 lg:px-8 mb-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl md:rounded-full border border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all">
          {/* Logo & Network Status Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
                <Shield className="h-4 w-4 fill-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors">
                  Aether<span className="text-cyan-400">Risk</span>
                </span>
                <span className="text-[8px] font-mono text-slate-400 tracking-wider hidden sm:inline">
                  INSTITUTIONAL UNDERWRITER
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CC3 Testnet
            </span>
          </div>

          {/* Nav Items */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 px-1.5 py-1 rounded-full border border-slate-800/80 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
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

          {/* Right Action Group: Faucet, Proofs, and Connect Wallet */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1-Click Faucet Trigger */}
            <button
              data-testid="faucet-modal-btn"
              onClick={() => setFaucetModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              title="Claim 10,000 iUSDC Testnet Capital on Creditcoin CC3"
            >
              <Coins className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Claim 10k iUSDC</span>
              <span className="xl:hidden">10k Faucet</span>
            </button>

            {/* Verified Contracts Modal Trigger */}
            <button
              data-testid="verified-contracts-btn"
              onClick={() => setContractsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              title="View Deployed Smart Contracts"
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Contracts</span>
            </button>

            {/* TEE Attestation Modal Trigger */}
            <button
              data-testid="tee-cert-btn"
              onClick={() => setCertModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              title="Inspect AMD SEV-SNP Remote Attestation"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden md:inline">TEE Proof</span>
            </button>

            {/* Connect Wallet Button */}
            <div className="shrink-0">
              <ConnectWalletButton />
            </div>
          </div>
        </nav>
      </header>

      {/* 1-Click Institutional Faucet Modal */}
      <FaucetModal isOpen={faucetModalOpen} onClose={() => setFaucetModalOpen(false)} />

      {/* TEE Remote Attestation Modal */}
      <EnclaveCertModal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} />

      {/* Verified Smart Contracts Modal */}
      <VerifiedContractsModal isOpen={contractsModalOpen} onClose={() => setContractsModalOpen(false)} />
    </>
  );
}
