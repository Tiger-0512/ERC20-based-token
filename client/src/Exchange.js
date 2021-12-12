import React from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "300px",
    height: "300px",
    backgroundColor: "red",
    borderRadius: "10px",
  },
  form: {
    margin: "10px",
  },
});

export const Exchange = () => {
  const classes = useStyles();
  return <Container className={classes.root}></Container>;
};
