# Technology Stack: AetherRisk

## Pinned Dependencies & Runtime Matrix

| Layer | Technology | Pinned Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Monolith Framework** | Next.js App Router | `15.1.0` | React 19 Server Actions, Edge API routes, 1-push Vercel deployment |
| **Runtime & Language** | Node.js / TypeScript | `Node 20.x` / `^5.6.3` | Strict end-to-end type safety |
| **Styling & Animation** | Tailwind CSS / Framer Motion | `^4.0.0` / `^11.11.17` | State transition morphing, high contrast palette, micro-animations |
| **Database & ORM** | Prisma / Supabase Pg | `^6.0.0` | Serverless connection pooling for cached proofs and telemetry feed |
| **Blockchain Client** | Viem / Ethers.js | `^2.21.53` / `^6.13.4` | Ephemeral client-side signing (Viem) + `@gluwa/usc-sdk` integration (Ethers v6) |
| **Cross-Chain Protocol** | `@gluwa/usc-sdk` | `^1.0.0` | Creditcoin Attestcoin ProofBuilder & Precompile interfaces |
| **Smart Contracts** | Solidity (Foundry) | `0.8.24` | Creditcoin CC3 EVM Frontier (`102031`) & Ethereum Sepolia (`11155111`) |
| **Confidential Compute** | Phala dstack SDK | `v0.2.0` | AMD SEV-SNP TEE hardware enclave signing via EIP-712 |
| **E2E Testing** | Playwright | `^1.49.0` | Headless browser testing verifying Zero-Empty-State Law |
