# Phase 16 Research: Bayesian Radar Chart & Enclave Certificate Modal

## Objective
Implement two premier institutional components:
1. `app/components/risk-metric-radar.tsx`: Interactive SVG polygon radar chart visualizing the 6 dimensions of institutional creditworthiness before vs after repayment.
2. `app/components/enclave-cert-modal.tsx`: Cryptographic TEE Remote Attestation certificate modal inspecting AMD SEV-SNP hardware quote and EIP-712 enclave signatures.

## UI/UX & Motion Doctrine Integration
- **Double-Bezel Shell Architecture**: Concentric borders, OLED background `#020617`, inset hairline highlights `shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]`.
- **SVG Radar Polygon**: 6-axis geometric radar with smooth SVG vertex morphing between Distress polygon (`fill-red-500/15`, `stroke-red-400`) and Prime polygon (`fill-emerald-500/20`, `stroke-emerald-400`).
- **Cryptographic Modal**: Full-screen backdrop blur `backdrop-blur-xl bg-black/80`, floating dialog with monospace syntax-highlighted JSON viewer, one-click copy, and verified hardware seal.

## Verification Gate
- `rtk pnpm build` compiles cleanly with zero TypeScript errors.
