'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Zap,
  Activity,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  Scale,
  Coins,
  ChevronDown,
  Sparkles,
  Landmark,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { EnclaveCertModal } from './enclave-cert-modal';
import { VerifiedContractsModal } from './verified-contracts-modal';
import { FaucetModal } from './faucet-modal';
import { TermsModal } from './terms-modal';
import { ConnectWalletButton } from './connect-wallet-button';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [contractsModalOpen, setContractsModalOpen] = useState(false);
  const [faucetModalOpen, setFaucetModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown states for the two primary pillars
  const [activeDropdown, setActiveDropdown] = useState<'sandbox' | 'web3' | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (menu: 'sandbox' | 'web3') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleMouseEnter = (menu: 'sandbox' | 'web3') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOpenContracts = () => setContractsModalOpen(true);
    const handleOpenTEE = () => setCertModalOpen(true);
    const handleOpenFaucet = () => setFaucetModalOpen(true);
    const handleOpenTerms = () => setTermsModalOpen(true);

    window.addEventListener('open-verified-contracts', handleOpenContracts);
    window.addEventListener('open-tee-attestation', handleOpenTEE);
    window.addEventListener('open-faucet', handleOpenFaucet);
    window.addEventListener('open-terms', handleOpenTerms);

    return () => {
      window.removeEventListener('open-verified-contracts', handleOpenContracts);
      window.removeEventListener('open-tee-attestation', handleOpenTEE);
      window.removeEventListener('open-faucet', handleOpenFaucet);
      window.removeEventListener('open-terms', handleOpenTerms);
    };
  }, []);

  // Close dropdown on navigation change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isSandboxActive = pathname === '/sandbox';
  const isWeb3Active =
    pathname === '/vault' || pathname === '/passport' || pathname === '/operations';

  return (
    <>
      <header className="sticky top-3 z-40 w-full px-3 sm:px-6 lg:px-8 mb-6">
        <nav
          ref={navRef}
          className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl md:rounded-full border border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all relative"
        >
          {/* 1. Logo & Network Status Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all overflow-hidden p-1">
                <Image
                  src="/atherisk_logo_icon.png"
                  alt="AtherRisk Logo"
                  width={32}
                  height={32}
                  priority
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors">
                  Aether<span className="text-cyan-400">Risk</span>
                </span>
                <span className="text-[8px] font-mono text-slate-400 tracking-wider hidden sm:inline">
                  RISK ENGINE
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CC3 Testnet
            </span>
          </div>

          {/* 2. Modern 3-Anchor Separated Navigation (Overview + Fast-Track Sandbox + Live Web3 dApp) */}
          <div
            data-testid="mode-switcher"
            className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-full border border-slate-800/80 shadow-inner"
          >
            {/* Anchor 1: Overview */}
            <Link
              href="/"
              onClick={() => setActiveDropdown(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${pathname === '/'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
            >
              Overview
            </Link>

            {/* Anchor 2: Fast-Track Sandbox (Direct 1-Click Launch with 30s Badge) */}
            <Link
              href="/sandbox"
              onClick={() => setActiveDropdown(null)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${isSandboxActive
                  ? 'bg-purple-500/20 text-purple-300 font-semibold shadow-[0_0_12px_rgba(168,85,247,0.3)] border border-purple-500/40'
                  : 'text-slate-300 hover:text-purple-300 hover:bg-slate-800/60'
                }`}
            >
              <Terminal className="h-3.5 w-3.5 text-purple-400" />
              <span>Fast-Track Sandbox</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-400 border border-purple-500/30">
                30s
              </span>
            </Link>

            {/* Anchor 3: Live Web3 dApp (with Flyout Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('web3')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => {
                  toggleDropdown('web3');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${isWeb3Active
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)] border border-emerald-500/30'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
              >
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span>Live Web3 dApp</span>
                <ChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'web3' ? 'rotate-180 text-emerald-400' : ''
                    }`}
                />
              </button>

              {/* Web3 Dropdown Flyout */}
              <AnimatePresence>
                {activeDropdown === 'web3' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-88 rounded-2xl border border-slate-800/90 bg-slate-950/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2.5 z-50 space-y-1"
                  >
                    <div className="px-2.5 py-1.5 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Zap className="h-3 w-3" />
                        Creditcoin CC3 Protocol
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        100% On-Chain
                      </span>
                    </div>

                    {/* Item 1: Institutional Lending Desk */}
                    <Link
                      href="/vault"
                      onClick={() => setActiveDropdown(null)}
                      className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all ${pathname === '/vault'
                          ? 'bg-emerald-950/30 border-emerald-500/30'
                          : 'hover:bg-slate-900/80 border-transparent hover:border-slate-800'
                        }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shrink-0 group-hover:scale-105 transition-transform">
                        <Landmark className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                          Institutional Lending Desk
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          ERC-4626 vault with $50k seed liquidity, uncollateralized borrow & dynamic APY.
                        </p>
                      </div>
                    </Link>

                    {/* Item 2: On-Chain Credit Passport */}
                    <Link
                      href="/passport"
                      onClick={() => setActiveDropdown(null)}
                      className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all ${pathname === '/passport'
                          ? 'bg-cyan-950/30 border-cyan-500/30'
                          : 'hover:bg-slate-900/80 border-transparent hover:border-slate-800'
                        }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 group-hover:scale-105 transition-transform">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                          On-Chain Credit Passport
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          CreditRegistry.sol profiles, AMD SEV-SNP TEE attestations & Gemini AI memos.
                        </p>
                      </div>
                    </Link>

                    {/* Item 3: Universal Proof Explorer */}
                    <Link
                      href="/operations"
                      onClick={() => setActiveDropdown(null)}
                      className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all ${pathname === '/operations'
                          ? 'bg-cyan-950/30 border-cyan-500/30'
                          : 'hover:bg-slate-900/80 border-transparent hover:border-slate-800'
                        }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-cyan-400 border border-cyan-500/30 shrink-0 group-hover:scale-105 transition-transform">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                          Universal Proof Explorer
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          Universal protocol ledger auditing 18 synchronous Substrate 0xFD2 precompile proofs.
                        </p>
                      </div>
                    </Link>

                    {/* Quick Modals Row */}
                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          setFaucetModalOpen(true);
                        }}
                        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors text-center"
                      >
                        <Coins className="h-3.5 w-3.5 text-cyan-400 mb-1" />
                        <span className="text-[10px] font-medium leading-tight">10k Faucet</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          setContractsModalOpen(true);
                        }}
                        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors text-center"
                      >
                        <Layers className="h-3.5 w-3.5 text-cyan-400 mb-1" />
                        <span className="text-[10px] font-medium leading-tight">Contracts</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          setCertModalOpen(true);
                        }}
                        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors text-center"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 mb-1" />
                        <span className="text-[10px] font-medium leading-tight">TEE Proof</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 3. Right Action Group: Utility Modals, Faucet, Connect Wallet */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Compact Institutional Utility Capsule (Contracts, TEE Proof, Terms) */}
            <div className="hidden lg:flex items-center bg-slate-900/90 p-0.5 rounded-full border border-slate-800 shadow-inner gap-0.5">
              <button
                data-testid="verified-contracts-btn"
                onClick={() => setContractsModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-all"
                title="Inspect Verified Smart Contracts on Creditcoin CC3"
              >
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[11px] hidden 2xl:inline">Contracts</span>
              </button>

              <button
                data-testid="tee-cert-btn"
                onClick={() => setCertModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 transition-all"
                title="Inspect AMD SEV-SNP Remote Attestation"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] hidden 2xl:inline">TEE Proof</span>
              </button>

              <button
                data-testid="terms-modal-btn"
                onClick={() => setTermsModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-all"
                title="Institutional Terms of Use & Disclaimers"
              >
                <Scale className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[11px] hidden 2xl:inline">Terms</span>
              </button>
            </div>

            {/* Institutional Faucet Modal Trigger */}
            <button
              data-testid="faucet-modal-btn"
              onClick={() => setFaucetModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              title="Claim 10,000 iUSDC Testnet Capital on Creditcoin CC3"
            >
              <Coins className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Claim 10k iUSDC</span>
              <span className="sm:hidden">10k Faucet</span>
            </button>

            {/* Connect Wallet Button */}
            <div className="shrink-0">
              <ConnectWalletButton />
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-1.5 font-sans"
            >
              <Link
                href="/"
                className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
              >
                <Image
                  src="/atherisk_logo_icon.png"
                  alt="AtherRisk"
                  width={16}
                  height={16}
                  className="object-contain"
                />
                <span>Overview</span>
              </Link>
              <div className="px-2 pt-2 text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                Fast-Track Simulation
              </div>
              <Link
                href="/sandbox"
                className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
              >
                <Terminal className="h-4 w-4 text-purple-400" /> 30s Judge Simulator
              </Link>
              <div className="px-2 pt-2 text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                Live On-Chain Protocol
              </div>
              <Link
                href="/vault"
                className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
              >
                <Landmark className="h-4 w-4 text-emerald-400" /> Institutional Lending Desk
              </Link>
              <Link
                href="/passport"
                className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
              >
                <ShieldCheck className="h-4 w-4 text-cyan-400" /> On-Chain Credit Passport
              </Link>
              <Link
                href="/operations"
                className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900"
              >
                <Activity className="h-4 w-4 text-cyan-400" /> Universal Proof Explorer
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 1-Click Institutional Faucet Modal */}
      <FaucetModal isOpen={faucetModalOpen} onClose={() => setFaucetModalOpen(false)} />

      {/* Institutional Terms of Use Modal */}
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />

      {/* TEE Remote Attestation Modal */}
      <EnclaveCertModal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} />

      {/* Verified Smart Contracts Modal */}
      <VerifiedContractsModal
        isOpen={contractsModalOpen}
        onClose={() => setContractsModalOpen(false)}
      />
    </>
  );
}
