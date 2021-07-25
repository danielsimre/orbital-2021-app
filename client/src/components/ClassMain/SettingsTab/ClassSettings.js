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
  button: {
    border: "1px solid black",
    alignSelf: "center",
    margin: "0.2em",
    marginLeft: "0.5em",
  },
});

function ClassSettings(props) {
  // Queried values
  const {
    curUserRole,
    refreshClassData,
    studentInviteCode,
    mentorInviteCode,
    isCompleted,
    isCreator,
  } = props;
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

  function handleGenerateStudentInviteCode() {
    axios
      .put(`/api/v1/classes/${classID}?studentInviteCode`, {
        withCredentials: true,
      })
      .then(() => refreshClassData())
      .catch((error) =>
        console.log(`Could not find class with ID: ${classID}`)
      );
  }

  function handleGenerateMentorInviteCode() {
    axios
      .put(`/api/v1/classes/${classID}?mentorInviteCode`, {
        withCredentials: true,
      })
      .then(() => refreshClassData())
      .catch((error) =>
        console.log(`Could not find class with ID: ${classID}`)
      );
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
        refreshClassData(classID);
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
        <div>
          Student Invite Code: {studentInviteCode}
          <Button
            className={classes.button}
            onClick={handleGenerateStudentInviteCode}
            disabled={isCompleted}
          >
            Generate New Code
          </Button>
        </div>
        <div>
          Mentor Invite Code: {mentorInviteCode}
          <Button
            className={classes.button}
            onClick={handleGenerateMentorInviteCode}
            disabled={isCompleted}
          >
            Generate New Code
          </Button>
        </div>
      </div>
      {isCreator && (
        <div>
          <Typography variant="body1">
            End the class: Users can still view the class information, but will
            no longer be able to join the class, create tasks, make
            modifications, etc.
          </Typography>
          <Button onClick={handleDialogOpen}>
            Mark this class as finished
          </Button>
        </div>
      )}
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
            // TODO: Leave as commented until ready
            // disabled={isCompleted}
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
