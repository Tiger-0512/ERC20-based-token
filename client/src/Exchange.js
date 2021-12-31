// ToDo: checkBalanceの反映
import React, { useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  FormControl,
  MenuItem,
  Select,
  Button,
  IconButton,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { makeStyles } from "@material-ui/core/styles";

import { abi } from "./abi";

const useStyles = makeStyles({
  root: {
    width: "600px",
    height: "380px",
    backgroundColor: "#191B1F",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexFlow: "column",
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
  button: {
    height: "50px",
    fontSize: "20px",
    "&:disabled": {
      color: "white",
      backgroundColor: "#7E8082",
      fontSize: "16px",
    },
  },
});

export const Exchange = (props) => {
  const bnbAddr = "0x2b932173C3aF27840103B29D11Cf6773f5916406";
  const dotAddr = "0xfcf451c44E372141CBf5cD0c7305dcbbAc185719";
  const batAddr = "0x77ea646214B08A0A5B7C70f6DB600b375b06D17f";

  const classes = useStyles();
  const [token, setToken] = React.useState("");
  const [sendAmount, setSendAmount] = React.useState(0);
  const [sendAmountWei, setSendAmountWei] = React.useState(null);
  const [output, setOutput] = React.useState(0);
  const [outputWei, setOutputWei] = React.useState(null);
  const [buyState, setBuyState] = React.useState(true);
  const [tokenInst, setTokenInst] = React.useState(null);
  const [buttonState, setButtonState] = React.useState(false);
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
    if (props.web3) {
      if (event.target.value) {
        setSendAmountWei(
          props.web3.utils.toWei(event.target.value.toString(), "ether")
        );
      } else {
        setSendAmountWei(null);
      }
    }
  };
  const handleBuyStateChange = () => {
    setBuyState(!buyState);
  };
  const handleTokenInstChange = (addr) => {
    if (props.user) {
      setTokenInst(
        new props.web3.eth.Contract(abi.token, addr, { from: props.user })
      );
    }
  };

  const checkBalance = async () => {
    const balanceRaw = buyState
      ? await props.web3.eth.getBalance(props.user)
      : await tokenInst.methods.balanceOf(props.user).call();
    const balance = parseFloat(props.web3.utils.fromWei(balanceRaw, "ether"));

    if (balance >= sendAmount) {
      return true;
    } else {
      return false;
    }
  };
  const buyToken = () => {
    const tokenAddr = tokenInst._address;
    return new Promise((resolve, reject) => {
      props.dexInst.methods
        .buyToken(tokenAddr, sendAmountWei, outputWei)
        .send({ value: sendAmountWei })
        .then((receipt) => {
          console.log(receipt);
          resolve();
        })
        .catch((err) => reject(err));
    });
  };
  const sellToken = async () => {
    const allowance = await tokenInst.methods
      .allowance(props.user, props.dexAddr)
      .call();
    if (parseInt(sendAmountWei) > parseInt(allowance)) {
      try {
        await tokenInst.methods.approve(props.dexAddr).send();
      } catch (err) {
        throw err;
      }
    }
    try {
      const tokenAddr = tokenInst._address;
      const sellTx = await props.dexInst.methods
        .sellToken(tokenAddr, sendAmountWei, outputWei)
        .send();
      console.log(sellTx);
    } catch (err) {
      throw err;
    }
  };
  const exchange = async () => {
    try {
      buyState ? await buyToken() : await sellToken();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    let _output;
    const changeOutput = async () => {
      switch (token) {
        case "binance":
          handleTokenInstChange(bnbAddr);
          _output = buyState
            ? sendAmount / props.tokenPrices.bnbToEth
            : sendAmount * props.tokenPrices.bnbToEth;
          break;
        case "polkadot":
          handleTokenInstChange(dotAddr);
          _output = buyState
            ? sendAmount / props.tokenPrices.dotToEth
            : sendAmount * props.tokenPrices.dotToEth;
          break;
        case "basicAttentionToken":
          handleTokenInstChange(batAddr);
          _output = buyState
            ? sendAmount / props.tokenPrices.batToEth
            : sendAmount * props.tokenPrices.batToEth;
          break;
        default:
          _output = 0.0;
      }
      setOutput(_output);
      if (props.web3) {
        setOutputWei(props.web3.utils.toWei(_output.toString(), "ether"));
      }
    };
    changeOutput();
  }, [token, sendAmount, buyState]);
  useEffect(() => {
    if (token && sendAmount) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  }, [token, sendAmount]);

  return (
    <Container className={classes.root}>
      <h2 style={{ color: "white" }}>Swap</h2>
      <div style={{ height: "210px" }}>
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
      </div>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        disabled={!buttonState}
        onClick={async () => {
          await exchange();
        }}
      >
        {buttonState ? "Exchange" : "Please set an amount and select the token"}
      </Button>
    </Container>
  );
};
