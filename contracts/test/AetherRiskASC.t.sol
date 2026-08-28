// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {AetherRiskASC} from "../src/AetherRiskASC.sol";
import {INativeQueryVerifier} from "../src/interfaces/INativeQueryVerifier.sol";
import {IEvmV1Decoder} from "../src/interfaces/IEvmV1Decoder.sol";

contract MockEvmV1Decoder is IEvmV1Decoder {
    uint8 public mockStatus = 0x1;

    function setMockStatus(uint8 _status) external {
        mockStatus = _status;
    }

    function decodeTransaction(bytes calldata) external pure override returns (EvmTransaction memory) {
        return EvmTransaction(1, 0, 0, 0, 21000, address(0), 0, "", address(0));
    }

    function decodeReceipt(bytes calldata) external view override returns (EvmReceipt memory) {
        EvmLog[] memory logs = new EvmLog[](0);
        return EvmReceipt(mockStatus, 21000, "", logs);
    }

    function extractEventTopic(bytes calldata, bytes32) external pure override returns (bool, address, bytes memory) {
        return (true, address(0), "");
    }
}

contract AetherRiskASCTest is Test {
    AetherRiskASC public asc;
    MockEvmV1Decoder public mockDecoder;

    address constant BLOCK_PROVER = 0x0000000000000000000000000000000000000FD2;
    address borrower = 0x3AF8120bA8812CE789a1201882190018910b910B;

    function setUp() public {
        mockDecoder = new MockEvmV1Decoder();
        asc = new AetherRiskASC(address(mockDecoder), address(0));
    }

    function _buildValidProof() internal pure returns (AetherRiskASC.ProofPayload memory) {
        INativeQueryVerifier.MerkleProofEntry[] memory siblings = new INativeQueryVerifier.MerkleProofEntry[](1);
        siblings[0] = INativeQueryVerifier.MerkleProofEntry(0, keccak256("sibling"));

        bytes32[] memory continuityRoots = new bytes32[](1);
        continuityRoots[0] = keccak256("continuity");

        return AetherRiskASC.ProofPayload({
            chainKey: 1,
            blockHeight: 6192840,
            encodedTransaction: hex"02f87082aa3601",
            rawReceipt: hex"01382901",
            merkleRoot: keccak256("merkleRoot"),
            siblings: siblings,
            lowerEndpointDigest: keccak256("lowerEndpoint"),
            continuityRoots: continuityRoots
        });
    }

    function test_VerifyAndProcessCreditEvent_Success() public {
        AetherRiskASC.ProofPayload memory proof = _buildValidProof();

        // Mock BlockProver precompile response (0xFD2)
        vm.mockCall(
            BLOCK_PROVER,
            abi.encodeWithSelector(INativeQueryVerifier.verifySingle.selector),
            abi.encode(true)
        );

        bool success = asc.verifyAndProcessCreditEvent(proof, borrower, 250000e6, 0);
        assertTrue(success);

        bytes32 txHash = keccak256(proof.encodedTransaction);
        bytes32 queryHash = asc.computeQueryHash(proof.chainKey, proof.blockHeight, txHash);
        assertTrue(asc.isQueryProcessed(queryHash));
    }

    function test_ReplayProtection_RevertsOnDuplicate() public {
        AetherRiskASC.ProofPayload memory proof = _buildValidProof();

        vm.mockCall(
            BLOCK_PROVER,
            abi.encodeWithSelector(INativeQueryVerifier.verifySingle.selector),
            abi.encode(true)
        );

        asc.verifyAndProcessCreditEvent(proof, borrower, 250000e6, 0);

        vm.expectRevert("QUERY_ALREADY_PROCESSED");
        asc.verifyAndProcessCreditEvent(proof, borrower, 250000e6, 0);
    }

    function test_RevertsOnFailedSourceTransaction() public {
        AetherRiskASC.ProofPayload memory proof = _buildValidProof();

        vm.mockCall(
            BLOCK_PROVER,
            abi.encodeWithSelector(INativeQueryVerifier.verifySingle.selector),
            abi.encode(true)
        );

        // Set mock decoder status to REVERT (0x0)
        mockDecoder.setMockStatus(0x0);

        vm.expectRevert("TX_FAILED_ON_SOURCE");
        asc.verifyAndProcessCreditEvent(proof, borrower, 250000e6, 0);
    }

    function test_RevertsOnInvalidAttestcoinProof() public {
        AetherRiskASC.ProofPayload memory proof = _buildValidProof();

        // Mock BlockProver precompile returning false
        vm.mockCall(
            BLOCK_PROVER,
            abi.encodeWithSelector(INativeQueryVerifier.verifySingle.selector),
            abi.encode(false)
        );

        vm.expectRevert("INVALID_ATTESTCOIN_PROOF");
        asc.verifyAndProcessCreditEvent(proof, borrower, 250000e6, 0);
    }
}
