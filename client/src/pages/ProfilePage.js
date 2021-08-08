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
  textfields: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
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

  // Change password dialog values
  const [passDialogOpen, setPassDialogOpen] = useState(false);
  const [curPassword, setCurPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passNoMatch, setPassNoMatch] = useState(false);
  const [passMatchText, setPassMatchText] = useState("");

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Misc values
  const MIN_PASSWORD_LENGTH = 6;

  function handleUserOpen() {
    setUserDialogOpen(true);
  }

  function handleUserClose() {
    setUserDialogOpen(false);
  }

  function handlePassOpen() {
    setPassDialogOpen(true);
  }

  function handlePassClose() {
    setPassDialogOpen(false);
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
        { newUsername: newUsername.trim() },
        { withCredentials: true }
      )
      .then((res) => {
        handleAlert("Username changed!", res.data.msg, "success");
        setUserDialogOpen(false);
      })
      .catch((err) => {
        handleAlert("Error!", err.response.data.msg, "error");
      })
      .finally(() => {
        getUserData();
        setDisplayAlert(true);
        setUpdateUser(!updateUser);
      });
  }

  function handleChangePass(event) {
    event.preventDefault();

    // Check if passwords are the same
    if (newPassword.trim() !== confirmNewPassword.trim()) {
      setPassNoMatch(true);
      setPassMatchText("Passwords do not match");
    } else if (newPassword.trim().length < MIN_PASSWORD_LENGTH) {
      setPassNoMatch(true);
      setPassMatchText("Password is too short. Minimum 6 characters.");
    } else {
      // PUT request
      axios
        .put(
          "/api/v1/users/password",
          {
            curPassword: curPassword.trim(),
            newPassword: newPassword.trim(),
            confirmNewPassword: confirmNewPassword.trim(),
          },
          { withCredentials: true }
        )
        .then((res) => {
          handleAlert("Password changed!", res.data.msg, "success");
          setPassDialogOpen(false);
        })
        .catch((err) => {
          handleAlert("Error!", err.response.data.msg, "error");
        })
        .finally(() => {
          setDisplayAlert(true);
          setCurPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        });
    }
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
              </CardContent>
            </Card>
            <Card variant="outlined" className={classes.card}>
              <Typography variant="h5" className={classes.header}>
                Settings
              </Typography>
              <CardContent>
                <Button onClick={handleUserOpen}>Change Username</Button>
                <Button onClick={handlePassOpen}>Change Password</Button>
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
              onChange={(event) => {
                // Do not allow spaces
                const regex = /^\S*$/g;
                const value = event.target.value;
                if (value === "" || regex.test(value)) {
                  setNewUsername(value);
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUserClose}>Cancel</Button>
            <Button type="submit" onClick={(event) => handleChangeUser(event)}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        {/* Edit Password Dialog */}
        <Dialog open={passDialogOpen} onClose={handlePassClose}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Change your password. Your new password should still be at least 6
              characters long.
            </DialogContentText>
            <div className={classes.textfields}>
              <TextField
                id="curPassword"
                label="Current Password"
                variant="outlined"
                type="password"
                required
                value={curPassword}
                onChange={(event) => {
                  // Do not allow spaces
                  const regex = /^\S*$/g;
                  const value = event.target.value;
                  if (value === "" || regex.test(value)) {
                    setCurPassword(value);
                  }
                }}
              />
              <TextField
                id="newPassword"
                label="New Password"
                variant="outlined"
                type="password"
                required
                value={newPassword}
                error={passNoMatch}
                onChange={(event) => {
                  // Do not allow spaces
                  const regex = /^\S*$/g;
                  const value = event.target.value;
                  if (value === "" || regex.test(value)) {
                    setNewPassword(value);
                  }
                }}
              />
              <TextField
                id="newPasswordConfirm"
                label="Confirm New Password"
                variant="outlined"
                type="password"
                required
                value={confirmNewPassword}
                error={passNoMatch}
                helperText={passMatchText}
                onChange={(event) => {
                  // Do not allow spaces
                  const regex = /^\S*$/g;
                  const value = event.target.value;
                  if (value === "" || regex.test(value)) {
                    setConfirmNewPassword(value);
                  }
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePassClose}>Cancel</Button>
            <Button type="submit" onClick={(event) => handleChangePass(event)}>
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
