// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {SepoliaLendingEmitter} from "../src/SepoliaLendingEmitter.sol";

contract DeploySepolia is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80)
        );

        vm.startBroadcast(deployerPrivateKey);

        // Deploy SepoliaLendingEmitter
        SepoliaLendingEmitter emitter = new SepoliaLendingEmitter();
        console.log("SepoliaLendingEmitter deployed at:", address(emitter));

        vm.stopBroadcast();

        console.log("--- Ethereum Sepolia Deployment Complete ---");
        console.log("NEXT_PUBLIC_SEPOLIA_EMITTER_ADDRESS=%s", address(emitter));
    }
}
