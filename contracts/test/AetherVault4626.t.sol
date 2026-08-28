// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {AetherVault4626, IERC20} from "../src/AetherVault4626.sol";
import {CreditRegistry} from "../src/CreditRegistry.sol";

contract MockERC20 is IERC20 {
    string public name = "Mock USDC";
    string public symbol = "mUSDC";
    uint8 public decimals = 18;

    uint256 public override totalSupply;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    function mint(address to, uint256 amount) external {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        if (allowance[sender][msg.sender] != type(uint256).max) {
            allowance[sender][msg.sender] -= amount;
        }
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}

contract AetherVault4626Test is Test {
    MockERC20 public token;
    CreditRegistry public registry;
    AetherVault4626 public vault;

    address lp = address(0x1111);
    address borrower = 0x3AF8120bA8812CE789a1201882190018910b910B;
    uint256 enclavePrivateKey = 0xA11CE;
    address enclaveAddress;

    function setUp() public {
        token = new MockERC20();
        enclaveAddress = vm.addr(enclavePrivateKey);
        registry = new CreditRegistry(enclaveAddress, keccak256("HARDWARE_KEY"));
        vault = new AetherVault4626(address(token), address(registry));

        token.mint(lp, 10_000_000e18);
        token.mint(borrower, 1_000_000e18);

        vm.prank(lp);
        token.approve(address(vault), type(uint256).max);

        vm.prank(borrower);
        token.approve(address(vault), type(uint256).max);
    }

    function test_DepositAndWithdraw_RoundTrip() public {
        vm.prank(lp);
        uint256 shares = vault.deposit(500_000e18, lp);
        assertGt(shares, 0);
        assertEq(vault.balanceOf(lp), shares);
        assertEq(vault.totalAssets(), 500_000e18);

        vm.prank(lp);
        uint256 withdrawnShares = vault.withdraw(500_000e18, lp, lp);
        assertEq(withdrawnShares, shares);
        assertEq(token.balanceOf(lp), 10_000_000e18);
    }

    function test_DynamicRateAdjustment_OnScoreChange() public {
        // Default uninitialized score = 620 -> 920 bps (9.20%)
        uint16 initialRate = vault.getDynamicApy(borrower);
        assertEq(initialRate, 920);

        // Mutate score to 810 -> 410 bps (4.10%) via CreditRegistry
        bytes32 proofHash = keccak256("proof_score_810");
        uint256 deadline = block.timestamp + 3600;

        bytes32 structHash = keccak256(
            abi.encode(
                registry.RISK_MUTATION_TYPEHASH(),
                borrower,
                uint16(620),
                uint16(810),
                uint256(2_000_000e18),
                uint16(410),
                proofHash,
                uint256(0),
                deadline
            )
        );
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", registry.DOMAIN_SEPARATOR(), structHash)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(enclavePrivateKey, digest);
        bytes memory sig = abi.encodePacked(r, s, v);

        registry.updateCreditScore(borrower, 620, 810, 2_000_000e18, 410, proofHash, 0, deadline, sig);

        uint16 updatedRate = vault.getDynamicApy(borrower);
        assertEq(updatedRate, 410);
    }

    function test_BorrowWithinCreditLineLimit() public {
        vm.prank(lp);
        vault.deposit(2_000_000e18, lp);

        vm.prank(borrower);
        bool success = vault.borrow(500_000e18);
        assertTrue(success);
        assertEq(token.balanceOf(borrower), 1_500_000e18);
        assertEq(vault.totalBorrowed(), 500_000e18);
    }

    function test_RevertBorrowExceedingLimit() public {
        vm.prank(lp);
        vault.deposit(2_000_000e18, lp);

        // Default max credit line is 1_000_000e18
        vm.prank(borrower);
        vm.expectRevert("EXCEEDS_CREDIT_LINE");
        vault.borrow(1_500_000e18);
    }
}
