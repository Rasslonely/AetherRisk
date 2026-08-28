# Phase 06 Research: SepoliaLendingEmitter Source Chain Contract

## Objective
Design and implement `contracts/src/SepoliaLendingEmitter.sol`, the Ethereum Sepolia source-chain smart contract for AetherRisk. It generates the primary institutional lending events (`LoanRepaid`, `CollateralAdded`, `PositionLiquidated`, `CreditDrawdown`) whose execution receipts and Merkle inclusion proofs are attested by Creditcoin CC3 validators and verified by `AetherRiskASC.sol`.

## Architectural Primitives

### 1. Sepolia Source Chain Specifications
- **Network**: Ethereum Sepolia Testnet (`chainId: 11155111`)
- **Attestcoin ChainKey**: `1`
- **Expected Deployed Address**: `0x71C8A6aE87834547900b8e7C49FFe2f3d6fe4C0e` (or deterministic CREATE2)

### 2. Event Topic Signatures
Events emitted must match the ABI and topic structures decoded by `EvmV1Decoder`:
```solidity
event LoanRepaid(
    address indexed borrower,
    uint256 amount,
    uint256 nonce,
    uint256 timestamp
);

event CollateralAdded(
    address indexed borrower,
    uint256 amount,
    address indexed asset,
    uint256 timestamp
);

event PositionLiquidated(
    address indexed borrower,
    uint256 debtCovered,
    address indexed liquidator,
    uint256 timestamp
);

event CreditDrawdown(
    address indexed borrower,
    uint256 amount,
    uint256 nonce,
    uint256 timestamp
);
```

### 3. Simulation & Nonce Management
- `mapping(address => uint256) public borrowerNonces;`
- `mapping(address => uint256) public borrowerCollateral;`
- `mapping(address => uint256) public borrowerOutstandingDebt;`
- Functions:
  - `simulateRepayment(address borrower, uint256 amount)`
  - `simulateCollateralAdd(address borrower, uint256 amount, address asset)`
  - `simulateLiquidation(address borrower, uint256 debtCovered, address liquidator)`
  - `simulateDrawdown(address borrower, uint256 amount)`

## Testing Matrix (`contracts/test/SepoliaLendingEmitter.t.sol`)
1. **LoanRepaid Emission & Nonce Increment**: Validates `LoanRepaid` topic and parameter encoding.
2. **CollateralAdded Emission**: Validates `CollateralAdded` with indexed asset.
3. **PositionLiquidated Emission**: Validates liquidation event structure.
4. **CreditDrawdown Emission**: Validates drawdown event and debt tracking.
