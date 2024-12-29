const ConstructionProject = artifacts.require("ConstructionProject");

contract("ConstructionProject", accounts => {
  it("should deploy successfully", async () => {
    const contract = await ConstructionProject.deployed();
    assert(contract.address !== "");
  });
});