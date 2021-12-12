import React from "react";
import Web3 from "web3";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { Button, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const Header = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton */}
          {/*   edge="start" */}
          {/*   className={classes.menuButton} */}
          {/*   color="inherit" */}
          {/*   aria-label="menu" */}
          {/* > */}
          {/*   <MenuIcon /> */}
          {/* </IconButton> */}
          <Typography
            variant="h6"
            className={classes.title}
            style={{ textAlign: "left" }}
          >
            Token Exchange Simulator
          </Typography>
          {props.isConnected ? (
            `Your account: ${props.accounts[0]}`
          ) : (
            "Please reload and login to Metamask!"
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
