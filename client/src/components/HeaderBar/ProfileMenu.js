import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Menu, MenuItem, makeStyles } from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  text: {
    color: "#FF0000",
  },
}));

function ProfileMenu(props) {
  const { setIsAuthenticated } = props;
  const [username, setUsername] = useState("");
  const [isRetrieving, setIsRetrieving] = useState(true);

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  function handleOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleLogout() {
    axios
      .post("/api/v1/users/logout", {}, { withCredentials: true })
      .then(() => setIsAuthenticated(false))
      .catch((err) => console.log(err));
  }

  function getUsername() {
    axios
      .get("/api/v1/users", { withCredentials: true })
      .then((res) => setUsername(res.data.attributes.username))
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => getUsername(), []);

  return (
    <>
      <Button onClick={handleOpen}>{isRetrieving ? "" : username}</Button>
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
        <MenuItem onClick={handleLogout} className={classes.text}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu;
