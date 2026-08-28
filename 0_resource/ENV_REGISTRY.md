# AETHERRISK: ENVIRONMENT REGISTRY & NETWORK MATRIX
> **Network:** Creditcoin CC3 Testnet & Ethereum Sepolia | **Standard:** Multi-Chain Registry v6.0

---

## 1. PUBLIC RPC ENDPOINTS & NETWORK IDENTIFIERS

| Network Name | EVM Chain ID | Attestcoin ChainKey | Public RPC URL | WebSocket Endpoint |
| :--- | :---: | :---: | :--- | :--- |
| **Creditcoin CC3 Testnet** | `102031` | `N/A` (Destination) | `https://rpc.cc3-testnet.creditcoin.network` | `wss://rpc.cc3-testnet.creditcoin.network` |
| **Ethereum Sepolia** | `11155111` | `1` | `https://sepolia.infura.io/v3/${INFURA_API_KEY}` | `wss://sepolia.infura.io/ws/v3/${INFURA_API_KEY}` |
| **Creditcoin CC3 Mainnet** | `102030` | `N/A` (Destination) | `https://mainnet3.creditcoin.network` | `wss://mainnet3.creditcoin.network` |
| **Ethereum Mainnet** | `1` | `1` (Mainnet) / `3` (Testnet)| `https://mainnet.infura.io/v3/${INFURA_API_KEY}` | `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}` |

---

## 2. SPONSOR PRECOMPILES & INFRASTRUCTURE CONTRACTS

| Contract / Precompile Name | Deployed Address | Network | Purpose & Documentation Link |
| :--- | :--- | :--- | :--- |
| **BlockProver Precompile** | `0x0000000000000000000000000000000000000FD2` | CC3 Testnet & Mainnet | Synchronous Merkle & continuity proof verifier ([Docs](https://docs.creditcoin.org/attestcoin-protocol)) |
| **ChainInfo Precompile** | `0x0000000000000000000000000000000000000FD3` | CC3 Testnet & Mainnet | Source chain attestation height & metadata registry |
| **EvmV1Decoder Contract** | `0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f` | CC3 Testnet | ABI-decoding library for transaction bytes and event logs |
| **EvmV1Decoder (Mainnet)** | `0x9D094C9f22B10FCf842c2fC6A0981630A4F94B5C` | CC3 Mainnet | Production decoder address |
| **Attestcoin ProofBuilder API** | `https://prover.cc3-testnet.creditcoin.network` | Hosted Cloud API | Computes and caches inclusion proofs for Sepolia blocks |
| **ASC Testnet Dashboard** | `https://dashboard.cc3-testnet.creditcoin.network/` | Web Console | Live monitoring of validator attestations and heights |

---

## 3. DEPLOYED APPLICATION CONTRACTS (AETHERRISK ECOSYSTEM)

| Contract Name | Target Network | Expected Address / Deployed Address | Role in Dual-Engine Architecture |
| :--- | :--- | :--- | :--- |
| **`AetherRiskASC.sol`** | Creditcoin CC3 Testnet | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | Primary ASC caller to Precompile `0xFD2` |
| **`CreditRegistry.sol`** | Creditcoin CC3 Testnet | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` | On-chain credit score registry & TEE trust boundary |
| **`AetherVault4626.sol`** | Creditcoin CC3 Testnet | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` | ERC-4626 dynamic-rate institutional lending vault |
| **`SepoliaLendingEmitter.sol`** | Ethereum Sepolia | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` | Emits `LoanRepaid` and `CollateralAdded` events |

---

## 4. EXPLORER, DASHBOARD & FAUCET URLS

| Resource | URL | Notes |
| :--- | :--- | :--- |
| **Creditcoin CC3 Testnet Explorer** | `https://creditcoin-testnet.subscan.io` | Block explorer for verified ASC transactions |
| **Ethereum Sepolia Etherscan** | `https://sepolia.etherscan.io` | Source chain transaction explorer |
| **Creditcoin CC3 Testnet Faucet** | `https://faucet.cc3-testnet.creditcoin.network` | Native tCTC testnet tokens for gas |
| **Ethereum Sepolia Faucet** | `https://sepoliafaucet.com` / `https://faucets.chain.link` | Testnet Sepolia ETH for event triggers |
| **Phala dstack Enclave Explorer** | `https://phala.network` | TEE hardware remote attestation verification |

---

## 5. ENVIRONMENT VARIABLES SPECIFICATION (`.env.local`)

```bash
# ==========================================
# AETHERRISK ENVIRONMENT CONFIGURATION
# ==========================================

# Database Connection (Neon / Supabase Serverless Pooling)
DATABASE_URL="postgresql://postgres.xxx:yyy@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:yyy@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Creditcoin CC3 Network Configuration
NEXT_PUBLIC_CC3_RPC_URL="https://rpc.cc3-testnet.creditcoin.network"
NEXT_PUBLIC_CC3_CHAIN_ID="102031"
NEXT_PUBLIC_PROVER_API_URL="https://prover.cc3-testnet.creditcoin.network"
NEXT_PUBLIC_BLOCK_PROVER_PRECOMPILE="0x0000000000000000000000000000000000000FD2"
NEXT_PUBLIC_CHAIN_INFO_PRECOMPILE="0x0000000000000000000000000000000000000FD3"
NEXT_PUBLIC_DECODER_CONTRACT="0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f"

# Deployed Application Contracts (CC3 Testnet)
NEXT_PUBLIC_AETHER_RISK_ASC_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
NEXT_PUBLIC_CREDIT_REGISTRY_ADDRESS="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
NEXT_PUBLIC_AETHER_VAULT_ADDRESS="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

# Source Chain (Ethereum Sepolia)
NEXT_PUBLIC_SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
NEXT_PUBLIC_SEPOLIA_CHAIN_ID="11155111"
NEXT_PUBLIC_SEPOLIA_CHAIN_KEY="1"
NEXT_PUBLIC_SEPOLIA_EMITTER_ADDRESS="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"

# TEE Enclave Configuration (Level 1 Signer Key)
ENCLAVE_SIGNER_PRIVATE_KEY="your_secp256k1_private_key_here_for_local_testing"
NEXT_PUBLIC_ENCLAVE_SIGNER_ADDRESS="0x90F79bf6EB2c4f870365E785982E1f101E93b906"

# App Mode
NEXT_PUBLIC_SANDBOX_DEFAULT_SOURCE="CACHED_REAL_PROOF"
```
