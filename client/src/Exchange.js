import React from "react";
import {
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

export const Exchange = () => {
  const classes = useStyles();
  const [token, setToken] = React.useState("");
  const [sendAmount, setSendAmount] = React.useState(0);
  const tokens = [
    { name: "dai", symbol: "DAI" },
    { name: "eth", symbol: "ETH" },
  ];

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };
  const handleSendAmountChange = (event) => {
    setSendAmount(event.target.value);
  };

  const getTokenPrice = () => {};

  return (
    <Container className={classes.root}>
      <h2 style={{ color: "white" }}>Swap</h2>
      <div style={{ position: "relative" }}>
        <TextField
          className={classes.formAmount}
          id="outlined-basic"
          defaultValue="0.0"
          variant="outlined"
          InputLabelProps={{ className: classes.formInputLabel }}
          inputProps={{ className: classes.formInput }}
          fullWidth
          onChange={handleSendAmountChange}
        />
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
      </div>
      <div style={{ position: "relative", top: "100px" }}>
        <TextField
          className={classes.formAmount}
          id="outlined-basic"
          defaultValue="0.0"
          variant="outlined"
          InputLabelProps={{ className: classes.formInputLabel }}
          inputProps={{ className: classes.formInput }}
          fullWidth
        />
        <div
          className={classes.formToken}
          style={{
            marginTop: "12px",
            marginRight: "25px",
          }}
        >
          <FormControl variant="filled">
            <Select
              value={token}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              style={{
                color: "white",
                backgroundColor: "#3F51B5",
                fontSize: "24px",
                borderRadius: "10px",
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
        </div>
      </div>
      <IconButton
        aria-label="arrow-down"
        style={{
          left: "0",
          right: "0",
          margin: "auto",
          top: "65px",
        }}
      >
        <ArrowDownwardIcon fontSize="large" style={{ color: "white" }} />
      </IconButton>
    </Container>
  );
};
