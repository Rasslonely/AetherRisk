// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title SepoliaLendingEmitter
/// @notice Source chain event emitter deployed to Ethereum Sepolia (chainId: 11155111)
/// @dev Emits institutional credit events attested by Creditcoin CC3 BlockProver
contract SepoliaLendingEmitter {
    address public owner;

    mapping(address => uint256) public borrowerNonces;
    mapping(address => uint256) public borrowerCollateral;
    mapping(address => uint256) public borrowerOutstandingDebt;

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

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "INVALID_OWNER");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function simulateRepayment(address borrower, uint256 amount) external returns (uint256 currentNonce) {
        require(borrower != address(0), "INVALID_BORROWER");
        require(amount > 0, "INVALID_AMOUNT");

        currentNonce = ++borrowerNonces[borrower];
        if (borrowerOutstandingDebt[borrower] >= amount) {
            borrowerOutstandingDebt[borrower] -= amount;
        } else {
            borrowerOutstandingDebt[borrower] = 0;
        }

        emit LoanRepaid(borrower, amount, currentNonce, block.timestamp);
    }

    function simulateCollateralAdd(address borrower, uint256 amount, address asset) external returns (bool) {
        require(borrower != address(0), "INVALID_BORROWER");
        require(amount > 0, "INVALID_AMOUNT");

        borrowerCollateral[borrower] += amount;
        emit CollateralAdded(borrower, amount, asset, block.timestamp);
        return true;
    }

    function simulateLiquidation(address borrower, uint256 debtCovered, address liquidator) external returns (bool) {
        require(borrower != address(0), "INVALID_BORROWER");
        require(liquidator != address(0), "INVALID_LIQUIDATOR");
        require(debtCovered > 0, "INVALID_DEBT_COVERED");

        if (borrowerOutstandingDebt[borrower] >= debtCovered) {
            borrowerOutstandingDebt[borrower] -= debtCovered;
        } else {
            borrowerOutstandingDebt[borrower] = 0;
        }

        emit PositionLiquidated(borrower, debtCovered, liquidator, block.timestamp);
        return true;
    }

    function simulateDrawdown(address borrower, uint256 amount) external returns (uint256 currentNonce) {
        require(borrower != address(0), "INVALID_BORROWER");
        require(amount > 0, "INVALID_AMOUNT");

        currentNonce = ++borrowerNonces[borrower];
        borrowerOutstandingDebt[borrower] += amount;

        emit CreditDrawdown(borrower, amount, currentNonce, block.timestamp);
    }
}
