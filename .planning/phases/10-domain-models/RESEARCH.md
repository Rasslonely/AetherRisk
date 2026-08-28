# Phase 10 Research: TypeScript Domain Models & 18 Pre-Seeded Records

## Objective
Implement TypeScript domain contracts (`lib/types.ts`) and pre-seeded telemetry constants (`lib/telemetry-seed.ts`) containing 3 comprehensive borrower personas and 18 realistic verified historical cross-chain credit operations to enforce the **Zero-Empty-State Law**.

## Core Domain Contracts & Types (`lib/types.ts`)
- `ChainKey`: Supported source chains (`1` = Sepolia/Mainnet CC3, `3` = Ethereum Mainnet on CC3 Testnet).
- `OperationType`: `LOAN_REPAID`, `COLLATERAL_ADDED`, `DEBT_SETTLED`, `INVOICE_PAID`, `REBALANCE_TRIGGER`, `COLLATERAL_WITHDRAWN`.
- `OperationStatus`: `PENDING_ATTESTATION`, `VERIFIED_PRECOMPILE`, `RISK_MUTATED`, `COMPLETED`, `FAILED`.
- `ProofSource`: `LIVE_ATTESTCOIN`, `CACHED_REAL_PROOF`, `SANDBOX_SIMULATION`.
- `MerkleProofEntry`: `{ direction: number; sibling: \`0x\${string}\` }`.
- `AttestcoinProofPayload`, `ResolvedProof`, `Eip712RiskPayload`, `EnclaveSignature`, `OperationRecord`, `SimulationPersona`.

## Pre-Seeded Records Specifications (`lib/telemetry-seed.ts`)
- **3 Simulation Personas**:
  1. `persona-apex`: *Apex Commodities Corp* (Singapore, $620 \to 810$, $9.2\% \to 4.1\%$, \$250K repayment).
  2. `persona-solargrid`: *SolarGrid Africa Ltd* (Nairobi, $610 \to 675$, $10.5\% \to 7.2\%$, 45 stETH collateral).
  3. `persona-alphafund`: *Alpha Quant Arbitrage* (London, $810 \to 828$, $4.1\% \to 3.5\%$, \$1.2M debt settlement).
- **18 Pre-Seeded Operations**:
  - Valid transaction hashes, Subscan/Etherscan links, block heights (`6192000` to `6192840`), prover latency (`10.5s` to `15.0s`), and realistic score deltas ($+10$ to $+90$).

## Verification Gate
- `lib/types.ts` and `lib/telemetry-seed.ts` compile with zero TypeScript errors.
- `pnpm build` compiles cleanly.
