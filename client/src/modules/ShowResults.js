import React from "react";
import { Container } from "@material-ui/core";

export const ShowResults = (props) => {
  const nameToSymbol = {
    binance: "BNB",
    polkadot: "DOT",
    basicAttentionToken: "BAT",
  }

  return(
    <Container style={{color: "white"}} >
      <h2>Exchange Sucessed!</h2>
      <p style={{fontSize: "20px"}} >
        {`Payment: ${props.sendAmount} ${props.buyState ? "ETH" : nameToSymbol[props.selectedToken]}`} <br />
        {`Deposit: ${props.output} ${props.buyState ? nameToSymbol[props.selectedToken] : "ETH"}`} <br />
      </p>
    </Container>
  );
};

