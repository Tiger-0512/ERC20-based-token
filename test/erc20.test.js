const Binance = artifacts.require("Binance");
const Polkadot = artifacts.require("Polkadot");

const BN = require("bn.js");
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-bn")(BN));

const truffleAssert = require("truffle-assertions");

const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), "ether");

contract("ERC20 token test", (accounts) => {
  let binance, polkadot;

  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];

  before(async () => {
    binance = await Binance.deployed();
    polkadot = await Polkadot.deployed();
  });

  // Use Describe to goup tests
  describe("Basic token test", () => {
    it("Should return token names and symbols correctly", async () => {
      const bnbName = await binance.name();
      const dotSymbol = await polkadot.symbol();
      expect(bnbName).to.equal("Binance");
      expect(dotSymbol).to.equal("DOT");
    });
  });

  describe("Supply and balance test", () => {
    it("Should have correct total supply", async () => {
      const totalSupply = await polkadot.totalSupply();
      expect(totalSupply).to.be.bignumber.equal(toWei(10 ** 6));
    });

    it("Should have correct initial balances", async () => {
      const ownerBalance = await polkadot.balanceOf(owner);
      const aliceBalance = await polkadot.balanceOf(alice);
      expect(ownerBalance).to.be.bignumber.equal(toWei(10 ** 6));
      expect(aliceBalance).to.be.bignumber.equal(toWei(0));
    });
  });

  describe("transfer() test", () => {
    it("Should revert when transfer amount > balance", async () => {
      const ownerBalance = await polkadot.balanceOf(owner);
      const transferAmount = ownerBalance.add(new BN(1));
      await truffleAssert.reverts(polkadot.transfer(alice, transferAmount));
    });

    it("Should pass when transfer amount <= balance", async () => {
      const transferAmount = web3.utils.toBN(1000);
      await truffleAssert.passes(polkadot.transfer(alice, transferAmount));
    });

    it("Should update balances accordingly", async () => {
      const ownerBalance = await polkadot.balanceOf(owner);
      const aliceBalance = await polkadot.balanceOf(alice);
      const totalSupply = await polkadot.totalSupply();
      const thousand = new BN(1000);
      expect(ownerBalance).to.be.bignumber.equal(totalSupply.sub(thousand));
      expect(aliceBalance).to.be.bignumber.equal(thousand);
    });
  });

  describe("transferFrom() test", () => {
    before(async () => {
      const approveAmount = web3.utils.toBN(500);
      await polkadot.approve(bob, approveAmount, { from: alice });
    });

    it("Should revert when transfer amount > allowance", async () => {
      const transferAmount = web3.utils.toBN(501);
      await truffleAssert.reverts(
        polkadot.transferFrom(alice, bob, transferAmount, { from: bob })
      );
    });

    it("Should pass when transfer amount <= allowance", async () => {
      const approvedAmount = await polkadot.allowance(alice, bob);
      await truffleAssert.passes(
        polkadot.transferFrom(alice, bob, approvedAmount, { from: bob })
      );
    });
  });
});
