import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

// Artifact Paths
const CONTRACTS_OUT = path.join(process.cwd(), 'contracts', 'out');

function loadArtifact(contractName: string, fileName?: string) {
  const file = fileName || `${contractName}.sol`;
  const artifactPath = path.join(CONTRACTS_OUT, file, `${contractName}.json`);
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Run 'forge build' first.`);
  }
  const raw = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  return {
    abi: raw.abi,
    bytecode: raw.bytecode.object,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const networkArg = args.find((a) => a.startsWith('--network='))?.split('=')[1] || 'cc3';
  const privateKeyArg =
    args.find((a) => a.startsWith('--private-key='))?.split('=')[1] ||
    process.env.DEPLOYER_PRIVATE_KEY ||
    '0000000000000000000000000000000000000000000000000000000000000001';

  const cleanKey = privateKeyArg.startsWith('0x') ? privateKeyArg : `0x${privateKeyArg}`;

  console.log(`\n==================================================`);
  console.log(`🚀 AetherRisk Autonomous Contract Deployer`);
  console.log(`Target Network: ${networkArg.toUpperCase()}`);
  console.log(`==================================================\n`);

  if (networkArg === 'cc3') {
    const rpcUrl = 'https://rpc.cc3-testnet.creditcoin.network';
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(cleanKey, provider);
    const deployerAddress = await wallet.getAddress();
    const balance = await provider.getBalance(deployerAddress);

    console.log(`Deployer Address : ${deployerAddress}`);
    console.log(`Wallet Balance   : ${ethers.formatEther(balance)} CTC`);

    if (balance === 0n) {
      console.warn(
        `\n⚠️ WARNING: Wallet balance is 0 CTC! Please claim testnet CTC from the Creditcoin faucet first.`
      );
    }

    const enclaveSigner = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
    const hardwareId = ethers.keccak256(ethers.toUtf8Bytes('AMD-SEV-SNP-PHALA-DSTACK-NODE-01'));
    const evmV1Decoder = '0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f';

    console.log(`\n[1/4] Deploying CreditRegistry...`);
    const regArt = loadArtifact('CreditRegistry');
    const regFactory = new ethers.ContractFactory(regArt.abi, regArt.bytecode, wallet);
    const regContract = await regFactory.deploy(enclaveSigner, hardwareId);
    await regContract.waitForDeployment();
    const regAddress = await regContract.getAddress();
    console.log(`✅ CreditRegistry deployed at: ${regAddress}`);

    console.log(`\n[2/4] Deploying AetherRiskASC (Attestcoin Query Precompile 0xFD2)...`);
    const ascArt = loadArtifact('AetherRiskASC');
    const ascFactory = new ethers.ContractFactory(ascArt.abi, ascArt.bytecode, wallet);
    const ascContract = await ascFactory.deploy(evmV1Decoder, regAddress);
    await ascContract.waitForDeployment();
    const ascAddress = await ascContract.getAddress();
    console.log(`✅ AetherRiskASC deployed at: ${ascAddress}`);

    console.log(`\n[3/4] Deploying MockInstitutionalUSDC (iUSDC)...`);
    const tokenArt = loadArtifact('MockInstitutionalUSDC', 'DeployCreditcoin.s.sol');
    const tokenFactory = new ethers.ContractFactory(tokenArt.abi, tokenArt.bytecode, wallet);
    const tokenContract = await tokenFactory.deploy();
    await tokenContract.waitForDeployment();
    const tokenAddress = await tokenContract.getAddress();
    console.log(`✅ MockInstitutionalUSDC deployed at: ${tokenAddress}`);

    console.log(`\n[4/4] Deploying AetherVault4626 (Dynamic Lending Vault)...`);
    const vaultArt = loadArtifact('AetherVault4626');
    const vaultFactory = new ethers.ContractFactory(vaultArt.abi, vaultArt.bytecode, wallet);
    const vaultContract = await vaultFactory.deploy(tokenAddress, regAddress);
    await vaultContract.waitForDeployment();
    const vaultAddress = await vaultContract.getAddress();
    console.log(`✅ AetherVault4626 deployed at: ${vaultAddress}`);

    console.log(`\n==================================================`);
    console.log(`🎉 Creditcoin CC3 Deployment Successful!`);
    console.log(`==================================================`);
    console.log(`NEXT_PUBLIC_CREDIT_REGISTRY_ADDRESS="${regAddress}"`);
    console.log(`NEXT_PUBLIC_AETHER_RISK_ASC_ADDRESS="${ascAddress}"`);
    console.log(`NEXT_PUBLIC_AETHER_VAULT_ADDRESS="${vaultAddress}"`);
    console.log(`NEXT_PUBLIC_USDC_ADDRESS="${tokenAddress}"\n`);
  } else if (networkArg === 'sepolia') {
    const rpcUrl = 'https://ethereum-sepolia.publicnode.com';
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(cleanKey, provider);
    const deployerAddress = await wallet.getAddress();
    const balance = await provider.getBalance(deployerAddress);

    console.log(`Deployer Address : ${deployerAddress}`);
    console.log(`Wallet Balance   : ${ethers.formatEther(balance)} Sepolia ETH`);

    if (balance === 0n) {
      console.warn(
        `\n⚠️ WARNING: Wallet balance is 0 ETH! Please claim Sepolia ETH from a faucet first.`
      );
    }

    console.log(`\n[1/1] Deploying SepoliaLendingEmitter...`);
    const emitterArt = loadArtifact('SepoliaLendingEmitter');
    const emitterFactory = new ethers.ContractFactory(emitterArt.abi, emitterArt.bytecode, wallet);
    const emitterContract = await emitterFactory.deploy();
    await emitterContract.waitForDeployment();
    const emitterAddress = await emitterContract.getAddress();
    console.log(`✅ SepoliaLendingEmitter deployed at: ${emitterAddress}`);

    console.log(`\n==================================================`);
    console.log(`🎉 Ethereum Sepolia Deployment Successful!`);
    console.log(`==================================================`);
    console.log(`NEXT_PUBLIC_SEPOLIA_EMITTER_ADDRESS="${emitterAddress}"\n`);
  } else {
    console.error(`Unknown network: ${networkArg}. Use --network=cc3 or --network=sepolia.`);
  }
}

main().catch((err) => {
  console.error('\n❌ Deployment Error:', err.message || err);
  process.exit(1);
});
