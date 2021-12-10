import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";

import "./App.css";
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
      if (!isRopsren()) {
        alert("Please change your network to Ropsten test network after login to Metamask")
      }
    }
    f().then(
      checkStatus()
    )
  }, []);

  const isRopsren = () => {
    if (window.ethereum && window.ethereum.chainId != 0x3) {
      return false;
    } else {
      return true;
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
       {accounts}
    </div>
  );
};

export default App;

//   componentDidMount = async () => {
//     try {
//       // Get network provider and web3 instance.
//       const web3 = await getWeb3();

//       // Use web3 to get the user's accounts.
//       const accounts = await web3.eth.getAccounts();

//       // Get the contract instance.
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = SimpleStorageContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         SimpleStorageContract.abi,
//         deployedNetwork && deployedNetwork.address
//       );

//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
//       this.setState({ web3, accounts, contract: instance }, this.runExample);
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       // alert(
//       //   `Failed to load web3, accounts, or contract. Check console for details.`
//       // );
//       // console.error(error);
//     }
//   };
