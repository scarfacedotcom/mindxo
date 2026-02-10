import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Paymaster address (from src/config/contracts.ts or env)
    // Default to a placeholder if not set, but user should verify.
    // Using the address found in the existing contracts.ts as reference or generic placeholder.
    // In `src/config/contracts.ts`, it implies PAYMASTER is a specific address.
    // Let's assume the deployer is the paymaster for now in a fresh deployment, or accept an env var.
    // The contract constructor: constructor(address _paymaster, address _usdc)

    // Base Mainnet USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
    // Base Sepolia USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e (Example, need to verify or use a mock for testnet)

    const USDC_ADDRESS = process.env.USDC_ADDRESS || "0x0215E78217115CAbeCa769c3c25DAAa4c27Ee6dC";
    const PAYMASTER_ADDRESS = process.env.PAYMASTER_ADDRESS || deployer.address;

    console.log("Using USDC Address:", USDC_ADDRESS);
    console.log("Using Paymaster Address:", PAYMASTER_ADDRESS);

    const TicTacToeEscrow = await ethers.getContractFactory("TicTacToeEscrow");
    const escrow = await TicTacToeEscrow.deploy(PAYMASTER_ADDRESS, USDC_ADDRESS);

    await escrow.waitForDeployment();

    console.log("TicTacToeEscrow deployed to:", await escrow.getAddress());
    console.log("Constructor Args:", PAYMASTER_ADDRESS, USDC_ADDRESS);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
