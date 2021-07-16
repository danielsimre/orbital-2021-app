import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Typography,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Redirect, useParams } from "react-router-dom";
import { ClassRoles } from "../../../enums";
import axios from "axios";

const useStyles = makeStyles({
  header: {
    textAlign: "center",
    padding: "1rem",
  },
  completeButton: {
    color: "red",
  },
});

function ClassSettings(props) {
  // Queried values
  const { curUserRole, refreshClassData, isCompleted } = props;
  const { classID } = useParams();

  // Class Complete Dialog values
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

  // for the alert
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  function handleDialogOpen() {
    setCompleteDialogOpen(true);
  }

  function handleDialogClose() {
    setCompleteDialogOpen(false);
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  function handleClassComplete() {
    axios
      .put(
        `/api/v1/classes/${classID}?isCompleted`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        handleAlert(
          "Class Locked",
          "The class is now locked. You can still view the class information, but can no longer modify anything.",
          "info"
        );
      })
      .catch((err) => {
        console.log(err);
        handleAlert("Error!", err.response.data.msg, "error");
      })
      .finally(() => {
        setCompleteDialogOpen(false);
        refreshClassData();
        setDisplayAlert(true);
      });
  }

  const classes = useStyles();

  if (curUserRole !== ClassRoles.MENTOR) {
    return <Redirect to={`/classes/${classID}`} />;
  }
  return (
    <>
      <Typography variant="h5" className={classes.header}>
        Class Settings
      </Typography>
      <div>
        <Typography variant="body1">
          End the class: Users can still view the class information, but will no
          longer be able to join the class, create tasks, make modifications,
          etc.
        </Typography>
        <Button onClick={handleDialogOpen}>Mark this class as finished</Button>
      </div>
      <Dialog open={completeDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>End the class?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end this class? You can still view the
            class information, but all class data will be locked and cannot be
            modified ever again. WARNING: THIS ACTION IS IRREVERSIBLE!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            className={classes.completeButton}
            onClick={(event) => handleClassComplete(event)}
          >
            End the class
          </Button>
        </DialogActions>
      </Dialog>
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
  );
}

export default ClassSettings;