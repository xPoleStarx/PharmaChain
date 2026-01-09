const hre = require("hardhat");

async function main() {
  const network = hre.network.name;
  console.log(`\n🚀 Deploying PharmaChain contract to ${network}...`);

  const PharmaChain = await hre.ethers.getContractFactory("PharmaChain");
  const pharmachain = await PharmaChain.deploy();

  await pharmachain.waitForDeployment();

  const address = await pharmachain.getAddress();
  console.log("\n✅ PharmaChain deployed successfully!");
  console.log("📍 Contract address:", address);

  // Network-specific instructions
  if (network === "sepolia") {
    console.log("\n🔗 View on Etherscan:");
    console.log(`https://sepolia.etherscan.io/address/${address}`);

    console.log("\n📝 Add this to your .env file:");
    console.log(`VITE_CONTRACT_ADDRESS=${address}`);
    console.log(`VITE_USE_REAL_BLOCKCHAIN=true`);
    console.log(`VITE_PROVIDER_URL=${process.env.SEPOLIA_RPC_URL}`);

    console.log("\n💡 Next steps:");
    console.log("1. Update .env with the contract address above");
    console.log("2. Restart your frontend: npm run dev");
    console.log("3. Switch MetaMask to Sepolia network");
    console.log("4. Connect wallet and test drug registration");

    console.log("\n⏳ Waiting for block confirmations...");
    await pharmachain.deploymentTransaction().wait(5);
    console.log("✅ Contract confirmed on blockchain!");

  } else if (network === "localhost" || network === "hardhat") {
    console.log("\n📝 Add this to your .env file:");
    console.log(`VITE_CONTRACT_ADDRESS=${address}`);
    console.log(`VITE_USE_REAL_BLOCKCHAIN=true`);
    console.log(`VITE_PROVIDER_URL=http://localhost:8545`);

    console.log("\n💡 To use the contract:");
    console.log("1. Make sure Hardhat node is running: npm run node");
    console.log("2. Set VITE_USE_REAL_BLOCKCHAIN=true in .env");
    console.log("3. Restart your frontend: npm run dev");
  }

  console.log("\n🎉 Deployment complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
