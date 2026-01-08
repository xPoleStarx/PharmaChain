const hre = require("hardhat");

async function main() {
  console.log("Deploying PharmaChain contract...");

  const PharmaChain = await hre.ethers.getContractFactory("PharmaChain");
  const pharmachain = await PharmaChain.deploy();

  await pharmachain.waitForDeployment();

  const address = await pharmachain.getAddress();
  console.log("\n✅ PharmaChain deployed successfully!");
  console.log("Contract address:", address);
  
  console.log("\n📝 Add this to your .env file:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);
  console.log(`VITE_USE_REAL_BLOCKCHAIN=true`);
  console.log(`VITE_PROVIDER_URL=http://localhost:8545`);
  
  console.log("\n💡 To use the contract:");
  console.log("1. Make sure Hardhat node is running: npm run node");
  console.log("2. Set VITE_USE_REAL_BLOCKCHAIN=true in .env");
  console.log("3. Restart your frontend: npm run dev");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
