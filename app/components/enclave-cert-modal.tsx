'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  X,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Lock,
  Terminal,
  FileCode2,
} from 'lucide-react';
import { getEnclaveMetadata } from '@/lib/tee-signer';

interface EnclaveCertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnclaveCertModal({ isOpen, onClose }: EnclaveCertModalProps) {
  const [copied, setCopied] = useState(false);
  const metadata = getEnclaveMetadata();

  const certificateJson = {
    schema: 'https://phala.network/schemas/dstack-attestation-v1.json',
    platform: metadata.platform,
    hardwareEnclave: metadata.hardwareEnclave,
    measurementHash: metadata.measurementHash,
    authorizedEnclaveSigner: metadata.signerAddress,
    tcbStatus: metadata.tcbStatus,
    securityVersion: metadata.securityVersion,
    verifyingContract: {
      network: 'Creditcoin CC3 Testnet',
      chainId: 102031,
      contractName: 'CreditRegistry',
      address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    },
    eip712Domain: {
      name: 'AetherRisk CreditRegistry',
      version: '1',
      chainId: 102031,
    },
    attestationQuoteUrl: metadata.attestationServer,
    timestamp: new Date().toISOString(),
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(certificateJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div data-testid="enclave-cert-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-2xl cursor-pointer"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-6 md:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden z-10"
      >
            {/* Doppelrand Inset Highlight */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                    TEE Hardware Remote Attestation
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      AMD SEV-SNP
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Phala dstack Confidential Compute & EIP-712 Trust Boundary
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Hardware Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Hardware Enclave</span>
                <span className="font-mono text-emerald-400 font-semibold mt-0.5 block">
                  {metadata.hardwareEnclave} (Phala Node)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">TCB Status</span>
                <span className="font-mono text-emerald-400 font-semibold mt-0.5 block">
                  {metadata.tcbStatus} (SVN: {metadata.securityVersion})
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Enclave Signer Address</span>
                <span className="font-mono text-slate-200 text-[11px] break-all mt-0.5 block">
                  {metadata.signerAddress}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Measurement Hash (MRENCLAVE)</span>
                <span className="font-mono text-slate-400 text-[11px] break-all mt-0.5 block">
                  {metadata.measurementHash}
                </span>
              </div>
            </div>

            {/* Monospace JSON Code Viewer */}
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-4 font-mono text-[11px] text-emerald-400 max-h-56 overflow-y-auto">
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-slate-300">
                <code>{JSON.stringify(certificateJson, null, 2)}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">
                Verified on Creditcoin CC3 (Chain ID: 102031)
              </span>

              <div className="flex items-center gap-3">
                <a
                  href="https://dstack.phala.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Phala dstack</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
  );
}
