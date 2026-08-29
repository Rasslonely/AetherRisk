import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { CREDITCOIN_CC3_TESTNET, CONTRACT_ADDRESSES, ERC20_ABI } from '@/lib/web3-config';

const DEFAULT_DISPENSER_KEY =
  '0000000000000000000000000000000000000000000000000000000000000001';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { recipient } = body;

    if (!recipient || !ethers.isAddress(recipient)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing Ethereum recipient address.' },
        { status: 400 }
      );
    }

    const checksummedRecipient = ethers.getAddress(recipient);
    const privateKeyRaw =
      process.env.FAUCET_DISPENSER_PRIVATE_KEY ||
      process.env.DEPLOYER_PRIVATE_KEY ||
      DEFAULT_DISPENSER_KEY;

    const privateKey = privateKeyRaw.startsWith('0x') ? privateKeyRaw : `0x${privateKeyRaw}`;

    // Connect to Creditcoin CC3 Testnet Node
    const provider = new ethers.JsonRpcProvider(CREDITCOIN_CC3_TESTNET.rpcUrls[0]);
    const dispenserWallet = new ethers.Wallet(privateKey, provider);

    const tokenContract = new ethers.Contract(
      CONTRACT_ADDRESSES.CC3.MOCK_IUSDC,
      ERC20_ABI,
      dispenserWallet
    );

    const claimAmountTokens = ethers.parseUnits('10000', 18);
    let gasTxHash: string | null = null;
    let nextNonce = await provider.getTransactionCount(dispenserWallet.address, 'pending');

    // Check recipient's native tCTC balance. If under 0.1 tCTC, dispense 0.5 tCTC for gas
    try {
      const recipientNativeBalance = await provider.getBalance(checksummedRecipient);
      const minGasThreshold = ethers.parseEther('0.1');

      if (recipientNativeBalance < minGasThreshold) {
        const gasTx = await dispenserWallet.sendTransaction({
          to: checksummedRecipient,
          value: ethers.parseEther('0.5'),
          nonce: nextNonce,
        });
        gasTxHash = gasTx.hash;
        nextNonce += 1;
      }
    } catch (gasErr: any) {
      console.warn('Native gas disbursement skipped or failed:', gasErr.message);
    }

    // Transfer 10,000 iUSDC to recipient
    const tx = await tokenContract.transfer(checksummedRecipient, claimAmountTokens, {
      nonce: nextNonce,
    });
    const receipt = await tx.wait(1);

    const explorerUrl = `${CREDITCOIN_CC3_TESTNET.blockExplorerUrls[0]}/tx/${receipt.hash}`;

    return NextResponse.json({
      success: true,
      recipient: checksummedRecipient,
      amount: '10,000',
      assetSymbol: 'iUSDC',
      assetAddress: CONTRACT_ADDRESSES.CC3.MOCK_IUSDC,
      network: CREDITCOIN_CC3_TESTNET.chainName,
      chainId: CREDITCOIN_CC3_TESTNET.chainIdDecimal,
      txHash: receipt.hash,
      explorerUrl,
      gasSent: !!gasTxHash,
      gasTxHash,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Faucet disbursement error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to dispense testnet capital from Creditcoin CC3 faucet.',
      },
      { status: 500 }
    );
  }
}
