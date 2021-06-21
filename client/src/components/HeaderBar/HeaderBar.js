import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
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
  text: {
    color: "#FF0000",
  },
}));

// This is the dropdown menu for the Profile + Logout
function ProfileMenuButton(props) {
  const { setIsAuthenticated } = props;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    axios
      .post("/api/v1/users/logout", {}, { withCredentials: true })
      .then(() => setIsAuthenticated(false));
  }

  return (
    <>
      <Button onClick={handleOpen}>Settings</Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/profile">
          Profile
        </MenuItem>
        <MenuItem component={Link} to="/settings">
          Options
        </MenuItem>
        <MenuItem onClick={handleLogout} className={classes.text}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

function HeaderBar(props) {
  const { isAuthenticated, setIsAuthenticated } = props;

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
              <Button component={Link} to="/classes" color="default">
                View My Classes
              </Button>
              <Button component={Link} to="/groups" color="default">
                View My Groups
              </Button>
            </Typography>
            <ProfileMenuButton setIsAuthenticated={setIsAuthenticated} />
          </Toolbar>
        </AppBar>
      </div>
    )
  );
}

export default HeaderBar;
