// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {CreditRegistry} from "../src/CreditRegistry.sol";

contract CreditRegistryTest is Test {
    CreditRegistry public registry;

    uint256 enclavePrivateKey = 0xA11CE;
    address enclaveAddress;
    address borrower = 0x3AF8120bA8812CE789a1201882190018910b910B;

    function setUp() public {
        enclaveAddress = vm.addr(enclavePrivateKey);
        registry = new CreditRegistry(enclaveAddress, keccak256("AMD-SEV-SNP-QUOTE-001"));
    }

    function _signMutation(
        address _borrower,
        uint16 oldScore,
        uint16 newScore,
        uint256 maxCreditLine,
        uint16 apyBps,
        bytes32 attestcoinProofHash,
        uint256 nonce,
        uint256 deadline,
        uint256 privateKey
    ) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(
            abi.encode(
                registry.RISK_MUTATION_TYPEHASH(),
                _borrower,
                oldScore,
                newScore,
                maxCreditLine,
                apyBps,
                attestcoinProofHash,
                nonce,
                deadline
            )
        );

        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", registry.DOMAIN_SEPARATOR(), structHash)
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        return abi.encodePacked(r, s, v);
    }

    function test_UpdateCreditScore_ValidEnclaveSignature() public {
        bytes32 proofHash = keccak256("attestcoin_proof_001");
        uint256 deadline = block.timestamp + 3600;

        bytes memory signature = _signMutation(
            borrower,
            620,
            810,
            1650000e18,
            410,
            proofHash,
            0,
            deadline,
            enclavePrivateKey
        );

        bool success = registry.updateCreditScore(
            borrower,
            620,
            810,
            1650000e18,
            410,
            proofHash,
            0,
            deadline,
            signature
        );
        assertTrue(success);

        (uint16 score, uint256 creditLine, uint16 apyBps,, bytes32 lastProof) = registry.getCreditProfile(borrower);
        assertEq(score, 810);
        assertEq(creditLine, 1650000e18);
        assertEq(apyBps, 410);
        assertEq(lastProof, proofHash);
    }

    function test_RevertUnauthorizedSigner() public {
        uint256 rogueKey = 0xB0B;
        bytes32 proofHash = keccak256("attestcoin_proof_002");
        uint256 deadline = block.timestamp + 3600;

        bytes memory rogueSignature = _signMutation(
            borrower,
            620,
            810,
            1650000e18,
            410,
            proofHash,
            0,
            deadline,
            rogueKey
        );

        vm.expectRevert("INVALID_ENCLAVE_SIG");
        registry.updateCreditScore(
            borrower,
            620,
            810,
            1650000e18,
            410,
            proofHash,
            0,
            deadline,
            rogueSignature
        );
    }

    function test_RevertDuplicateMutation() public {
        bytes32 proofHash = keccak256("attestcoin_proof_003");
        uint256 deadline = block.timestamp + 3600;

        bytes memory signature = _signMutation(
            borrower,
            620,
            810,
            1650000e18,
            410,
            proofHash,
            0,
            deadline,
            enclavePrivateKey
        );

        registry.updateCreditScore(borrower, 620, 810, 1650000e18, 410, proofHash, 0, deadline, signature);

        vm.expectRevert("DUPLICATE_MUTATION");
        registry.updateCreditScore(borrower, 620, 810, 1650000e18, 410, proofHash, 0, deadline, signature);
    }

    function test_RevertExpiredDeadline() public {
        bytes32 proofHash = keccak256("attestcoin_proof_004");
        uint256 expiredDeadline = block.timestamp - 1;

        bytes memory signature = _signMutation(
            borrower,
            620,
            810,
            1650000e18,
            410,
            proofHash,
            0,
            expiredDeadline,
            enclavePrivateKey
        );

        vm.expectRevert("SIGNATURE_EXPIRED");
        registry.updateCreditScore(borrower, 620, 810, 1650000e18, 410, proofHash, 0, expiredDeadline, signature);
    }

    function test_RegisterAndRemoveEnclaveSigner() public {
        address newEnclave = address(0x90F79bf6EB2c4f870365E785982E1f101E93b906);
        registry.registerEnclaveSigner(newEnclave, keccak256("NEW_HARDWARE_QUOTE"));
        assertTrue(registry.authorizedEnclaveSigners(newEnclave));

        registry.removeEnclaveSigner(newEnclave);
        assertFalse(registry.authorizedEnclaveSigners(newEnclave));
    }
}
