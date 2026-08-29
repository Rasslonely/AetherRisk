'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const metadata = getEnclaveMetadata();

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
      address: '0x592380E737758285C809F92e8De176C7ECBC1015',
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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div
        data-testid="enclave-cert-modal"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto"
      >
        {/* Clickable Backdrop */}
        <div className="fixed inset-0 cursor-pointer" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl my-auto max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/98 p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-6 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  AMD SEV-SNP Remote Attestation
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Active TEE
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Hardware-attested cryptographic quote verified via Phala Network dStack.
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

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
                Platform Architecture
              </span>
              <span className="text-cyan-300 font-semibold">{metadata.platform}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
                Hardware Enclave
              </span>
              <span className="text-emerald-400 font-semibold">{metadata.hardwareEnclave}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
                Authorized Enclave Signer (EIP-712)
              </span>
              <span className="text-slate-200 truncate block">{metadata.signerAddress}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider font-semibold">
                TCB Status & SVN
              </span>
              <span className="text-emerald-400 font-semibold">
                {metadata.tcbStatus} (SVN {metadata.securityVersion})
              </span>
            </div>
          </div>

          {/* Measurement Hash */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
            <span className="text-slate-500 block text-[10px] font-mono uppercase tracking-wider font-semibold">
              Enclave Measurement Hash (Launch Digest)
            </span>
            <div className="text-[11px] font-mono text-cyan-300 break-all bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              {metadata.measurementHash}
            </div>
          </div>

          {/* JSON Certificate Dump */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-cyan-400" />
                Raw Attestation Report
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied JSON</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-40 scrollbar-thin">
              {JSON.stringify(certificateJson, null, 2)}
            </pre>
          </div>

          {/* Footer Note */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 pt-4">
            <a
              href="https://phala.com/dstack"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors font-mono"
            >
              <span>Phala Network dStack Specs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
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
