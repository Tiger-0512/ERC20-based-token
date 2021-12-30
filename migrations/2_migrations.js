// Import the compiled contract
const Binance = artifacts.require("Binance");
const Polkadot = artifacts.require("Polkadot");
const BasicAttentionToken = artifacts.require("BasicAttentionToken");

const Dex = artifacts.require("Dex");

const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), "ether");

module.exports = async function (deployer) {
  // Create my token (Binaice)
  await deployer.deploy(Binance, "Binance", "BNB", toWei(10 ** 10));
  const binance = await Binance.deployed();
  // Create my token (Polkadot)
  await deployer.deploy(Polkadot, "Polkadot", "DOT", toWei(10 ** 6));
  const polka = await Polkadot.deployed();
  // Create my token (BasicAttentionToken)
  await deployer.deploy(BasicAttentionToken, "BasicAttentionToken", "BAT", toWei(10 ** 4));
  const bat = await BasicAttentionToken.deployed();

  await deployer.deploy(Dex, [binance.address, polka.address, bat.address]);
  const dex = await Dex.deployed();

  // When test the contracts, comment out next lines
  await binance.transfer(dex.address, toWei(10**10));
  await polka.transfer(dex.address, toWei(10**6));
  await bat.transfer(dex.address, toWei(10**4));
};
