// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {INativeQueryVerifier} from "./interfaces/INativeQueryVerifier.sol";
import {IChainInfo} from "./interfaces/IChainInfo.sol";
import {IEvmV1Decoder} from "./interfaces/IEvmV1Decoder.sol";

/// @title AetherRiskASC
/// @notice Core Attestcoin Smart Contract on Creditcoin CC3 EVM Frontier
/// @dev Coordinates precompile 0xFD2 proof verification, EvmV1Decoder receipt validation, and credit events
contract AetherRiskASC {
    address public constant BLOCK_PROVER = 0x0000000000000000000000000000000000000FD2;
    address public constant CHAIN_INFO = 0x0000000000000000000000000000000000000fD3;

    address public immutable decoder;
    address public owner;
    address public creditRegistry;

    mapping(bytes32 => bool) public processedQueryHashes;

    struct ProofPayload {
        uint64 chainKey;
        uint64 blockHeight;
        bytes encodedTransaction;
        bytes rawReceipt;
        bytes32 merkleRoot;
        INativeQueryVerifier.MerkleProofEntry[] siblings;
        bytes32 lowerEndpointDigest;
        bytes32[] continuityRoots;
    }

    event VerifiedCrossChainFact(
        bytes32 indexed queryHash,
        uint64 indexed chainKey,
        uint64 indexed blockHeight,
        address borrower,
        uint256 amount,
        uint8 operationType,
        bytes32 sourceTxHash
    );

    event CreditRegistryUpdated(address indexed newRegistry);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");
        _;
    }

    constructor(address _decoder, address _creditRegistry) {
        decoder = _decoder != address(0) ? _decoder : 0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f;
        owner = msg.sender;
        creditRegistry = _creditRegistry;
    }

    function setCreditRegistry(address _creditRegistry) external onlyOwner {
        creditRegistry = _creditRegistry;
        emit CreditRegistryUpdated(_creditRegistry);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "INVALID_OWNER");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function computeQueryHash(
        uint64 chainKey,
        uint64 blockHeight,
        bytes32 txHash
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(chainKey, blockHeight, txHash));
    }

    function isQueryProcessed(bytes32 queryHash) external view returns (bool) {
        return processedQueryHashes[queryHash];
    }

    function verifyAndProcessCreditEvent(
        ProofPayload calldata proof,
        address borrower,
        uint256 amount,
        uint8 operationType
    ) external returns (bool success) {
        bytes32 sourceTxHash = keccak256(proof.encodedTransaction);
        bytes32 queryHash = computeQueryHash(proof.chainKey, proof.blockHeight, sourceTxHash);

        require(!processedQueryHashes[queryHash], "QUERY_ALREADY_PROCESSED");

        // 1. Synchronous Merkle & Continuity Proof Verification via BlockProver (0xFD2)
        require(
            INativeQueryVerifier(BLOCK_PROVER).verifySingle(
                proof.chainKey,
                proof.blockHeight,
                proof.encodedTransaction,
                proof.merkleRoot,
                proof.siblings,
                proof.lowerEndpointDigest,
                proof.continuityRoots
            ),
            "INVALID_ATTESTCOIN_PROOF"
        );

        // 2. Validate Source Execution Status via EvmV1Decoder
        require(
            IEvmV1Decoder(decoder).decodeReceipt(proof.rawReceipt).status == 0x1,
            "TX_FAILED_ON_SOURCE"
        );

        // 3. Mark Replay Protection Guard
        processedQueryHashes[queryHash] = true;

        // 4. Emit On-Chain Verified Fact
        emit VerifiedCrossChainFact(
            queryHash,
            proof.chainKey,
            proof.blockHeight,
            borrower,
            amount,
            operationType,
            sourceTxHash
        );

        return true;
    }
}
