import { ethers } from 'ethers';
import {
  CREDITCOIN_CC3_TESTNET,
  CONTRACT_ADDRESSES,
  AETHER_VAULT_ABI,
  ERC20_ABI,
  CREDIT_REGISTRY_ABI,
  formatTokenBalance,
} from '@/lib/web3-config';

export interface VaultOverview {
  totalAssets: bigint;
  totalAssetsFormatted: string;
  totalSupply: bigint;
  totalSupplyFormatted: string;
  totalBorrowed: bigint;
  totalBorrowedFormatted: string;
  availableLiquidity: bigint;
  availableLiquidityFormatted: string;
  sharePrice: string; // ratio totalAssets / totalSupply
  utilizationRate: number; // percentage 0 - 100
}

export interface UserVaultPosition {
  shares: bigint;
  sharesFormatted: string;
  underlyingAssets: bigint;
  underlyingAssetsFormatted: string;
  usdcBalance: bigint;
  usdcBalanceFormatted: string;
  allowance: bigint;
  allowanceFormatted: string;
  borrowedPrincipal: bigint;
  borrowedPrincipalFormatted: string;
  interestAccrued: bigint;
  interestAccruedFormatted: string;
  totalDebtDue: bigint;
  totalDebtDueFormatted: string;
  creditScore: number;
  maxCreditLine: bigint;
  maxCreditLineFormatted: string;
  availableCredit: bigint;
  availableCreditFormatted: string;
  borrowApyBps: number;
  borrowApyPercent: string;
  isAttested: boolean;
  lastUpdated: number;
  lastProofHash: string;
}

/**
 * Fetch live on-chain Vault metrics and optional user position on Creditcoin CC3.
 */
export async function fetchVaultOverview(
  account?: string | null,
  customProvider?: ethers.Provider
): Promise<{ vault: VaultOverview; user?: UserVaultPosition }> {
  const provider =
    customProvider || new ethers.JsonRpcProvider(CREDITCOIN_CC3_TESTNET.rpcUrls[0]);

  const vaultContract = new ethers.Contract(
    CONTRACT_ADDRESSES.CC3.AETHER_VAULT_4626,
    AETHER_VAULT_ABI,
    provider
  );

  const usdcContract = new ethers.Contract(
    CONTRACT_ADDRESSES.CC3.MOCK_IUSDC,
    ERC20_ABI,
    provider
  );

  const registryContract = new ethers.Contract(
    CONTRACT_ADDRESSES.CC3.CREDIT_REGISTRY,
    CREDIT_REGISTRY_ABI,
    provider
  );

  // 1. Vault Global Accounting
  const [rawAssets, rawSupply, rawBorrowed] = await Promise.all([
    vaultContract.totalAssets().catch(() => 0n),
    vaultContract.totalSupply().catch(() => 0n),
    vaultContract.totalBorrowed().catch(() => 0n),
  ]);

  const totalAssets = BigInt(rawAssets || 0);
  const totalSupply = BigInt(rawSupply || 0);
  const totalBorrowed = BigInt(rawBorrowed || 0);

  const availableLiquidity: bigint =
    totalAssets >= totalBorrowed ? totalAssets - totalBorrowed : 0n;

  let sharePrice = '1.0000';
  if (totalSupply > 0n && totalAssets > 0n) {
    const rawRatio = (totalAssets * 10000n) / totalSupply;
    sharePrice = (Number(rawRatio) / 10000).toFixed(4);
  }

  let utilizationRate = 0;
  if (totalAssets > 0n) {
    utilizationRate = Math.min(100, Number((totalBorrowed * 10000n) / totalAssets) / 100);
  }

  const vault: VaultOverview = {
    totalAssets,
    totalAssetsFormatted: formatTokenBalance(totalAssets, 18, 2),
    totalSupply,
    totalSupplyFormatted: formatTokenBalance(totalSupply, 18, 2),
    totalBorrowed,
    totalBorrowedFormatted: formatTokenBalance(totalBorrowed, 18, 2),
    availableLiquidity,
    availableLiquidityFormatted: formatTokenBalance(availableLiquidity, 18, 2),
    sharePrice,
    utilizationRate,
  };

  // 2. User Specific Position (if account connected)
  let user: UserVaultPosition | undefined = undefined;

  if (account && ethers.isAddress(account)) {
    const checksummed = ethers.getAddress(account);

    const [
      rawShares,
      rawUsdcBalance,
      rawAllowance,
      loanData,
      profileData,
      dynamicApyBps,
    ] = await Promise.all([
      vaultContract.balanceOf(checksummed).catch(() => 0n),
      usdcContract.balanceOf(checksummed).catch(() => 0n),
      usdcContract.allowance(checksummed, CONTRACT_ADDRESSES.CC3.AETHER_VAULT_4626).catch(() => 0n),
      vaultContract.loans(checksummed).catch(() => [0n, 0n, 0, 0n]),
      registryContract.getCreditProfile(checksummed).catch(() => [0, 0n, 0, 0n, '0x0']),
      vaultContract.getDynamicApy(checksummed).catch(() => 650),
    ]);

    const shares = BigInt(rawShares || 0);
    const usdcBalance = BigInt(rawUsdcBalance || 0);
    const allowance = BigInt(rawAllowance || 0);

    let underlyingAssets = shares;
    if (shares > 0n) {
      try {
        const rawUnderlying = await vaultContract.convertToAssets(shares);
        underlyingAssets = BigInt(rawUnderlying || shares);
      } catch {
        underlyingAssets = shares;
      }
    }

    const principal = BigInt(loanData?.[0] || 0);
    const interestAccrued = BigInt(loanData?.[1] || 0);
    const totalDebtDue = principal + interestAccrued;

    const rawLastUpdated = BigInt(profileData?.[3] || 0n);
    const isAttested = rawLastUpdated > 0n;
    const lastUpdated = Number(rawLastUpdated);
    const lastProofHash = String(profileData?.[4] || '0x0');

    let creditScore = 0;
    let maxCreditLine = 0n;
    let availableCredit = 0n;
    let apyBps = 650;

    if (isAttested) {
      creditScore = Number(profileData?.[0]) || 620;
      maxCreditLine = BigInt(profileData?.[1] || 0n);
      availableCredit = maxCreditLine >= principal ? maxCreditLine - principal : 0n;
      apyBps = Number(profileData?.[2]) || Number(dynamicApyBps) || 650;
    } else {
      creditScore = 0;
      maxCreditLine = 0n;
      availableCredit = 0n;
      apyBps = Number(dynamicApyBps) || 650;
    }

    const borrowApyPercent = (apyBps / 100).toFixed(2);

    user = {
      shares,
      sharesFormatted: formatTokenBalance(shares, 18, 2),
      underlyingAssets,
      underlyingAssetsFormatted: formatTokenBalance(underlyingAssets, 18, 2),
      usdcBalance,
      usdcBalanceFormatted: formatTokenBalance(usdcBalance, 18, 2),
      allowance,
      allowanceFormatted: formatTokenBalance(allowance, 18, 2),
      borrowedPrincipal: principal,
      borrowedPrincipalFormatted: formatTokenBalance(principal, 18, 2),
      interestAccrued,
      interestAccruedFormatted: formatTokenBalance(interestAccrued, 18, 2),
      totalDebtDue,
      totalDebtDueFormatted: formatTokenBalance(totalDebtDue, 18, 2),
      creditScore,
      maxCreditLine,
      maxCreditLineFormatted: formatTokenBalance(maxCreditLine, 18, 2),
      availableCredit,
      availableCreditFormatted: formatTokenBalance(availableCredit, 18, 2),
      borrowApyBps: apyBps,
      borrowApyPercent,
      isAttested,
      lastUpdated,
      lastProofHash,
    };
  }

  return { vault, user };
}

