// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {AetherRiskASC} from "../src/AetherRiskASC.sol";
import {CreditRegistry} from "../src/CreditRegistry.sol";
import {AetherVault4626, IERC20} from "../src/AetherVault4626.sol";

contract MockInstitutionalUSDC is IERC20 {
    string public name = "Institutional USDC";
    string public symbol = "iUSDC";
    uint8 public decimals = 18;

    uint256 public override totalSupply;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    constructor() {
        _mint(msg.sender, 100_000_000e18);
    }

    function _mint(address to, uint256 amount) internal {
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

contract DeployCreditcoin is Script {
    address constant EVM_V1_DECODER = 0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f;
    address constant DEFAULT_ENCLAVE_SIGNER = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    bytes32 constant HARDWARE_ID = keccak256("AMD-SEV-SNP-PHALA-DSTACK-NODE-01");

    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );

        address enclaveSigner = vm.envOr("ENCLAVE_SIGNER_ADDRESS", DEFAULT_ENCLAVE_SIGNER);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy CreditRegistry (TEE-Lite Trust Boundary)
        CreditRegistry registry = new CreditRegistry(enclaveSigner, HARDWARE_ID);
        console.log("CreditRegistry deployed at:", address(registry));

        // 2. Deploy AetherRiskASC (Attestcoin Smart Contract)
        AetherRiskASC asc = new AetherRiskASC(EVM_V1_DECODER, address(registry));
        console.log("AetherRiskASC deployed at:", address(asc));

        // 3. Deploy Institutional Asset Token
        MockInstitutionalUSDC token = new MockInstitutionalUSDC();
        console.log("MockInstitutionalUSDC deployed at:", address(token));

        // 4. Deploy AetherVault4626 (Dynamic Lending Vault)
        AetherVault4626 vault = new AetherVault4626(address(token), address(registry));
        console.log("AetherVault4626 deployed at:", address(vault));

        vm.stopBroadcast();

        console.log("--- Creditcoin CC3 Deployment Complete ---");
        console.log("NEXT_PUBLIC_CREDIT_REGISTRY_ADDRESS=%s", address(registry));
        console.log("NEXT_PUBLIC_AETHER_RISK_ASC_ADDRESS=%s", address(asc));
        console.log("NEXT_PUBLIC_AETHER_VAULT_ADDRESS=%s", address(vault));
        console.log("NEXT_PUBLIC_USDC_ADDRESS=%s", address(token));
    }
}
