import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

import axios from "axios";

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

function HeaderBar(props) {
  const { isAuthenticated, setIsAuthenticated } = props;

  function handleLogout() {
    axios
      .post("/api/v1/users/logout", {}, { withCredentials: true })
      .then(setIsAuthenticated(false));
  }

  const classes = useStyles();

  return (
    isAuthenticated && (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Button component={Link} to="/home">
              Home
            </Button>
            <Typography className={classes.title}>
              <Button component={Link} to="/new_project" color="default">
                Create New Project
              </Button>
              <Button component={Link} to="/my_projects" color="default">
                View My Projects
              </Button>
            </Typography>
            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  );
}

export default HeaderBar;
