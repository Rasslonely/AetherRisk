import { ethers } from 'ethers';
import {
  CREDITCOIN_CC3_TESTNET,
  CONTRACT_ADDRESSES,
  ERC20_ABI,
  formatTokenBalance,
} from '@/lib/web3-config';

export interface FaucetClaimResult {
  success: boolean;
  recipient?: string;
  amount?: string;
  assetSymbol?: string;
  assetAddress?: string;
  network?: string;
  chainId?: number;
  txHash?: string;
  explorerUrl?: string;
  gasSent?: boolean;
  gasTxHash?: string | null;
  error?: string;
}

/**
 * Read iUSDC balance for a given address on Creditcoin CC3.
 */
export async function getUsdcBalance(
  address: string,
  customProvider?: ethers.Provider
): Promise<string> {
  try {
    const provider =
      customProvider || new ethers.JsonRpcProvider(CREDITCOIN_CC3_TESTNET.rpcUrls[0]);
    const contract = new ethers.Contract(CONTRACT_ADDRESSES.CC3.MOCK_IUSDC, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    return formatTokenBalance(balance, 18, 2);
  } catch (err) {
    console.warn('Failed to query iUSDC balance:', err);
    return '0.00';
  }
}

/**
 * Read iUSDC allowance for a spender.
 */
export async function getUsdcAllowance(
  owner: string,
  spender: string,
  customProvider?: ethers.Provider
): Promise<bigint> {
  try {
    const provider =
      customProvider || new ethers.JsonRpcProvider(CREDITCOIN_CC3_TESTNET.rpcUrls[0]);
    const contract = new ethers.Contract(CONTRACT_ADDRESSES.CC3.MOCK_IUSDC, ERC20_ABI, provider);
    return await contract.allowance(owner, spender);
  } catch (err) {
    console.warn('Failed to query iUSDC allowance:', err);
    return 0n;
  }
}

/**
 * Approve a spender (e.g., AetherVault4626) to spend iUSDC.
 */
export async function approveUsdc(
  spender: string,
  amount: bigint,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const contract = new ethers.Contract(CONTRACT_ADDRESSES.CC3.MOCK_IUSDC, ERC20_ABI, signer);
  const tx = await contract.approve(spender, amount);
  return await tx.wait(1);
}

/**
 * Trigger the 1-Click Institutional Faucet API to claim 10,000 iUSDC on Creditcoin CC3.
 */
export async function requestFaucetFunds(recipient: string): Promise<FaucetClaimResult> {
  const response = await fetch('/api/faucet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Faucet request failed.');
  }

  return data as FaucetClaimResult;
}
