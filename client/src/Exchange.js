import React, { useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  FormControl,
  MenuItem,
  Select,
  IconButton,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "600px",
    height: "340px",
    backgroundColor: "#191B1F",
    borderRadius: "10px",
    padding: "20px",
  },
  formAmount: {
    position: "absolute",
    left: "0px",
    right: "0px",
    margin: "0 auto",
    backgroundColor: "#212528",
  },
  formToken: {
    position: "absolute",
    right: "0px",
  },

  formInputLabel: {
    color: "#3F51B5",
  },
  formInput: {
    height: "50px",
    color: "white",
    fontSize: "30px",
  },
});

export const Exchange = (props) => {
  const classes = useStyles();
  const [token, setToken] = React.useState("");
  const [sendAmount, setSendAmount] = React.useState(0);
  const [output, setOutput] = React.useState(0.0);
  const [buyState, setBuyState] = React.useState(true);
  const tokens = [
    { name: "binance", symbol: "BNB" },
    { name: "polkadot", symbol: "DOT" },
    { name: "basicAttentionToken", symbol: "BAT" },
  ];

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };
  const handleSendAmountChange = (event) => {
    setSendAmount(event.target.value);
  };
  const handleBuyStateChange = (event) => {
    setBuyState(!buyState);
  };

  useEffect(() => {
    let _output;
      switch (token) {
        case "binance":
          _output = buyState
            ? sendAmount / props.tokenPrices.bnbToEth
            : sendAmount * props.tokenPrices.bnbToEth;
          break;
        case "polkadot":
          _output = buyState
            ? sendAmount / props.tokenPrices.dotToEth
            : sendAmount * props.tokenPrices.dotToEth;
          break;
        case "basicAttentionToken":
          _output = buyState
            ? sendAmount / props.tokenPrices.batToEth
            : sendAmount * props.tokenPrices.batToEth;
          break;
        default:
          _output = 0.0;
      }
    setOutput(_output);
  }, [token, sendAmount, buyState]);

  return (
    <Container className={classes.root}>
      <h2 style={{ color: "white" }}>Swap</h2>
      <div style={{ position: "relative" }}>
        <TextField
          className={classes.formAmount}
          id="outlined-basic"
          placeholder="0.0"
          variant="outlined"
          InputLabelProps={{ className: classes.formInputLabel }}
          inputProps={{ className: classes.formInput }}
          fullWidth
          onChange={handleSendAmountChange}
        />
        {buyState ? (
          <div
            className={classes.formToken}
            style={{
              color: "white",
              fontSize: "24px",
              marginTop: "30px",
              marginRight: "60px",
            }}
          >
            ETH
          </div>
        ) : (
          <FormControl variant="filled" className={classes.formToken}>
            <Select
              value={token}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              style={{
                color: "white",
                backgroundColor: "#3F51B5",
                fontSize: "24px",
                borderRadius: "10px",
                marginTop: "12px",
                marginRight: "25px",
              }}
              onChange={handleTokenChange}
            >
              <MenuItem value="" disabled>
                Select a Token
              </MenuItem>
              {tokens.map((token) => (
                <MenuItem value={token.name}>{token.symbol}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
      <div style={{ position: "relative", top: "100px" }}>
        <Box
          className={classes.formAmount}
          style={{
            width: "545px",
            height: "87px",
            color: "white",
            fontSize: "30px",
            display: "grid",
            justifyContent: "left",
            alignItems: "center",
            paddingLeft: "15px",
          }}
        >
          {output}
        </Box>
        {buyState ? (
          <FormControl variant="filled" className={classes.formToken}>
            <Select
              value={token}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              style={{
                color: "white",
                backgroundColor: "#3F51B5",
                fontSize: "24px",
                borderRadius: "10px",
                marginTop: "12px",
                marginRight: "25px",
              }}
              onChange={handleTokenChange}
            >
              <MenuItem value="" disabled>
                Select a Token
              </MenuItem>
              {tokens.map((token) => (
                <MenuItem value={token.name}>{token.symbol}</MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <div
            className={classes.formToken}
            style={{
              color: "white",
              fontSize: "24px",
              marginTop: "30px",
              marginRight: "60px",
            }}
          >
            ETH
          </div>
        )}
      </div>
      <IconButton
        aria-label="arrow-down"
        style={{
          left: "0",
          right: "0",
          margin: "auto",
          top: "65px",
        }}
        onClick={handleBuyStateChange}
      >
        <ArrowDownwardIcon fontSize="large" style={{ color: "white" }} />
      </IconButton>
    </Container>
  );
};
