# Phase 14 Research: Visual 4-Phase Attestation Stepper Canvas

## Objective
Implement `app/components/visual-pipeline-canvas.tsx`, the real-time animated 4-phase cross-chain attestation visualizer. This component renders the synchronous verification pipeline from Ethereum Sepolia event mining to Creditcoin Substrate Precompile `0xFD2` verification.

## Component Architecture & Visual State

### 1. The 4 Pipeline Phases
1. **Phase 1: Source Tx Mined on Sepolia L1** (`0.0s – 0.5s`)
   - Visual: Ethereum icon, block height badge, source tx hash (`0x8b3f...`), amount proven.
   - Status: `IDLE` $\to$ `ACTIVE` $\to$ `COMPLETE`.
2. **Phase 2: Cross-Chain Inclusion Attestation** (`0.5s – 8.0s`)
   - Visual: Attestcoin network pulse, header tracking, continuity endpoint digest derivation.
   - Status: Animated progress bar (0% $\to$ 100%) with elapsed seconds counter.
3. **Phase 3: Merkle & Continuity Proof Formulation** (`8.0s – 10.0s`)
   - Visual: Merkle root generation (`0x4a9d...`), sibling path visualization, cryptographic hashing.
4. **Phase 4: Synchronous Precompile Verification (0xFD2)** (`10.0s – 12.4s`)
   - Visual: Substrate EVM precompile execution, `receipt.status == 0x1` validation.
   - Badge: `data-testid="precompile-verified-badge"`: "✅ Verified by Native Precompile 0xFD2 in 12.4s".

### 2. Motion & Interaction Design (Framer Motion)
- **High-contrast dark-mode cyber-institutional styling**: Glassmorphism (`backdrop-blur-md`, `border-white/10`), ambient neon glow accents (Cyan `hsl(190,95%,45%)`, Emerald `hsl(150,85%,45%)`, Amber `hsl(40,95%,50%)`).
- **Interactive Controls**:
  - `currentPhase`: 0 (Idle) to 4 (Complete).
  - `elapsedMs`: Timer counting milliseconds.
  - `isSimulating`: Boolean trigger.
  - `onComplete`: Callback when Phase 4 finishes to trigger the AFTER state morph.
  - `data-testid="visual-pipeline-canvas"` for automated Playwright testing.

## Verification Gate
- `rtk pnpm build` compiles cleanly with zero TypeScript errors.
- Component renders in isolation without runtime errors.
