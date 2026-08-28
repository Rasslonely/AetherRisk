# Phase 08 Research: Next.js 15 Monolith Full-Stack Scaffold

## Objective
Establish the full-stack Next.js 15 App Router monolith scaffold with TypeScript, Tailwind CSS v4, Lucide icons, Framer Motion, Viem, Ethers v6, Prisma ORM, and environment configuration matching `DEVOPS_BOM.md` and `ENV_REGISTRY.md`.

## Key Technical Decisions & Dependencies

### 1. `package.json` Configuration
- Next.js: `15.1.0` (App Router)
- React: `^19.0.0`
- Styling: Tailwind CSS v4 + PostCSS
- Web3: `viem ^2.21.53`, `ethers ^6.13.4`
- UI & Animation: `framer-motion ^11.11.17`, `lucide-react ^0.460.0`, `@radix-ui/react-dialog`, `@radix-ui/react-tabs`, `clsx`, `tailwind-merge`
- Database: `prisma ^6.0.0`, `@prisma/client ^6.0.0`

### 2. Next.js 15 Configuration (`next.config.ts`)
- `serverExternalPackages: ['@prisma/client', 'prisma']`
- Webpack fallbacks for Node.js modules in browser bundles (`fs: false`, `net: false`, `tls: false`).

### 3. TypeScript Configuration (`tsconfig.json`)
- Target: `ES2022`
- Module Resolution: `Bundler`
- Path mapping: `"@/*": ["./*"]` for top-level monolith imports.

### 4. Environment Variables (`.env.local` & `.env.example`)
- Complete configuration matrix matching `0_resource/ENV_REGISTRY.md` §5 with CC3 Precompiles (`0xFD2`, `0xFD3`, `0x731c...F9f`), Sepolia RPC, and TEE Signer address.

## Verification Gate
- `pnpm install` succeeds without dependency conflicts.
- `pnpm next build` (or `npx next build`) compiles the monolith scaffold cleanly.
