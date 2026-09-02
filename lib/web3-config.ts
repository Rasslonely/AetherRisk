// Web3 Network Configuration & EIP-6963 Type Declarations

export interface ChainConfig {
  chainId: string; // Hex format, e.g., '0x18e8f'
  chainIdDecimal: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const CREDITCOIN_CC3_TESTNET: ChainConfig = {
  chainId: '0x18e8f', // 102031
  chainIdDecimal: 102031,
  chainName: 'Creditcoin CC3 Testnet',
  nativeCurrency: {
    name: 'Testnet CTC',
    symbol: 'tCTC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.cc3-testnet.creditcoin.network/'],
  blockExplorerUrls: ['https://creditcoin-testnet.blockscout.com'],
};

export const SEPOLIA_TESTNET: ChainConfig = {
  chainId: '0xaa36a7', // 11155111
  chainIdDecimal: 11155111,
  chainName: 'Ethereum Sepolia',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

// Verified On-Chain Deployed Smart Contracts
export const CONTRACT_ADDRESSES = {
  CC3: {
    CREDIT_REGISTRY: '0x592380E737758285C809F92e8De176C7ECBC1015',
    AETHER_RISK_ASC: '0xcEA97078e28946Df30436f163E74c3b175D98197',
    AETHER_VAULT_4626: '0xD9B3F2C699fCfC219d35F7709245312a621eFd39',
    MOCK_IUSDC: '0xb906ae7ec832814922FCEEd270e0A7A1A2657397',
  },
  SEPOLIA: {
    SEPOLIA_EMITTER: '0x592380E737758285C809F92e8De176C7ECBC1015',
  },
} as const;

// Minimal ERC-20 ABI for balance checks & approvals
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount) external',
];

// Complete AetherVault4626 ABI
export const AETHER_VAULT_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function asset() view returns (address)',
  'function totalAssets() view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function totalBorrowed() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function convertToShares(uint256 assets) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function previewDeposit(uint256 assets) view returns (uint256)',
  'function previewWithdraw(uint256 assets) view returns (uint256)',
  'function deposit(uint256 assets, address receiver) returns (uint256)',
  'function withdraw(uint256 assets, address receiver, address vaultOwner) returns (uint256)',
  'function borrow(uint256 amount) returns (bool)',
  'function repay(uint256 amount) returns (bool)',
  'function getDynamicApy(address borrower) view returns (uint16)',
  'function loans(address borrower) view returns (uint256 principal, uint256 interestAccrued, uint16 apyBps, uint256 lastAccrual)',
];

// Complete CreditRegistry ABI
export const CREDIT_REGISTRY_ABI = [
  'function getScore(address borrower) view returns (uint16 score, uint256 maxCreditLine, uint16 apyBps)',
  'function getCreditProfile(address borrower) view returns (uint16 score, uint256 maxCreditLine, uint16 apyBps, uint256 lastUpdated, bytes32 lastProofHash)',
  'function authorizedEnclaveSigners(address signer) view returns (bool)',
  'function enclaveNonces(address signer) view returns (uint256)',
];

// ==========================================
// EIP-6963 Multi-Injected Provider Types
// ==========================================

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any; // EIP-1193 provider
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: 'eip6963:announceProvider';
  detail: EIP6963ProviderDetail;
}

export function formatAddress(address: string, digits = 4): string {
  if (!address) return '';
  return `${address.substring(0, digits + 2)}...${address.substring(address.length - digits)}`;
}

export function formatTokenBalance(amount: bigint | string | number, decimals = 18, precision = 4): string {
  try {
    const rawVal = typeof amount === 'bigint' ? amount : BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const integerPart = rawVal / divisor;
    const remainder = rawVal % divisor;
    const paddedRemainder = remainder.toString().padStart(decimals, '0');
    const decimalSub = paddedRemainder.substring(0, precision);
    return `${integerPart.toLocaleString('en-US')}.${decimalSub}`;
  } catch {
    return '0.0000';
  }
}
