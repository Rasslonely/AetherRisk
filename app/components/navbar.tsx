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
      <header className="sticky top-3 z-40 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav
          ref={navRef}
          className="w-full flex items-center justify-between px-3.5 sm:px-5 py-2 rounded-2xl md:rounded-full border border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all relative"
        >
          {/* 1. Logo & Network Status Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all overflow-hidden p-1 shrink-0">
                <Image
                  src="/atherisk_logo_icon.png"
                  alt="AetherRisk Logo"
                  width={32}
                  height={32}
                  priority
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-100 group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                  Aether<span className="text-cyan-400">Risk</span>
                </span>
                <span className="text-[8px] font-mono text-slate-400 tracking-wider hidden lg:inline">
                  RISK ENGINE
                </span>
              </div>
            </Link>

            <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CC3 Testnet
            </span>
          </div>

          {/* 2. Navigation Pills (Overview + Risk Sandbox + Protocol dApp) */}
          <div
            data-testid="mode-switcher"
            className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-full border border-slate-800/80 shadow-inner shrink-0"
          >
            {/* Anchor 1: Overview */}
            <Link
              href="/"
              onClick={() => setActiveDropdown(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                pathname === '/'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Overview
            </Link>

            {/* Anchor 2: Risk Sandbox (30s Simulation) */}
            <Link
              href="/sandbox"
              onClick={() => setActiveDropdown(null)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSandboxActive
                  ? 'bg-purple-500/20 text-purple-300 font-semibold shadow-[0_0_12px_rgba(168,85,247,0.3)] border border-purple-500/40'
                  : 'text-slate-300 hover:text-purple-300 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="h-3.5 w-3.5 text-purple-400" />
              <span>Sandbox</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-400 border border-purple-500/30">
                30s
              </span>
            </Link>

            {/* Anchor 3: Live Web3 dApp Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('web3')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('web3')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isWeb3Active
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)] border border-emerald-500/30'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span>Live Web3 dApp</span>
                <ChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
                    activeDropdown === 'web3' ? 'rotate-180 text-emerald-400' : ''
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
                    className="absolute top-full right-0 mt-2 w-80 rounded-2xl border border-slate-800/90 bg-slate-950/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2.5 z-50 space-y-1"
                  >
                    <div className="px-2.5 py-1.5 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Zap className="h-3 w-3" />
                        Creditcoin CC3 Protocol
                      </span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Live Contracts
                      </span>
                    </div>

                    {/* Item 1: Lending Pool */}
                    <Link
                      href="/vault"
                      onClick={() => setActiveDropdown(null)}
                      className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                        pathname === '/vault'
                          ? 'bg-emerald-950/30 border-emerald-500/30'
                          : 'hover:bg-slate-900/80 border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shrink-0 group-hover:scale-105 transition-transform">
                        <Landmark className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                          Lending Pool
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          Deposit iUSDC to earn yield, or borrow capital with risk-adjusted rates.
                        </p>
                      </div>
                    </Link>

                    {/* Item 2: Credit Passport */}
                    <Link
                      href="/passport"
                      onClick={() => setActiveDropdown(null)}
                      className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                        pathname === '/passport'
                          ? 'bg-cyan-950/30 border-cyan-500/30'
                          : 'hover:bg-slate-900/80 border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 shrink-0 group-hover:scale-105 transition-transform">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                          Credit Passport
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          On-chain credit score, verified TEE attestations, and underwriting history.
                        </p>
                      </div>
                    </Link>

                    {/* Item 3: Activity Explorer */}
                    <Link
                      href="/operations"
                      onClick={() => setActiveDropdown(null)}
                      className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                        pathname === '/operations'
                          ? 'bg-cyan-950/30 border-cyan-500/30'
                          : 'hover:bg-slate-900/80 border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-cyan-400 border border-cyan-500/30 shrink-0 group-hover:scale-105 transition-transform">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                          Activity & Proofs
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                          Live operations stream verifying cross-chain settlements via Precompile 0xFD2.
                        </p>
                      </div>
                    </Link>

                    {/* Quick Modals Row inside dropdown */}
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

          {/* 3. Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Utility Capsule (Contracts, TEE Proof, Terms) - only on xl: to preserve spacing */}
            <div className="hidden xl:flex items-center bg-slate-900/90 p-0.5 rounded-full border border-slate-800 shadow-inner gap-0.5">
              <button
                data-testid="verified-contracts-btn"
                onClick={() => setContractsModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-all"
                title="Inspect Verified Smart Contracts on Creditcoin CC3"
              >
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[11px]">Contracts</span>
              </button>

              <button
                data-testid="tee-cert-btn"
                onClick={() => setCertModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 transition-all"
                title="Inspect AMD SEV-SNP Remote Attestation"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px]">TEE Proof</span>
              </button>

              <button
                data-testid="terms-modal-btn"
                onClick={() => setTermsModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-all"
                title="Protocol Terms of Use & Disclaimers"
              >
                <Scale className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[11px]">Terms</span>
              </button>
            </div>

            {/* Faucet Modal Trigger */}
            <button
              data-testid="faucet-modal-btn"
              onClick={() => setFaucetModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              title="Claim 10,000 iUSDC Testnet Capital on Creditcoin CC3"
            >
              <Coins className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Claim 10k iUSDC</span>
              <span className="hidden sm:inline xl:hidden text-[11px]">10k Faucet</span>
              <span className="sm:hidden text-[11px]">10k</span>
            </button>

            {/* Connect Wallet Button */}
            <div className="shrink-0">
              <ConnectWalletButton />
            </div>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors shrink-0"
              aria-label="Open Mobile Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>

        {/* Animated Off-Canvas Mobile Drawer Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md md:hidden"
              />

              {/* Sidebar Sheet (Slide-in from Right) */}
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-slate-950 border-l border-slate-800/80 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto md:hidden font-sans"
              >
                <div className="space-y-6">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-cyan-500/30 p-1">
                        <Image
                          src="/atherisk_logo_icon.png"
                          alt="AetherRisk"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-100">
                          Aether<span className="text-cyan-400">Risk</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          CC3 Testnet
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label="Close Mobile Menu"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Primary Navigation Links */}
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Navigation
                    </div>

                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        pathname === '/'
                          ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <Image
                        src="/atherisk_logo_icon.png"
                        alt="Overview"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      <span>Overview</span>
                    </Link>

                    <Link
                      href="/sandbox"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isSandboxActive
                          ? 'bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Terminal className="h-4 w-4 text-purple-400" />
                        <span>Fast-Track Sandbox</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/30">
                        30s
                      </span>
                    </Link>

                    <div className="pt-2 px-2 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Live Web3 Protocol
                    </div>

                    <Link
                      href="/vault"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        pathname === '/vault'
                          ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <Landmark className="h-4 w-4 text-emerald-400" />
                      <span>Lending Pool</span>
                    </Link>

                    <Link
                      href="/passport"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        pathname === '/passport'
                          ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4 text-cyan-400" />
                      <span>Credit Passport</span>
                    </Link>

                    <Link
                      href="/operations"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        pathname === '/operations'
                          ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <Activity className="h-4 w-4 text-cyan-400" />
                      <span>Activity & Proofs</span>
                    </Link>
                  </div>

                  {/* Quick Protocol Tools */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/80">
                    <div className="px-2 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      Protocol Utilities
                    </div>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setFaucetModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-cyan-300 hover:bg-cyan-950/30 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <Coins className="h-4 w-4 text-cyan-400" />
                        Claim 10,000 iUSDC
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">Faucet →</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setContractsModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <Layers className="h-4 w-4 text-cyan-400" />
                        Smart Contracts
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">5 Contracts</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCertModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        Hardware TEE Proof
                      </span>
                      <span className="text-[10px] font-mono text-emerald-500">AMD SEV</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setTermsModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <Scale className="h-4 w-4 text-slate-400" />
                        Terms & Disclaimers
                      </span>
                    </button>
                  </div>
                </div>

                {/* Drawer Footer with Network Info */}
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Network: Creditcoin CC3</span>
                    <span className="text-emerald-400">Chain 102031</span>
                  </div>
                  <div>Settlement: Precompile 0xFD2</div>
                </div>
              </motion.aside>
            </>
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
