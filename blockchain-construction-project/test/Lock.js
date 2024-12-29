const { expect } = require("chai");
const ethers = require("ethers");

describe("Lock Contract", function () {
  let lock;
  let owner;
  let addr1;
  let unlockTime;

  beforeEach(async function () {
    // Get signers
    [owner, addr1] = await ethers.getSigners();
    
    // Set the unlock time to 1 hour from now
    unlockTime = (await ethers.provider.getBlock('latest')).timestamp + 3600;

    // Deploy the contract with 1 ether locked
    const Lock = await ethers.getContractFactory("Lock");
    lock = await Lock.deploy(unlockTime, { value: ethers.utils.parseEther("1") });
    await lock.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const balance = await ethers.provider.getBalance(lock.address);
      expect(balance).to.equal(ethers.utils.parseEther("1"));
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      const pastTime = (await ethers.provider.getBlock('latest')).timestamp - 3600;
      await expect(lock.deploy(pastTime, { value: ethers.utils.parseEther("1") }))
        .to.be.revertedWith("Unlock time should be in the future");
    });
  });

  describe("Withdrawals", function () {
    it("Should revert with the right error if called too soon", async function () {
      await expect(lock.connect(addr1).withdraw()).to.be.revertedWith("Only the owner can perform this action");
    });

    it("Should revert with the right error if called from another account", async function () {
      await expect(lock.connect(addr1).withdraw()).to.be.revertedWith("Only the owner can perform this action");
    });

    it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
      // Move forward in time to unlockTime
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine", []);

      await expect(lock.withdraw()).to.emit(lock, "Withdraw").withArgs(owner.address, ethers.utils.parseEther("1"));
    });

    it("Should transfer the funds to the owner", async function () {
      // Move forward in time to unlockTime
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine", []);

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await lock.withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.above(initialBalance);
    });
  });
});
