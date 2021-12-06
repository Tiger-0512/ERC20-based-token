const Dai = artifacts.require("Dai");
const Link = artifacts.require("Link");

const BN = require("bn.js");
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-bn")(BN));

const truffleAssert = require("truffle-assertions");

const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), "ether");

contract("ERC20 token test", (accounts) => {
  let dai, link;

  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];

  before(async () => {
    dai = await Dai.deployed();
    link = await Link.deployed();
  });

  // Use Describe to goup tests
  describe("Basic token test", () => {
    it("Should return token names and symbols correctly", async () => {
      const daiName = await dai.name();
      const linkSymbol = await link.symbol();
      expect(daiName).to.equal("Dai");
      expect(linkSymbol).to.equal("LINK");
    });
  });

  describe("Supply and balance test", () => {
    it("Should have correct total supply", async () => {
      const totalSupply = await link.totalSupply();
      expect(totalSupply).to.be.bignumber.equal(toWei(10 ** 6));
    });

    it("Should have correct initial balances", async () => {
      const ownerBalance = await link.balanceOf(owner);
      const aliceBalance = await link.balanceOf(alice);
      expect(ownerBalance).to.be.bignumber.equal(toWei(10 ** 6));
      expect(aliceBalance).to.be.bignumber.equal(toWei(0));
    });
  });

  describe("transfer() test", () => {
    it("Should revert when transfer amount > balance", async () => {
      const ownerBalance = await link.balanceOf(owner);
      const transferAmount = ownerBalance.add(new BN(1));
      await truffleAssert.reverts(link.transfer(alice, transferAmount));
    });

    it("Should pass when transfer amount <= balance", async () => {
      const transferAmount = web3.utils.toBN(1000);
      await truffleAssert.passes(link.transfer(alice, transferAmount));
    });

    it("Should update balances accordingly", async () => {
      const ownerBalance = await link.balanceOf(owner);
      const aliceBalance = await link.balanceOf(alice);
      const totalSupply = await link.totalSupply();
      const thousand = new BN(1000);
      expect(ownerBalance).to.be.bignumber.equal(totalSupply.sub(thousand));
      expect(aliceBalance).to.be.bignumber.equal(thousand);
    });
  });

  describe("transferFrom() test", () => {
    before(async () => {
      const approveAmount = web3.utils.toBN(500);
      await link.approve(bob, approveAmount, { from: alice });
    });

    it("Should revert when transfer amount > allowance", async () => {
      const transferAmount = web3.utils.toBN(501);
      await truffleAssert.reverts(
        link.transferFrom(alice, bob, transferAmount, { from: bob })
      );
    });

    it("Should pass when transfer amount <= allowance", async () => {
      const approvedAmount = await link.allowance(alice, bob);
      await truffleAssert.passes(
        link.transferFrom(alice, bob, approvedAmount, { from: bob })
      );
    });
  });
});
