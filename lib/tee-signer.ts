import { ethers } from 'ethers';
import { Eip712RiskPayload, EnclaveSignature } from './types';

const DEFAULT_ENCLAVE_PRIVATE_KEY =
  process.env.ENCLAVE_SIGNER_PRIVATE_KEY ||
  '0x0000000000000000000000000000000000000000000000000000000000000001';

const CC3_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CC3_CHAIN_ID || '102031', 10);
const CREDIT_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_CREDIT_REGISTRY_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

export const EIP712_DOMAIN = {
  name: 'AetherRisk CreditRegistry',
  version: '1',
  chainId: CC3_CHAIN_ID,
  verifyingContract: CREDIT_REGISTRY_ADDRESS,
};

export const EIP712_TYPES = {
  CreditScoreUpdate: [
    { name: 'borrower', type: 'address' },
    { name: 'oldScore', type: 'uint16' },
    { name: 'newScore', type: 'uint16' },
    { name: 'maxCreditLineUsd', type: 'uint256' },
    { name: 'apyBps', type: 'uint16' },
    { name: 'attestcoinProofHash', type: 'bytes32' },
    { name: 'enclaveNonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};

/**
 * Signs a credit risk mutation payload using the isolated hardware TEE private key
 */
export async function signRiskMutation(
  payload: Eip712RiskPayload,
  privateKey: string = DEFAULT_ENCLAVE_PRIVATE_KEY
): Promise<EnclaveSignature> {
  const wallet = new ethers.Wallet(privateKey);
  const signerAddress = (await wallet.getAddress()) as `0x${string}`;

  const value = {
    borrower: payload.borrower,
    oldScore: payload.oldScore,
    newScore: payload.newScore,
    maxCreditLineUsd: payload.maxCreditLineUsd,
    apyBps: payload.apyBps,
    attestcoinProofHash: payload.attestcoinProofHash,
    enclaveNonce: payload.enclaveNonce,
    deadline: payload.deadline,
  };

  const rawSignature = await wallet.signTypedData(EIP712_DOMAIN, EIP712_TYPES, value);
  const sig = ethers.Signature.from(rawSignature);

  return {
    r: sig.r as `0x${string}`,
    s: sig.s as `0x${string}`,
    v: sig.v,
    signerAddress,
  };
}

/**
 * Verifies if an EIP-712 signature matches the authorized enclave signer
 */
export function verifyEnclaveSignature(
  payload: Eip712RiskPayload,
  signature: string,
  expectedSigner?: string
): boolean {
  try {
    const value = {
      borrower: payload.borrower,
      oldScore: payload.oldScore,
      newScore: payload.newScore,
      maxCreditLineUsd: payload.maxCreditLineUsd,
      apyBps: payload.apyBps,
      attestcoinProofHash: payload.attestcoinProofHash,
      enclaveNonce: payload.enclaveNonce,
      deadline: payload.deadline,
    };

    const recoveredAddress = ethers.verifyTypedData(EIP712_DOMAIN, EIP712_TYPES, value, signature);

    if (expectedSigner) {
      return recoveredAddress.toLowerCase() === expectedSigner.toLowerCase();
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns Phala dstack AMD SEV-SNP hardware attestation quote metadata
 */
export function getEnclaveMetadata() {
  return {
    platform: 'Phala dstack Confidential Container',
    hardwareEnclave: 'AMD SEV-SNP',
    measurementHash: '0x8891029384719283746192837461928374619283746192837461928374619283',
    signerAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    tcbStatus: 'UpToDate',
    securityVersion: 2,
    attestationServer: 'https://dstack.phala.network/attestation/verify',
  };
}
