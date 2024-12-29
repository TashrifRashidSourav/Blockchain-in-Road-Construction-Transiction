const { ethers } = require("hardhat"); // Use Hardhat's ethers plugin

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Retrieve deployer's balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer's balance:", ethers.formatEther(balance)); // Updated for ethers@6.x

  // Replace these with actual Ethereum addresses
  const contractorAddress = "0x0000000000000000000000000000000000000001";
  const auditorAddress = "0x0000000000000000000000000000000000000002";

  const ConstructionProject = await ethers.getContractFactory("ConstructionProject");
  const contract = await ConstructionProject.deploy(
    contractorAddress,
    auditorAddress,
    ethers.parseEther("100") // Updated for ethers@6.x
  );

  await contract.waitForDeployment(); // Updated for ethers@6.x
  console.log("Contract deployed to:", await contract.getAddress()); // Updated for ethers@6.x
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
