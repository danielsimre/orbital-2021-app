import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";

const useStyles = makeStyles({
  container: {
    width: "90%",
    margin: "auto",
    display: "flex",
  },
  card: {
    width: "50%",
    textAlign: "center",
  },
  header: {
    textAlign: "center",
    padding: "1rem",
  },
});

function ProfilePage(props) {
  // Queried values
  const { updateUser, setUpdateUser } = props;
  const [curUserInfo, setCurUserInfo] = useState({});
  const [isRetrieving, setIsRetrieving] = useState(true);

  // Change username dialog values
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  function handleUserOpen() {
    setUserDialogOpen(true);
  }

  function handleUserClose() {
    setUserDialogOpen(false);
  }

  // Misc values
  const classes = useStyles();

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

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

  function handleChangeUser(event) {
    event.preventDefault();

    // PUT request
    axios
      .put(
        "/api/v1/users/username",
        { newUsername: newUsername },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        handleAlert("Username changed!", res.data.msg, "success");
      })
      .then(() => setDisplayAlert(true))
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        getUserData();
        setUserDialogOpen(false);
        setUpdateUser(!updateUser);
      });
  }

  useEffect(() => getUserData(), []);

  return (
    isRetrieving || (
      <>
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
                <Button onClick={handleUserOpen}>Change Username</Button>
                <Button>Change Password</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Edit Username Dialog */}
        <Dialog open={userDialogOpen} onClose={handleUserClose}>
          <DialogTitle>Change Username</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Change your username to a new one. It must be unique.
            </DialogContentText>
            <TextField
              id="newUsername"
              label="New Username"
              variant="outlined"
              required
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUserClose}>Cancel</Button>
            <Button type="submit" onClick={(event) => handleChangeUser(event)}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        {/* Alert */}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={displayAlert}
          onClose={() => setDisplayAlert(false)}
        >
          <Alert onClose={() => setDisplayAlert(false)} severity={alertState}>
            <AlertTitle>{alertTitleText}</AlertTitle>
            {alertText}
          </Alert>
        </Snackbar>
      </>
    )
  );
}

export default ProfilePage;
