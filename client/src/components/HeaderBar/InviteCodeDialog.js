import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import axios from "axios";

const useStyles = makeStyles({
  paper: {
    display: "flex",
    flexDirection: "column",
  },
  snackbar: {
    textAlign: "center",
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
});

function InviteCodeDialog(props) {
  const { refreshClassList } = props;

  // Form values
  const [inviteCode, setInviteCode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Misc values
  const classes = useStyles();

  function handleSubmit(event) {
    event.preventDefault();
    handleJoinClass();
  }

  function handleDialogOpen() {
    setInviteCode("");
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleJoinClass() {
    axios
      .post(
        "/api/v1/classes/invite",
        {
          inviteCode: inviteCode,
        },
        { withCredentials: true }
      )
      .then(
        (res) =>
          handleAlert(
            "Class joined!",
            "You have joined the class successfully.",
            "success"
          ),
        (err) =>
          handleAlert(
            "Error!",
            "An error occurred: " + err.response.data.msg,
            "error"
          )
      )
      .then(() => setDisplayAlert(true))
      .then(() => refreshClassList())
      .catch((err) => console.log(err))
      .finally(() => handleDialogClose());
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  return (
    <>
      <Button
        onClick={handleDialogOpen}
        className={classes.button}
        size="small"
      >
        Use Invite Code
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Enter Class Invite Code</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter an invite code below to join a class. (An invite code contains
            letters and numbers, and consists of 15 characters)
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <Paper className={classes.paper}>
              <TextField
                id="invite_code"
                label="Invite Code"
                variant="outlined"
                required
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
              />
            </Paper>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button type="submit">Enter</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={displayAlert}
        onClose={() => setDisplayAlert(false)}
        className={classes.snackbar}
      >
        <Alert onClose={() => setDisplayAlert(false)} severity={alertState}>
          <AlertTitle>{alertTitleText}</AlertTitle>
          {alertText}
        </Alert>
      </Snackbar>
    </>
  );
}

export default InviteCodeDialog;
