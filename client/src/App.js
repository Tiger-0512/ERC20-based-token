import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";

import "./App.css";
import { Exchange } from "./Exchange";
import { Header } from "./modules/Header";

const CONTRACT_ADDRESS = "";

const App = () => {
  // Hooks initialization
  const [web3, setWeb3] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  const metamaskAcc = null;

  useEffect(() => {
    const f = async () => {
      try {
        const metamaskAcc = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(metamaskAcc);
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
    f().then(checkStatus());
  }, []);

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
      <p style={{marginTop: "50px", marginBottom: "50px"}} >
        This app aims to understand web3.js library and ERC20 token. <br />
        Source Code and Document: 
      </p>
      <Exchange />
    </div>
  );
};

export default App;
