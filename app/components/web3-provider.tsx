'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  CREDITCOIN_CC3_TESTNET,
  CONTRACT_ADDRESSES,
  ERC20_ABI,
  EIP6963ProviderDetail,
  EIP6963AnnounceProviderEvent,
  EIP6963ProviderInfo,
  formatTokenBalance,
} from '@/lib/web3-config';

interface Web3ContextValue {
  account: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  nativeBalance: string;
  usdcBalance: string;
  isConnecting: boolean;
  error: string | null;
  discoveredWallets: EIP6963ProviderDetail[];
  activeWalletInfo: EIP6963ProviderInfo | null;
  connectWallet: (rdns?: string) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  refreshBalances: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextValue | null>(null);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [nativeBalance, setNativeBalance] = useState<string>('0.0000');
  const [usdcBalance, setUsdcBalance] = useState<string>('0.0000');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discoveredWallets, setDiscoveredWallets] = useState<EIP6963ProviderDetail[]>([]);
  const [activeWalletInfo, setActiveWalletInfo] = useState<EIP6963ProviderInfo | null>(null);
  const [rawEipProvider, setRawEipProvider] = useState<any>(null);

  const isCorrectNetwork = chainId === CREDITCOIN_CC3_TESTNET.chainIdDecimal;

  // 1. EIP-6963 Wallet Discovery
  useEffect(() => {
    const handleAnnounce = (event: Event) => {
      const announceEvent = event as EIP6963AnnounceProviderEvent;
      if (announceEvent.detail && announceEvent.detail.info) {
        setDiscoveredWallets((prev) => {
          const exists = prev.some((w) => w.info.uuid === announceEvent.detail.info.uuid);
          if (exists) return prev;
          return [...prev, announceEvent.detail];
        });
      }
    };

    window.addEventListener('eip6963:announceProvider', handleAnnounce);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnounce);
    };
  }, []);

  // 2. Fetch Account Balances (Native tCTC + iUSDC on Creditcoin CC3)
  const refreshBalances = useCallback(async () => {
    if (!account) return;

    try {
      // Query Creditcoin CC3 node directly for guaranteed accurate testnet balances
      const cc3RpcProvider = new ethers.JsonRpcProvider(CREDITCOIN_CC3_TESTNET.rpcUrls[0]);

      // Native tCTC balance on Creditcoin CC3
      const rawNative = await cc3RpcProvider.getBalance(account);
      setNativeBalance(formatTokenBalance(rawNative, 18, 4));

      // iUSDC token balance on Creditcoin CC3
      try {
        const usdcContract = new ethers.Contract(
          CONTRACT_ADDRESSES.CC3.MOCK_IUSDC,
          ERC20_ABI,
          cc3RpcProvider
        );
        const rawUsdc = await usdcContract.balanceOf(account);
        setUsdcBalance(formatTokenBalance(rawUsdc, 18, 2));
      } catch {
        setUsdcBalance('0.00');
      }
    } catch (err: any) {
      console.warn('Error fetching Web3 balances from CC3 RPC:', err);
    }
  }, [account]);

  // 3. Switch / Add Creditcoin CC3 Network
  const switchNetwork = useCallback(async () => {
    if (!rawEipProvider && typeof window !== 'undefined' && !(window as any).ethereum) {
      setError('No Web3 wallet detected');
      return;
    }

    const targetProvider = rawEipProvider || (window as any).ethereum;

    try {
      await targetProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CREDITCOIN_CC3_TESTNET.chainId }],
      });
      setError(null);
      setChainId(CREDITCOIN_CC3_TESTNET.chainIdDecimal);
      const newProvider = new ethers.BrowserProvider(targetProvider, 'any');
      setProvider(newProvider);
      refreshBalances();
    } catch (switchErr: any) {
      // Error 4902 means the chain has not been added to the wallet
      if (switchErr.code === 4902 || switchErr.data?.originalError?.code === 4902) {
        try {
          await targetProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: CREDITCOIN_CC3_TESTNET.chainId,
                chainName: CREDITCOIN_CC3_TESTNET.chainName,
                nativeCurrency: CREDITCOIN_CC3_TESTNET.nativeCurrency,
                rpcUrls: CREDITCOIN_CC3_TESTNET.rpcUrls,
                blockExplorerUrls: CREDITCOIN_CC3_TESTNET.blockExplorerUrls,
              },
            ],
          });
          setError(null);
          setChainId(CREDITCOIN_CC3_TESTNET.chainIdDecimal);
          const newProvider = new ethers.BrowserProvider(targetProvider, 'any');
          setProvider(newProvider);
          refreshBalances();
        } catch (addErr: any) {
          console.error('Failed to add Creditcoin CC3 network:', addErr);
          setError(addErr.message || 'Failed to add Creditcoin CC3 network');
        }
      } else {
        console.error('Failed to switch to Creditcoin CC3 network:', switchErr);
        setError(switchErr.message || 'Failed to switch network');
      }
    }
  }, [rawEipProvider, refreshBalances]);

  // 4. Connect Wallet (EIP-6963 selected or fallback)
  const connectWallet = useCallback(
    async (rdns?: string) => {
      setIsConnecting(true);
      setError(null);

      try {
        let selectedProvider: any = null;
        let selectedInfo: EIP6963ProviderInfo | null = null;

        if (rdns) {
          const matched = discoveredWallets.find((w) => w.info.rdns === rdns);
          if (matched) {
            selectedProvider = matched.provider;
            selectedInfo = matched.info;
          }
        }

        // Fallback to window.ethereum if not explicitly selected from EIP-6963 list
        if (!selectedProvider) {
          if (typeof window !== 'undefined' && (window as any).ethereum) {
            selectedProvider = (window as any).ethereum;
            selectedInfo = {
              uuid: 'injected-fallback',
              name: 'Injected Web3 Wallet',
              icon: '',
              rdns: 'injected.browser',
            };
          } else {
            throw new Error('No compatible Web3 wallet detected in browser.');
          }
        }

        setRawEipProvider(selectedProvider);
        setActiveWalletInfo(selectedInfo);

        // Use 'any' network to avoid ethers v6 NETWORK_ERROR on chain changes
        const browserProvider = new ethers.BrowserProvider(selectedProvider, 'any');
        let accounts: string[] = [];

        // Attempt wallet_requestPermissions to trigger account picker popup in MetaMask/EIP-1193
        try {
          if (typeof selectedProvider.request === 'function') {
            await selectedProvider.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }],
            });
          }
          accounts = await browserProvider.send('eth_accounts', []);
        } catch {
          // Fallback to standard eth_requestAccounts
          accounts = await browserProvider.send('eth_requestAccounts', []);
        }

        if (!accounts || accounts.length === 0) {
          accounts = await browserProvider.send('eth_requestAccounts', []);
        }

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts selected by user.');
        }

        const network = await browserProvider.getNetwork();
        const signerInstance = await browserProvider.getSigner();

        setProvider(browserProvider);
        setSigner(signerInstance);
        setAccount(ethers.getAddress(accounts[0]));
        setChainId(Number(network.chainId));

        // If not on CC3, prompt automatic switch
        if (Number(network.chainId) !== CREDITCOIN_CC3_TESTNET.chainIdDecimal) {
          try {
            await selectedProvider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: CREDITCOIN_CC3_TESTNET.chainId }],
            });
            setChainId(CREDITCOIN_CC3_TESTNET.chainIdDecimal);
          } catch (autoSwitchErr: any) {
            console.warn('Auto network switch on connect rejected:', autoSwitchErr);
          }
        }
      } catch (err: any) {
        console.error('Wallet connection error:', err);
        setError(err.message || 'Failed to connect wallet');
      } finally {
        setIsConnecting(false);
      }
    },
    [discoveredWallets]
  );

  // 5. Disconnect Wallet (with EIP-2255 permission revocation)
  const disconnectWallet = useCallback(async () => {
    try {
      if (rawEipProvider && typeof rawEipProvider.request === 'function') {
        await rawEipProvider.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (revokeErr) {
      console.warn('wallet_revokePermissions not supported or rejected:', revokeErr);
    }

    setAccount(null);
    setSigner(null);
    setProvider(null);
    setRawEipProvider(null);
    setActiveWalletInfo(null);
    setNativeBalance('0.0000');
    setUsdcBalance('0.0000');
    setError(null);
  }, [rawEipProvider]);

  // 6. Active Provider Event Listeners (accountsChanged, chainChanged)
  useEffect(() => {
    if (!rawEipProvider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(ethers.getAddress(accounts[0]));
      }
    };

    const handleChainChanged = async (chainIdHex: string) => {
      const parsedChainId =
        typeof chainIdHex === 'string' && chainIdHex.startsWith('0x')
          ? parseInt(chainIdHex, 16)
          : Number(chainIdHex);
      setChainId(parsedChainId);

      // Re-initialize provider on new chain to prevent ethers v6 NETWORK_ERROR
      const newProvider = new ethers.BrowserProvider(rawEipProvider, 'any');
      setProvider(newProvider);
      try {
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);
      } catch {
        // Signer re-fetch fallback
      }
      refreshBalances();
    };

    if (rawEipProvider.on) {
      rawEipProvider.on('accountsChanged', handleAccountsChanged);
      rawEipProvider.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (rawEipProvider.removeListener) {
        rawEipProvider.removeListener('accountsChanged', handleAccountsChanged);
        rawEipProvider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [rawEipProvider, disconnectWallet, refreshBalances]);

  // 7. Balance Polling Effect
  useEffect(() => {
    if (account) {
      refreshBalances();
      const interval = setInterval(refreshBalances, 10000);
      return () => clearInterval(interval);
    }
  }, [account, chainId, refreshBalances]);

  const value: Web3ContextValue = {
    account,
    chainId,
    isCorrectNetwork,
    provider,
    signer,
    nativeBalance,
    usdcBalance,
    isConnecting,
    error,
    discoveredWallets,
    activeWalletInfo,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalances,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
