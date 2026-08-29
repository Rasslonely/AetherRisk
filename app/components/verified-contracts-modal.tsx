'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  X,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  Code2,
} from 'lucide-react';

interface VerifiedContractsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VerifiedContractsModal({ isOpen, onClose }: VerifiedContractsModalProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const contracts = [
    {
      name: 'CreditRegistry.sol',
      description: 'TEE-Lite Trust Boundary & EIP-712 Hardware Enclave Signer Registry',
      network: 'Creditcoin CC3 Testnet',
      chainId: 102031,
      address: '0x592380E737758285C809F92e8De176C7ECBC1015',
      explorerUrl: 'https://creditcoin-testnet.blockscout.com/address/0x592380E737758285C809F92e8De176C7ECBC1015',
      compiler: 'Solc 0.8.24 (via-ir, 200 runs)',
      evm: 'Substrate EVM (Shanghai)',
      badge: 'TEE Boundary',
      color: 'emerald',
    },
    {
      name: 'AetherRiskASC.sol',
      description: 'Attestcoin Smart Contract calling Substrate Native Precompile 0xFD2 (NativeQueryVerifier)',
      network: 'Creditcoin CC3 Testnet',
      chainId: 102031,
      address: '0xcEA97078e28946Df30436f163E74c3b175D98197',
      explorerUrl: 'https://creditcoin-testnet.blockscout.com/address/0xcEA97078e28946Df30436f163E74c3b175D98197',
      compiler: 'Solc 0.8.24 (via-ir, 200 runs)',
      evm: 'Substrate EVM (Shanghai)',
      badge: 'Precompile 0xFD2',
      color: 'cyan',
    },
    {
      name: 'AetherVault4626.sol',
      description: 'ERC-4626 Institutional Multi-Tranche Dynamic Rate Lending Vault',
      network: 'Creditcoin CC3 Testnet',
      chainId: 102031,
      address: '0xD9B3F2C699fCfC219d35F7709245312a621eFd39',
      explorerUrl: 'https://creditcoin-testnet.blockscout.com/address/0xD9B3F2C699fCfC219d35F7709245312a621eFd39',
      compiler: 'Solc 0.8.24 (via-ir, 200 runs)',
      evm: 'Substrate EVM (Shanghai)',
      badge: 'ERC-4626 Vault',
      color: 'purple',
    },
    {
      name: 'MockInstitutionalUSDC.sol',
      description: 'Underlying Institutional Asset Token (iUSDC, 18 decimals)',
      network: 'Creditcoin CC3 Testnet',
      chainId: 102031,
      address: '0xb906ae7ec832814922FCEEd270e0A7A1A2657397',
      explorerUrl: 'https://creditcoin-testnet.blockscout.com/address/0xb906ae7ec832814922FCEEd270e0A7A1A2657397',
      compiler: 'Solc 0.8.24 (via-ir, 200 runs)',
      evm: 'Substrate EVM (Shanghai)',
      badge: 'Asset Token',
      color: 'blue',
    },
    {
      name: 'SepoliaLendingEmitter.sol',
      description: 'L1 Source Chain Event Emitter (LoanRepaid, CollateralAdded, DebtSettled)',
      network: 'Ethereum Sepolia Testnet',
      chainId: 11155111,
      address: '0x592380E737758285C809F92e8De176C7ECBC1015',
      explorerUrl: 'https://sepolia.etherscan.io/address/0x592380E737758285C809F92e8De176C7ECBC1015',
      compiler: 'Solc 0.8.24 (via-ir, 200 runs)',
      evm: 'Cancun EVM',
      badge: 'L1 Source Emitter',
      color: 'amber',
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
        {/* Clickable Backdrop overlay */}
        <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

        <motion.div
          data-testid="verified-contracts-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl my-auto max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/98 p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-6 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  Verified On-Chain Contracts
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Live Testnet
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Cryptographically verified smart contracts deployed on Creditcoin CC3 & Ethereum Sepolia.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Contracts Grid */}
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div
                key={contract.name + contract.network}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold font-mono text-cyan-300">
                      {contract.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {contract.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      {contract.network} ({contract.chainId})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {contract.description}
                </p>

                {/* Address & Actions */}
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-200 truncate">
                    <Code2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{contract.address}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(contract.address)}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Copy Address"
                    >
                      {copiedAddress === contract.address ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <a
                      href={contract.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                    >
                      <span>Explorer</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-1">
                  <span>Compiler: {contract.compiler}</span>
                  <span>EVM Target: {contract.evm}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-4">
            <span>Foundry Tested (17/17 PASS) · Hard-Tech Cryptographic Core</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
