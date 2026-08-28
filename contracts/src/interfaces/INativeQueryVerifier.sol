// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title INativeQueryVerifier
/// @notice Interface for Creditcoin CC3 Substrate Native BlockProver Precompile (0x0000000000000000000000000000000000000FD2)
/// @dev Verifies synchronous Merkle inclusion and continuity proofs on Creditcoin CC3 EVM Frontier
interface INativeQueryVerifier {
    struct MerkleProofEntry {
        uint8 direction; // 0 = Left, 1 = Right
        bytes32 sibling;
    }

    /// @notice Synchronously verifies a single cross-chain transaction proof
    /// @param chainKey Attestcoin unique identifier for the source chain (e.g. 1 = Sepolia/CC3, 3 = Eth Mainnet)
    /// @param blockHeight Source chain block height where transaction was mined
    /// @param encodedTransaction Raw RLP-encoded transaction bytes from source chain
    /// @param merkleRoot Attested Merkle tree root for the source block
    /// @param siblings Merkle sibling proof entries proving inclusion
    /// @param lowerEndpointDigest Digest of the lower endpoint in the continuity chain
    /// @param continuityRoots Array of continuity roots linking block attestations
    /// @return success True if the transaction inclusion and continuity proofs are valid
    function verifySingle(
        uint64 chainKey,
        uint64 blockHeight,
        bytes calldata encodedTransaction,
        bytes32 merkleRoot,
        MerkleProofEntry[] calldata siblings,
        bytes32 lowerEndpointDigest,
        bytes32[] calldata continuityRoots
    ) external view returns (bool success);
}
