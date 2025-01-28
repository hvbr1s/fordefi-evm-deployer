import hre from "hardhat";
import "@nomicfoundation/hardhat-ethers";
import { HttpNetworkUserConfig } from "hardhat/types";
import { EvmChainId, FordefiWeb3Provider } from "@fordefi/web3-provider";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// FORDEFI secrets
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()
const FORDEFI_API_USER_TOKEN = process.env.FORDEFI_API_USER_TOKEN ?? 
  (() => { throw new Error('FORDEFI_API_USER_TOKEN environment variable is not set') })();
const privateKeyFilePath = './fordefi_secret/private.pem';
const PEM_PRIVATE_KEY = fs.readFileSync(privateKeyFilePath, 'utf8');

// Some vars...
const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const LockModule = buildModule("LockModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

  const lock = m.contract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  return { lock };
});

export default LockModule;

// async function main() {
//     const networkConfig = hre.network.config as HttpNetworkUserConfig;
//     const fordefiProvider = new FordefiWeb3Provider({
//       address: "0x8BFCF9e2764BC84DE4BBd0a0f5AAF19F47027A73",
//       apiUserToken: FORDEFI_API_USER_TOKEN,
//       apiPayloadSignKey: PEM_PRIVATE_KEY,
//       chainId: networkConfig.chainId as EvmChainId,
//       rpcUrl: networkConfig.url,
//     });
//     const provider = new hre.ethers.BrowserProvider(fordefiProvider);
//     const signer = await provider.getSigner();
//     const factory = await hre.ethers.getContractFactory("Lock", signer);
//     console.log('Deploying Lock...');
//     // Deploy contract with values. 
//     const lock = await factory.deploy(JAN_1ST_2030, { value: ONE_GWEI });
//     await lock.waitForDeployment();
//     console.log('Lock deployed to:', await lock.getAddress());
// }

// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });