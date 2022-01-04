import React, { useEffect, useState } from "react";
import { Container, Grid, makeStyles } from "@material-ui/core";
import Web3 from "web3";

import "./App.css";
import { Exchange } from "./modules/Exchange";
import { Header } from "./modules/Header";
import ABI from "./contracts/Dex.json";
import bnbIcon from "./assets/bnb.png";
import dotIcon from "./assets/dot.png";
import batIcon from "./assets/bat.png";

const abi = ABI.abi;
const dexAddr = "0x36b143C97991d7dd362A37Bae0E6637b87019e39";
const bnbAddr = "0x9120174A9bA340a2388E372f55290a1be39ab1C4";
const dotAddr = "0xAA20b95f14d45Bc7dD3F61787594F28075c17DC5";
const batAddr = "0xDC0198B26BcB196B0F8885202B6822D799D5079a";
const tokens = [
  { name: "binance", symbol: "BNB", icon: bnbIcon, address: bnbAddr },
  { name: "polkadot", symbol: "DOT", icon: dotIcon, address: dotAddr },
  {
    name: "basicAttentionToken",
    symbol: "BAT",
    icon: batIcon,
    address: batAddr,
  },
];
const tokensAddr = {
  bnb: bnbAddr,
  dot: dotAddr,
  bat: batAddr,
};

let web3;
try {
  web3 = new Web3(
    new Web3.providers.HttpProvider(
      // "http://localhost:8545"
      `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`
    )
  );
} catch (error) {
  alert(error.message);
}

const useStyles = makeStyles({
  icon: {
    width: "16px",
    height: "16px",
  },
});

const App = () => {
  let bnbPrice, dotPrice, batPrice;
  const classes = useStyles();
  const [dexInst, setDexInst] = React.useState(NaN);
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [tokenPrices, setTokenPrices] = useState({});
  const [shownTokenPrices, setShownTokenPrices] = useState({});

  const connectMetamask = async () => {
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
  // const checkStatus = async () => {
  //   console.log(isRopsren());
  //   if (!isRopsren()) {
  //     alert(
  //       "Please change your network to Ropsten test network after login to Metamask"
  //     );
  //   }
  // };
  // const isRopsren = () => {
  //   if (window.ethereum.chainId == 0x3) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  const getTokenPrice = async () => {
    bnbPrice = await (
      await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=eth"
      )
    ).json();
    dotPrice = await (
      await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=eth"
      )
    ).json();
    batPrice = await (
      await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=basic-attention-token&vs_currencies=eth"
      )
    ).json();
    setTokenPrices({
      bnbToEth: bnbPrice.binancecoin.eth,
      dotToEth: dotPrice.polkadot.eth,
      batToEth: batPrice["basic-attention-token"].eth,
    });
    setShownTokenPrices({
      BNB: bnbPrice.binancecoin.eth,
      DOT: dotPrice.polkadot.eth,
      BAT: batPrice["basic-attention-token"].eth,
    });
  };

  useEffect(() => {
    // connectMetamask().then(checkStatus());
    connectMetamask();
    getTokenPrice();
  }, []);
  useEffect(() => {
    if (accounts[0]) {
      setDexInst(new web3.eth.Contract(abi, dexAddr, { from: accounts[0] }));
    }
  }, [accounts]);

  return (
    <div className="App">
      <Header
        accounts={accounts}
        isConnected={isConnected}
        setAccounts={setAccounts}
        setIsConnected={setIsConnected}
      />
      <p style={{ marginTop: "50px", marginBottom: "50px" }}>
        This app aims to understand how to use web3.js library and ERC20 token.{" "}
        <br />
        Source Code and Document:{" "}
        <a href="https://github.com/Tiger-0512/ERC20-based-token">
          Tiger-0512/ERC20-based-token
        </a>
      </p>
      <p>
        <Container style={{ width: "950px" }}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <b>Token Name</b>
            </Grid>
            <Grid item xs={6}>
              <b>Token Contract Addres</b>
            </Grid>
            <Grid item xs={3}>
              <b>Exchange Rate</b>
            </Grid>
          </Grid>
          {tokens.map((token) => (
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <img
                  className={classes.icon}
                  src={token.icon}
                  alt="tokenIcon"
                />
              </Grid>
              <Grid item xs={2}>
                {token.name}
              </Grid>
              <Grid item xs={6}>
                {token.address}
              </Grid>
              <Grid item xs={3}>
                1 ETH = {shownTokenPrices[token.symbol]} {token.symbol}
              </Grid>
            </Grid>
          ))}
        </Container>
      </p>

      <Exchange
        web3={web3}
        user={accounts[0]}
        tokens={tokens}
        tokenPrices={tokenPrices}
        tokensAddr={tokensAddr}
        dexAddr={dexAddr}
        dexInst={dexInst}
        isConnected={isConnected}
        connectMetamask={connectMetamask}
      />
    </div>
  );
};

export default App;
