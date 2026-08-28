// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title IChainInfo
/// @notice Interface for Creditcoin CC3 Substrate Native ChainInfo Precompile (0x0000000000000000000000000000000000000FD3)
/// @dev Provides verified metadata and attestation heights for supported source chains
interface IChainInfo {
    /// @notice Returns the latest finalized block height attested by Creditcoin validators for a source chain
    /// @param chainKey Attestcoin source chain identifier (e.g. 1 = Sepolia/CC3)
    /// @return blockHeight Latest attested block height
    function getFinalizedHeight(uint64 chainKey) external view returns (uint64 blockHeight);

    /// @notice Returns the genesis hash of the source chain
    /// @param chainKey Attestcoin source chain identifier
    /// @return genesisHash Genesis block hash of the source chain
    function getGenesisHash(uint64 chainKey) external view returns (bytes32 genesisHash);

    /// @notice Checks if a chain key is actively supported by Creditcoin validators
    /// @param chainKey Attestcoin source chain identifier
    /// @return supported True if the chain is supported
    function isChainSupported(uint64 chainKey) external view returns (bool supported);
}
