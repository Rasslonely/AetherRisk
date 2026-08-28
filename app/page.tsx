export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-6">
        <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
        Creditcoin CC3 EVM Frontier × Phala dstack AMD SEV-SNP
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white mb-4">
        AetherRisk Protocol
      </h1>
      <p className="max-w-2xl text-slate-400 text-lg">
        Synchronous cross-chain transaction verification via Creditcoin Substrate native BlockProver Precompile (0xFD2) and confidential Bayesian risk modeling.
      </p>
    </main>
  );
}
