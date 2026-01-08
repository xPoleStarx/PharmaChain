const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * @title PharmaChain Contract Smoke Tests
 * @notice Basic deployment and initialization tests
 * @dev These tests verify that the contract can be deployed and basic functions exist
 */
describe("PharmaChain", function () {
  let pharmachain;
  let owner;
  let manufacturer;

  beforeEach(async function () {
    // Get signers
    [owner, manufacturer] = await ethers.getSigners();

    // Deploy contract
    const PharmaChain = await ethers.getContractFactory("PharmaChain");
    pharmachain = await PharmaChain.deploy();
    await pharmachain.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(pharmachain.target).to.be.properAddress;
    });

    it("Should set deployer as owner", async function () {
      expect(await pharmachain.owner()).to.equal(owner.address);
    });

    it("Should set deployer as authorized manufacturer", async function () {
      expect(await pharmachain.authorizedManufacturers(owner.address)).to.be.true;
    });

    it("Should have correct temperature constants", async function () {
      expect(await pharmachain.TEMP_MIN()).to.equal(20); // 2.0°C * 10
      expect(await pharmachain.TEMP_MAX()).to.equal(80); // 8.0°C * 10
    });
  });

  describe("Contract Interface", function () {
    it("Should have registerDrug function", async function () {
      expect(pharmachain.registerDrug).to.be.a("function");
    });

    it("Should have transferDrug function", async function () {
      expect(pharmachain.transferDrug).to.be.a("function");
    });

    it("Should have updateTemperature function", async function () {
      expect(pharmachain.updateTemperature).to.be.a("function");
    });

    it("Should have updateLocation function", async function () {
      expect(pharmachain.updateLocation).to.be.a("function");
    });

    it("Should have getDrug function", async function () {
      expect(pharmachain.getDrug).to.be.a("function");
    });

    it("Should have getAllDrugHistory function", async function () {
      expect(pharmachain.getAllDrugHistory).to.be.a("function");
    });
  });
});
