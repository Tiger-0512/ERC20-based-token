const Dai = artifacts.require("Dai");
const MyToken = artifacts.require("MyToken");

const BN = require("bn.js");
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-bn")(BN));

const truffleAssert = require("truffle-assertions");

contract("MyToken test", (accounts) => {
  let dai, myToken;

  const owner = accounts[0];
  const alice = accounts[1];

  before(async () => {
    dai = await Dai.deployed();
    myToken = await MyToken.deployed();

    await dai.transfer(myToken.address, await dai.totalSupply());
  });

  describe("Buy token test", () => {
    it("Should revert when invalid token address is entered", async () => {
      const randomAddr = accounts[7];
      await truffleAssert.reverts(
        myToken.buyToken(randomAddr, "1", "1", { value: "1" })
      );
    });

    it("Should pass when every paramter is valid", async () => {
      const tokenAddr = dai.address;
      await truffleAssert.passes(
        myToken.buyToken(tokenAddr, "100", "10000", {
          value: "100",
          from: alice,
        })
      );
    });

    it("Should update myToken and alice balance after buying", async () => {
      const aliceDai = await dai.balanceOf(alice);
      const myTokenEth = await web3.eth.getBalance(myToken.address);

      expect(aliceDai).to.be.bignumber.equal(new BN(10000));
      expect(myTokenEth).to.be.equal("100");
    });
  });

  describe("Sell token test", () => {
    it("Should only pass if alice approved token transfer", async () => {
      const tokenAddr = dai.address;
      await truffleAssert.reverts(
        myToken.sellToken(tokenAddr, "5000", "50", { from: alice })
      );

      await dai.approve(myToken.address, "5000", { from: alice });

      await truffleAssert.passes(
        myToken.sellToken(tokenAddr, "5000", "50", { from: alice })
      );
    });
  });
});
