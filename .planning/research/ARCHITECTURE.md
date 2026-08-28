# Architecture Synthesis: AetherRisk

## Dual-Engine System Architecture

```mermaid
flowchart TD
    subgraph Engine1["Engine 1: Hard-Tech Primitives (CC3 Frontier EVM)"]
        ASC[AetherRiskASC.sol] -->|staticcall| BP["BlockProver Precompile (0xFD2)"]
        BP -->|Verify Proof| ASC
        ASC -->|Decode Logs| DEC["EvmV1Decoder (0x731c...F9f)"]
        DEC -->|Extract status == 0x1| ASC
        ASC -->|Forward verified fact| REG[CreditRegistry.sol]
        REG -->|Update dynamic APY/Collateral| V4626[AetherVault4626.sol]
    end

    subgraph TEE["Confidential Computing (Phala dstack)"]
        Kernel[Deterministic Bayesian Risk Model] -->|EIP-712 Signature| REG
    end

    subgraph Engine2["Engine 2: 30-Sec Judge Sandbox (Next.js 15 Monolith)"]
        UI[Interactive Sandbox UI] -->|Time-Travel Trigger| Res[Triple-Layer Proof Resolver]
        Res -->|1. Live (5s)| PB[ProofBuilder API]
        Res -->|2. Cached| DB[(18 Pre-Seeded Real Proofs)]
        Res -->|3. Mock| Sim[Structural Mock]
    end
```

### Core Invariants
1. **Synchronous Substrate Precompiles**: Precompile `0xFD2` synchronous verification replaces slow multisigs.
2. **Replay Protection**: `mapping(bytes32 => bool) processedQueryHashes` prevents double-crediting.
3. **Status Check**: Strict check on `receipt.status == 0x1` prevents reverted L1 tx exploitation.
4. **TEE-Lite Progressive Trust**: Registered `authorizedEnclaveSigners` mapping checked via `ecrecover`.
