import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from './components/navbar';
import { Shield, ExternalLink, Cpu, Layers, Lock, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AetherRisk | Autonomous TEE-Guarded Cross-Chain Credit & Liquidation Underwriter',
  description:
    'Eliminating cross-chain oracle sync latency and false liquidations by verifying source-chain transactions synchronously in Creditcoin precompile bytecode within 15 seconds.',
  keywords: [
    'Creditcoin CC3',
    'Substrate Precompiles',
    '0xFD2 BlockProver',
    'Phala TEE',
    'AMD SEV-SNP',
    'Attestcoin',
    'Cross-Chain Credit Underwriting',
    'ERC-4626',
    'DeFi Risk Engine',
  ],
  authors: [{ name: 'AetherRisk Team' }],
  openGraph: {
    title: 'AetherRisk | Autonomous TEE-Guarded Cross-Chain Credit & Liquidation Underwriter',
    description:
      'Synchronous bytecode verification of Ethereum L1 facts on Creditcoin CC3 within 15s without oracle sync latency.',
    url: 'https://aetherrisk.xyz',
    siteName: 'AetherRisk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AetherRisk — Synchronous Cross-Chain Credit Risk Engine',
    description:
      'Creditcoin CC3 EVM Frontier native Attestcoin Smart Contract orchestrator and TEE confidential risk underwriting engine.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#020617] text-slate-100 antialiased min-h-screen flex flex-col relative selection:bg-cyan-500/20 selection:text-cyan-300">
        {/* Global Ambient Lighting Mesh */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl opacity-70 animate-ambient-breath" />
          <div className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute top-2/3 -right-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        {/* Floating Top Navigation */}
        <Navbar />

        {/* Main Body Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          {children}
        </main>

        {/* Institutional Footer */}
        <footer className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/90 py-10 mt-24 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 text-slate-950">
                <Shield className="h-4 w-4 fill-slate-950" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-200">
                  Aether<span className="text-cyan-400">Risk</span>
                </span>
                <p className="text-[11px] text-slate-500 font-mono">
                  Autonomous Cross-Chain Credit Risk Engine · Creditcoin CC3
                </p>
              </div>
            </div>

            {/* Protocol Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1">
                <Zap className="h-3 w-3 text-cyan-400" /> Creditcoin CC3 (0xFD2)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1">
                <Layers className="h-3 w-3 text-emerald-400" /> Attestcoin Protocol
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1">
                <Cpu className="h-3 w-3 text-purple-400" /> Phala AMD SEV-SNP
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1">
                <Lock className="h-3 w-3 text-blue-400" /> ERC-4626 Vault
              </span>
            </div>

            <p className="text-xs text-slate-500 font-mono text-center md:text-right">
              Substrate EVM 0xFD2 · Phala AMD SEV-SNP TEE
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
