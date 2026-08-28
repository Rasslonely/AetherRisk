// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title IEvmV1Decoder
/// @notice Interface for Creditcoin CC3 EvmV1Decoder contract (0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f)
/// @dev Decodes RLP-encoded Ethereum transactions, receipts, and event topics
interface IEvmV1Decoder {
    struct EvmLog {
        address emitter;
        bytes32[] topics;
        bytes data;
    }

    struct EvmTransaction {
        uint64 chainId;
        uint64 nonce;
        uint256 maxPriorityFeePerGas;
        uint256 maxFeePerGas;
        uint256 gasLimit;
        address to;
        uint256 value;
        bytes data;
        address from;
    }

    struct EvmReceipt {
        uint8 status; // 0x1 = SUCCESS, 0x0 = REVERT
        uint256 cumulativeGasUsed;
        bytes logsBloom;
        EvmLog[] logs;
    }

    /// @notice Decodes raw RLP transaction bytes into structured fields
    /// @param rawTx Encoded transaction bytes from source chain
    /// @return txData Decoded transaction struct
    function decodeTransaction(bytes calldata rawTx) external view returns (EvmTransaction memory txData);

    /// @notice Decodes raw RLP receipt bytes into structured receipt and log fields
    /// @param rawReceipt Encoded receipt bytes from source chain
    /// @return receiptData Decoded receipt struct including execution status and logs
    function decodeReceipt(bytes calldata rawReceipt) external view returns (EvmReceipt memory receiptData);

    /// @notice Extracts an event log with specific topic from raw receipt bytes
    /// @param rawReceipt Encoded receipt bytes
    /// @param targetTopic Event signature hash topic
    /// @return found True if event was found in logs
    /// @return emitter Address of contract that emitted the event
    /// @return eventData Non-indexed ABI encoded parameters of the event
    function extractEventTopic(
        bytes calldata rawReceipt,
        bytes32 targetTopic
    ) external view returns (bool found, address emitter, bytes memory eventData);
}
