# Phase 05 Research: AetherVault4626 Dynamic Rate Lending Vault

## Objective
Design and implement `contracts/src/AetherVault4626.sol`, an institutional ERC-4626 yield-bearing lending vault on Creditcoin CC3. The vault features dynamic risk-adjusted interest rates directly linked to on-chain credit scores supplied by `CreditRegistry.sol`.

## Architectural Primitives

### 1. ERC-4626 Vault Standard Primitives
- Standard asset: Underlying institutional liquidity token (e.g. USDC / CTC).
- Mathematical invariants:
  - `shares = (assets * (totalSupply + 10**3)) / (totalAssets() + 1)` (virtual shares to prevent inflation attack).
  - `assets = (shares * (totalAssets() + 1)) / (totalSupply + 10**3)`.
- Full preview and conversion functions (`deposit`, `mint`, `withdraw`, `redeem`, `previewDeposit`, `previewWithdraw`, etc.).

### 2. Dynamic APY Curve Driven by CreditRegistry
- Reads real-time borrower score from `CreditRegistry.getScore(borrower)`:
  - $\text{Score} \ge 800 \implies 410 \text{ bps } (4.10\% \text{ APY})$
  - $700 \le \text{Score} < 800 \implies 650 \text{ bps } (6.50\% \text{ APY})$
  - $\text{Score} < 700 \implies 920 \text{ bps } (9.20\% \text{ APY})$
- Formula for continuous per-second interest accrual:
  $$\Delta \text{Interest} = \frac{\text{Principal} \times \text{APY}_{\text{bps}} \times \Delta t}{10000 \times 365 \times 86400}$$

### 3. Institutional Underwriting Guardrails
- Enforces maximum credit capacity: `require(borrowerDebt[borrower] + borrowAmount <= maxCreditLine, "EXCEEDS_CREDIT_LINE")`.
- Enforces liquidity constraints: `require(borrowAmount <= totalIdleAssets(), "INSUFFICIENT_VAULT_LIQUIDITY")`.

## Testing Matrix (`contracts/test/AetherVault4626.t.sol`)
1. **ERC-4626 Deposit & Withdraw Round-Trip**: Validates 1:1 share minting and asset recovery.
2. **Dynamic Rate Spread Mapping**: Validates dynamic rate changes when `CreditRegistry` mutates score from 620 $\to$ 810.
3. **Credit Line Boundary Enforcement**: Verifies loan origination within limit and revert on excess.
4. **Interest Accrual**: Verifies yield expansion over elapsed time (`vm.warp`).
