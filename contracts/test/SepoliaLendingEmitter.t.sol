// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {SepoliaLendingEmitter} from "../src/SepoliaLendingEmitter.sol";

contract SepoliaLendingEmitterTest is Test {
    SepoliaLendingEmitter public emitter;

    address borrower = 0x3AF8120bA8812CE789a1201882190018910b910B;
    address collateralAsset = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; // USDC
    address liquidator = address(0x9999);

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

    function setUp() public {
        emitter = new SepoliaLendingEmitter();
    }

    function test_SimulateRepayment_EmitsLoanRepaid() public {
        vm.expectEmit(true, false, false, true);
        emit LoanRepaid(borrower, 250_000e6, 1, block.timestamp);

        uint256 nonce = emitter.simulateRepayment(borrower, 250_000e6);
        assertEq(nonce, 1);
        assertEq(emitter.borrowerNonces(borrower), 1);
    }

    function test_SimulateCollateralAdd_EmitsCollateralAdded() public {
        vm.expectEmit(true, true, false, true);
        emit CollateralAdded(borrower, 500_000e6, collateralAsset, block.timestamp);

        bool success = emitter.simulateCollateralAdd(borrower, 500_000e6, collateralAsset);
        assertTrue(success);
        assertEq(emitter.borrowerCollateral(borrower), 500_000e6);
    }

    function test_SimulateLiquidation_EmitsPositionLiquidated() public {
        emitter.simulateDrawdown(borrower, 100_000e6);

        vm.expectEmit(true, true, false, true);
        emit PositionLiquidated(borrower, 100_000e6, liquidator, block.timestamp);

        bool success = emitter.simulateLiquidation(borrower, 100_000e6, liquidator);
        assertTrue(success);
        assertEq(emitter.borrowerOutstandingDebt(borrower), 0);
    }

    function test_SimulateDrawdown_EmitsCreditDrawdown() public {
        vm.expectEmit(true, false, false, true);
        emit CreditDrawdown(borrower, 300_000e6, 1, block.timestamp);

        uint256 nonce = emitter.simulateDrawdown(borrower, 300_000e6);
        assertEq(nonce, 1);
        assertEq(emitter.borrowerOutstandingDebt(borrower), 300_000e6);
    }
}
