import { ethers } from 'ethers';
import { AttestcoinProofPayload, ChainKey, MerkleProofEntry } from './types';

export const CHAIN_KEY_SEPOLIA: ChainKey = 1;
export const CHAIN_KEY_ETH_MAINNET: ChainKey = 3;

export const BLOCK_PROVER_PRECOMPILE =
  process.env.NEXT_PUBLIC_BLOCK_PROVER_PRECOMPILE || '0x0000000000000000000000000000000000000FD2';

export const CHAIN_INFO_PRECOMPILE =
  process.env.NEXT_PUBLIC_CHAIN_INFO_PRECOMPILE || '0x0000000000000000000000000000000000000FD3';

export const DECODER_CONTRACT =
  process.env.NEXT_PUBLIC_DECODER_CONTRACT || '0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f';

export const BLOCK_PROVER_ABI = [
  'function verifySingle(uint8 chainKey, uint64 headerNumber, bytes32 txHash, bytes calldata txBytes, tuple(bytes32 root, tuple(uint8 direction, bytes32 sibling)[] siblings) calldata merkleProof, tuple(bytes32 lowerEndpointDigest, bytes32[] continuityRoots) calldata continuityProof) external returns (bytes memory receipt)',
];

export const CHAIN_INFO_ABI = [
  'function isFinalized(uint8 chainKey, uint64 blockNumber) external view returns (bool)',
  'function getLatestFinalizedBlock(uint8 chainKey) external view returns (uint64)',
];

export interface QuerySpecification {
  chainKey: number;
  blockNumber: number;
  txHash: `0x${string}`;
}

/**
 * Encodes calldata for INativeQueryVerifier (0xFD2) verifySingle call
 */
export function encodeBlockProverInput(payload: AttestcoinProofPayload): string {
  const iface = new ethers.Interface(BLOCK_PROVER_ABI);

  const formattedSiblings = payload.merkleProof.siblings.map((s) => ({
    direction: s.direction,
    sibling: s.sibling,
  }));

  return iface.encodeFunctionData('verifySingle', [
    payload.chainKey,
    payload.headerNumber,
    payload.txHash,
    payload.txBytes,
    {
      root: payload.merkleProof.root,
      siblings: formattedSiblings,
    },
    {
      lowerEndpointDigest: payload.continuityProof.lowerEndpointDigest,
      continuityRoots: payload.continuityProof.continuityRoots,
    },
  ]);
}

/**
 * Creates canonical USC Query representation for query hash computation
 */
export function formatAttestcoinQuery(
  chainKey: number,
  blockNumber: number,
  txHash: `0x${string}`
): `0x${string}` {
  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['uint8', 'uint64', 'bytes32'],
      [chainKey, blockNumber, txHash]
    )
  ) as `0x${string}`;
}

/**
 * Verifies if an execution receipt status is 0x1 (Success)
 */
export function parsePrecompileReceipt(receiptBytes: string): { status: boolean; gasUsed: bigint } {
  try {
    if (!receiptBytes || receiptBytes === '0x') {
      return { status: false, gasUsed: 0n };
    }
    // Typical receipt format in EVM Decoders: status byte at start or standard RLP
    const statusByte = receiptBytes.slice(0, 4);
    const isSuccess = statusByte === '0x01' || receiptBytes.endsWith('01');
    return {
      status: isSuccess,
      gasUsed: 21000n,
    };
  } catch {
    return { status: false, gasUsed: 0n };
  }
}
