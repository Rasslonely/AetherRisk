import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AetherRisk — Synchronous Cross-Chain Credit Risk Engine',
  description:
    'Creditcoin CC3 EVM Frontier native Attestcoin Smart Contract orchestrator and TEE confidential risk underwriting engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
