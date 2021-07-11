import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    width: "90%",
    margin: "auto",
    display: "flex",
  },
  card: {
    width: "50%",
  },
  header: {
    textAlign: "center",
    padding: "1rem",
  },
});

function ProfilePage(props) {
  const [curUserInfo, setCurUserInfo] = useState({});
  const [isRetrieving, setIsRetrieving] = useState(true);

  const classes = useStyles();

  function getUserData() {
    // GET request
    axios
      .get("/api/v1/users", { withCredentials: true })
      .then((res) => {
        setCurUserInfo(res.data.attributes);
        console.log(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => getUserData(), []);

  return (
    isRetrieving || (
      <div>
        <Typography variant="h4" className={classes.header}>
          Profile Page
        </Typography>
        <div className={classes.container}>
          <Card variant="outlined" className={classes.card}>
            <Typography variant="h5" className={classes.header}>
              User Info
            </Typography>
            <CardContent>
              <Typography>Username: {curUserInfo.username}</Typography>
              <Typography>Email: {curUserInfo.email}</Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" className={classes.card}>
            <Typography variant="h5" className={classes.header}>
              Settings
            </Typography>
            <CardContent>
              <Button>Change Username</Button>
              <Button>Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  );
}

export default ProfilePage;
