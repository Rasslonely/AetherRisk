# Roadmap: AetherRisk Milestone v3.0

## Milestone v3.0: Remnara-Grade Hybrid Web3 dApp, Multi-Wallet Connect & Live Vault Operations

- [ ] **Phase 27** → `Multi-Wallet Web3 Provider & CC3 Auto-Switcher`
  - **TARGET**: Build `Web3Provider` context supporting EIP-6963 multi-wallet discovery (MetaMask, Rabby, OKX, Coinbase, Phantom), auto-switch to Creditcoin CC3 (`102031`), and balance listeners.
  - **FILES**: `app/components/web3-provider.tsx`, `app/components/connect-wallet-button.tsx`, `app/components/wallet-modal.tsx`, `lib/web3-config.ts`.

- [ ] **Phase 28** → `1-Click Institutional Faucet & Testnet Capital Minter`
  - **TARGET**: Build `FaucetModal` and contract helper for `MockInstitutionalUSDC.sol` (`0xb906ae7ec832814922FCEEd270e0A7A1A2657397`), enabling 1-click 10,000 iUSDC minting with live explorer toast notifications.
  - **FILES**: `app/components/faucet-modal.tsx`, `lib/contracts/mock-usdc.ts`.

- [ ] **Phase 29** → `Live Institutional Lending Desk & AetherVault4626 Portal`
  - **TARGET**: Create `/vault` page with live smart contract interaction with `AetherVault4626.sol` (`0xD9B3F2C699fCfC219d35F7709245312a621eFd39`): Deposit iUSDC, Borrow Capital, Repay Debt, and Withdraw Liquidity with real-time on-chain position tracking.
  - **FILES**: `app/vault/page.tsx`, `app/components/vault-operations-card.tsx`, `lib/contracts/aether-vault.ts`.

- [ ] **Phase 30** → `Live On-Chain Credit Passport & CreditRegistry Inspector`
  - **TARGET**: Build `/passport` page and Borrower Credit Profile widget reading live from `CreditRegistry.sol` (`0x592380E737758285C809F92e8De176C7ECBC1015`), showing on-chain score, tier, and TEE signer verification.
  - **FILES**: `app/passport/page.tsx`, `app/components/credit-passport-card.tsx`, `lib/contracts/credit-registry.ts`.

- [ ] **Phase 31** → `Remnara Institutional Compliance Modal & Dual-Mode Navigation`
  - **TARGET**: Implement 4-point Institutional Terms of Service modal, Dual-Mode Switcher (`[ ⚡ Live Web3 dApp ]` ⟷ `[ 🔬 Fast-Track Sandbox ]`), and run complete Playwright E2E verification across all live dApp flows.
  - **FILES**: `app/components/terms-modal.tsx`, `app/components/mode-switcher.tsx`, `app/components/navbar.tsx`, `tests/e2e/live-judge-flow.spec.ts`.
