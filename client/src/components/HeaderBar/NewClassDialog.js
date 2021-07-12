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
});

function NewClassDialog(props) {
  const { refreshClassList } = props;

  // Form values
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
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
    handleNewClass(className, classDescription);
  }

  function handleDialogOpen() {
    setClassName("");
    setClassDescription("");
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleNewClass(name, desc) {
    axios
      .post(
        "/api/v1/classes/",
        {
          name: name,
          desc: desc,
        },
        { withCredentials: true }
      )
      .then(
        (res) =>
          handleAlert(
            "Class Created!",
            "The class has been created successfully!",
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
      <Button onClick={handleDialogOpen}>Create New Class</Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Create New Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter in a name and description for the class.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <Paper className={classes.paper}>
              <TextField
                id="class_name"
                label="Class Name"
                variant="outlined"
                required
                value={className}
                onChange={(event) => setClassName(event.target.value)}
              />
              <TextField
                id="class_descrption"
                label="Class Description"
                variant="outlined"
                multiline
                required
                value={classDescription}
                onChange={(event) => setClassDescription(event.target.value)}
              />
            </Paper>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button type="submit">Create</Button>
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

export default NewClassDialog;