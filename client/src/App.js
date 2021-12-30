import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";

import "./App.css";
import { Exchange } from "./Exchange";
import { Header } from "./modules/Header";
import { abi } from "./abi";

const CONTRACT_ADDRESS = "";

const App = () => {
  const dexAddr = "0x372da3C3A35e37AfbFb0C1D54A7eFaF18CD635ED";

  // Hooks initialization
  const [web3, setWeb3] = useState(null);
  const [dexInst, setDexInst] = React.useState(NaN);
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [tokenPrices, setTokenPrices] = useState({});
  const metamaskAcc = null;

  useEffect(() => {
    const connectMetamask = async () => {
      try {
        const metamaskAcc = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(metamaskAcc);
        setWeb3(new Web3(Web3.givenprovider));
        setIsConnected(true);
      } catch (error) {
        alert(error.message);
      }
    };
    const checkStatus = async () => {
      console.log(isRopsren());
      if (!isRopsren()) {
        alert(
          "Please change your network to Ropsten test network after login to Metamask"
        );
      }
    };
    const getTokenPrice = async () => {
      const bnbPrice = await (
        await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=eth"
        )
      ).json();
      const dotPrice = await (
        await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=eth"
        )
      ).json();
      const batPrice = await (
        await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=basic-attention-token&vs_currencies=eth"
        )
      ).json();
      setTokenPrices({
        bnbToEth: bnbPrice.binancecoin.eth,
        dotToEth: dotPrice.polkadot.eth,
        batToEth: batPrice["basic-attention-token"].eth,
      });
    };

    connectMetamask().then(checkStatus());
    getTokenPrice();
  }, []);

  useEffect(() => {
    if (accounts[0]) {
      setDexInst(new web3.eth.Contract(abi.dex, dexAddr, {from: accounts[0]}));
    }
  }, [web3]);

  const isRopsren = () => {
    if (window.ethereum.chainId == 0x3) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="App">
      <Header
        accounts={accounts}
        isConnected={isConnected}
        setAccounts={setAccounts}
        setIsConnected={setIsConnected}
      />
      <p style={{ marginTop: "50px", marginBottom: "50px" }}>
        This app aims to understand how to use web3.js library and ERC20 token. <br />
        Source Code and Document:{" "}
        <a href="https://github.com/Tiger-0512/ERC20-based-token">
          Tiger-0512/ERC20-based-token
        </a>
      </p>
      <Exchange web3={web3} user={accounts[0]} tokenPrices={tokenPrices} />
    </div>
  );
};

export default App;
