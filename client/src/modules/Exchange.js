import React, { useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Button,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { ShowResults } from "./ShowResults";
import ABI from "../contracts/ERC20.json";

const abi = ABI.abi;

const useStyles = makeStyles({
  root: {
    width: "600px",
    height: "500px",
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
  formSelect: {
    color: "white",
    backgroundColor: "#3F51B5",
    fontSize: "24px",
    borderRadius: "10px",
    marginTop: "12px",
    marginRight: "25px",
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
  const classes = useStyles();
  const [selectedToken, setSelectedToken] = React.useState("");
  const [sendAmount, setSendAmount] = React.useState(0);
  const [sendAmountWei, setSendAmountWei] = React.useState(null);
  const [output, setOutput] = React.useState(0);
  const [outputWei, setOutputWei] = React.useState(null);
  const [buyState, setBuyState] = React.useState(true);
  const [tokenInst, setTokenInst] = React.useState(null);
  const [inputState, setInputState] = React.useState(false);
  const [balanceEnough, setBalanceEnough] = React.useState(false);
  const [exchangeState, setExchangeState] = React.useState(false);

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
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
  const handleTokenInstChange = async (addr) => {
    if (props.user) {
      setTokenInst(
        await new props.web3.eth.Contract(abi, addr, { from: props.user })
      );
    }
  };

  const checkBalance = async () => {
    const balanceRaw = buyState
      ? await props.web3.eth.getBalance(props.user)
      : await tokenInst.methods.balanceOf(props.user).call();
    const balance = parseFloat(props.web3.utils.fromWei(balanceRaw, "ether"));

    if (balance >= sendAmount) {
      // setBalanceEnough(true);
      return true;
    } else {
      // setBalanceEnough(false);
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
          setExchangeState(true);
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
        await tokenInst.methods.approve(props.dexAddr, sendAmountWei).send();
        setExchangeState(true);
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
    const changeOutput = async () => {
      let _output;
      switch (selectedToken) {
        case "binance":
          await handleTokenInstChange(props.tokensAddr.bnb);
          _output = buyState
            ? sendAmount / props.tokenPrices.bnbToEth
            : sendAmount * props.tokenPrices.bnbToEth;
          // await checkBalance();
          break;
        case "polkadot":
          await handleTokenInstChange(props.tokensAddr.dot);
          _output = buyState
            ? sendAmount / props.tokenPrices.dotToEth
            : sendAmount * props.tokenPrices.dotToEth;
          // await checkBalance();
          break;
        case "basicAttentionToken":
          await handleTokenInstChange(props.tokensAddr.bat);
          _output = buyState
            ? sendAmount / props.tokenPrices.batToEth
            : sendAmount * props.tokenPrices.batToEth;
          // await checkBalance();
          break;
        default:
          _output = 0.0;
      }
      setOutput(_output);
      setOutputWei(props.web3.utils.toWei(_output.toString(), "ether"));
    };
    setExchangeState(false);
    if (props.isConnected && sendAmount && selectedToken.length > 0) {
      changeOutput();
    }
  }, [selectedToken, sendAmount, buyState]);
  useEffect(() => {
    if (selectedToken && sendAmount) {
      setInputState(true);
    } else {
      setInputState(false);
    }
  }, [selectedToken, sendAmount]);

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
            <FormControl className={classes.formToken} variant="outlined">
              <Select
                className={classes.formSelect}
                value={selectedToken}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                onChange={handleTokenChange}
              >
                <MenuItem value="" disabled>
                  <em>Select a Token</em>
                </MenuItem>
                {props.tokens.map((token) => (
                  <MenuItem value={token.name}>
                    <Typography variant="inherit">{token.symbol}</Typography>
                  </MenuItem>
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
            {output.toFixed((5))}
          </Box>
          {buyState ? (
            <FormControl className={classes.formToken} variant="outlined">
              <Select
                className={classes.formSelect}
                value={selectedToken}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                onChange={handleTokenChange}
              >
                <MenuItem value="" disabled>
                  <em>Select a Token</em>
                </MenuItem>
                {props.tokens.map((token) => (
                  <MenuItem value={token.name}>
                    <Typography variant="inherit">{token.symbol}</Typography>
                  </MenuItem>
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
        // disabled={!inputState || !balanceEnough}
        disabled={!inputState}
        onClick={async () => {
          if (await checkBalance()) {
            await exchange();
          } else {
            alert(`Insufficient ${buyState ? "ETH" : selectedToken} balance!`);
          }
        }}
      >
        <div>
          {(() => {
            // if (inputState && balanceEnough) {
            if (inputState) {
              return "Exchange";
              // } else if (inputState) {
              //   return `Insufficient ${buyState ? "ETH" : selectedToken} balance`;
            } else {
              return "Please set an amount and select the token";
            }
          })()}
        </div>
      </Button>
      {exchangeState && (
        <ShowResults
          buyState={buyState}
          selectedToken={selectedToken}
          sendAmount={sendAmount}
          output={output.toFixed(5)}
        />
      )}
    </Container>
  );
};
