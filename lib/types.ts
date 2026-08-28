export type ChainKey = 1 | 3; // 1 = Sepolia/Mainnet CC3, 3 = Ethereum Mainnet CC3 Testnet

export type OperationType =
  | 'LOAN_REPAID'
  | 'COLLATERAL_ADDED'
  | 'DEBT_SETTLED'
  | 'INVOICE_PAID'
  | 'REBALANCE_TRIGGER'
  | 'COLLATERAL_WITHDRAWN';

export type OperationStatus =
  | 'PENDING_ATTESTATION'
  | 'VERIFIED_PRECOMPILE'
  | 'RISK_MUTATED'
  | 'COMPLETED'
  | 'FAILED';

export type ProofSource = 'LIVE_ATTESTCOIN' | 'CACHED_REAL_PROOF' | 'SANDBOX_SIMULATION';

export interface MerkleProofEntry {
  direction: number; // 0 = Left, 1 = Right
  sibling: `0x${string}`;
}

export interface AttestcoinProofPayload {
  chainKey: number;
  headerNumber: number;
  txHash: `0x${string}`;
  txBytes: `0x${string}`;
  merkleProof: {
    root: `0x${string}`;
    siblings: MerkleProofEntry[];
  };
  continuityProof: {
    lowerEndpointDigest: `0x${string}`;
    continuityRoots: `0x${string}`[];
  };
  cached: boolean;
}

export interface ResolvedProof {
  data: AttestcoinProofPayload;
  source: ProofSource;
  latencyMs: number;
  generatedAt?: string;
}

export interface Eip712RiskPayload {
  borrower: `0x${string}`;
  oldScore: number;
  newScore: number;
  maxCreditLineUsd: string;
  apyBps: number;
  attestcoinProofHash: `0x${string}`;
  enclaveNonce: number;
  deadline: number;
}

export interface EnclaveSignature {
  r: `0x${string}`;
  s: `0x${string}`;
  v: number;
  signerAddress: `0x${string}`;
}

export interface OperationRecord {
  id: string;
  txCode: string;
  borrowerAddress: string;
  borrowerName: string;
  sourceChain: string;
  sourceChainId: number;
  chainKey: number;
  operationType: OperationType;
  provenAmountUsd: number;
  assetSymbol: string;
  blockHeight: number;
  sourceTxHash: string;
  creditcoinTxHash: string;
  proverLatencySec: number;
  creditScoreDelta: number;
  oldScore: number;
  newScore: number;
  oldApyBps: number;
  newApyBps: number;
  status: OperationStatus;
  proofSource: ProofSource;
  merkleRoot: string;
  continuityDigest: string;
  timestamp: string;
}

export interface SimulationPersona {
  id: string;
  name: string;
  sector: string;
  address: `0x${string}`;
  currentScore: number;
  targetScore: number;
  currentApy: number;
  targetApy: number;
  currentCreditLine: number;
  targetCreditLine: number;
  defaultAction: OperationType;
  defaultAmount: number;
  defaultAsset: string;
  description: string;
}
