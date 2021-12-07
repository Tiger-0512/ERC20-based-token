import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";

import getWeb3 from "./getWeb3";
import "./App.css";
import Header from "./modules/Header";

const App = () => {
  // Hooks initialization
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const f = async() => {
      try {
        const metamaskAcc = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(metamaskAcc);

      } catch(error) {
        alert(error.message);
      }
    }
    f();
  }, []);

  return (
    <div className="App">
      <Header />
      { accounts }
    </div>
  );
}

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