/**
 * Approve AetherVault4626 to spend iUSDC.
 */
export async function approveVault(
  amount: bigint,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const usdc = new ethers.Contract(CONTRACT_ADDRESSES.CC3.MOCK_IUSDC, ERC20_ABI, signer);
  const tx = await usdc.approve(CONTRACT_ADDRESSES.CC3.AETHER_VAULT_4626, amount);
  return await tx.wait(1);
}

/**
 * Deposit iUSDC into AetherVault4626 to mint yield-bearing avUSD shares.
 */
export async function depositToVault(
  amount: bigint,
  receiver: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const vault = new ethers.Contract(
    CONTRACT_ADDRESSES.CC3.AETHER_VAULT_4626,
    AETHER_VAULT_ABI,
    signer
  );
  const tx = await vault.deposit(amount, receiver);
  return await tx.wait(1);
}

/**
 * Withdraw iUSDC from AetherVault4626 by burning avUSD shares.
 */
export async function withdrawFromVault(
  amount: bigint,
  receiver: string,
  vaultOwner: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const vault = new ethers.Contract(
    CONTRACT_ADDRESSES.CC3.AETHER_VAULT_4626,
    AETHER_VAULT_ABI,
    signer
  );
  const tx = await vault.withdraw(amount, receiver, vaultOwner);
  return await tx.wait(1);
}

/**
 * Borrow iUSDC uncollateralized loan from AetherVault4626 within on-chain credit line limit.
 */
export async function borrowFromVault(
  amount: bigint,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const vault = new ethers.Contract(
    CONTRACT_ADDRESSES.CC3.AETHER_VAULT_4626,
    AETHER_VAULT_ABI,
    signer
  );
  const tx = await vault.borrow(amount);
  return await tx.wait(1);
}

/**
 * Repay iUSDC loan principal and accrued interest to AetherVault4626.
 */
export async function repayToVault(
  amount: bigint,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt | null> {
  const vault = new ethers.Contract(
    CONTRACT_ADDRESSES.CC3.AETHER_VAULT_4626,
    AETHER_VAULT_ABI,
    signer
  );
  const tx = await vault.repay(amount);
  return await tx.wait(1);
}
