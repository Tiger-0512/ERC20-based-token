import React from "react";
import {
  Container,
  TextField,
  FormControl,
  FormHelperText,
  MenuItem,
  InputLabel,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "600px",
    height: "340px",
    backgroundColor: "#191B1F",
    borderRadius: "10px",
    padding: "20px",
  },
  formParent: {
    position: "relative",
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
    color: "white",
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

  const handleChange = (event) => {
    setToken(event.target.value);
  };

  return (
    <Container className={classes.root}>
      <h2 style={{ color: "white" }}>Swap</h2>
      <div className={classes.formParent}>
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
            color: "white",
            fontSize: "24px",
            marginTop: "30px",
            marginRight: "60px",
          }}
        >
          ETH
        </div>
      </div>
      <div className={classes.formParent} style={{ top: "100px" }}>
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
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              style={{
                color: "white",
                backgroundColor: "#3F51B5",
                fontSize: "24px",
                borderRadius: "10px",
              }}
            >
              <MenuItem value="" disabled>
                Select a Token
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </Container>
  );
};
