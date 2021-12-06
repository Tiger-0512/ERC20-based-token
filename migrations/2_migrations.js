// Import the compiled contract
const Dai = artifacts.require("Dai");
const Link = artifacts.require("Link");

const MyToken = artifacts.require("MyToken");

const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), "ether");

module.exports = async function (deployer) {
  // Create my token (Dai)
  await deployer.deploy(Dai, "Dai", "DAI", toWei(10 ** 10));
  const dai = await Dai.deployed();
  // Create my token (Link)
  await deployer.deploy(Link, "Link", "LINK", toWei(10 ** 6));
  const link = await Link.deployed();

  await deployer.deploy(MyToken, [dai.address, link.address]);
  const myToken = await MyToken.deployed();

  // // When test the contracts, comment out next two lines
  // await dai.transfer(myToken.address, toWei(10**10));
  // await link.transfer(myToken.address, toWei(10**6));
};
