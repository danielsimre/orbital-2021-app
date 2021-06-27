import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import ProfileMenu from "./ProfileMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  headerBar: {
    background: "#eba834",
  },
}));

function HeaderBar(props) {
  const { isAuthenticated, setIsAuthenticated } = props;
  const classes = useStyles();

  return (
    isAuthenticated && (
      <div className={classes.root}>
        <AppBar position="static" className={classes.headerBar}>
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
            <ProfileMenu setIsAuthenticated={setIsAuthenticated} />
          </Toolbar>
        </AppBar>
      </div>
    )
  );
}

export default HeaderBar;
