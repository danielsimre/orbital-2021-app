import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Snackbar,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";

const useStyles = makeStyles({
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
  snackbar: {
    textAlign: "center",
  },
});

function AddUserDialog(props) {
  // Queried values
  const {
    groupId,
    refreshClassData,
    addableMentors,
    addableStudents,
    curGroupSize,
    groupSizeLimit,
    isCompleted,
  } = props;

  // Form values
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  function handleDialogOpen() {
    setSelectedMentors([]);
    setSelectedStudents([]);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleAddUsers(selectedMentors.concat(selectedStudents));
    setSelectedMentors([]);
    setSelectedStudents([]);
    handleDialogClose();
  }

  function handleSelectStudents(students) {
    if (students.length > groupSizeLimit - curGroupSize) {
      handleAlert(
        "Error!",
        `You can only add up to ${
          groupSizeLimit - curGroupSize
        } group members to this group`,
        "error"
      );
    } else {
      setSelectedStudents(students);
    }
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
    setDisplayAlert(true);
  }

  function handleAddUsers(usernames) {
    axios
      .post(
        `/api/v1/groups/${groupId}/users`,
        {
          usernames,
        },
        { withCredentials: true }
      )
      .then((response) => console.log(response))
      .then(
        (res) =>
          handleAlert(
            "Users Added!",
            "Users have been successfully added to the group!",
            "success"
          ),
        (err) => handleAlert("Error!", err.response.data.msg, "error")
      )
      .then(() => refreshClassData())
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Tooltip title="Add Users" placement="top">
        <Button
          className={classes.button}
          onClick={handleDialogOpen}
          disabled={isCompleted}
        >
          <AddIcon />
        </Button>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Users</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add users to the group. Students of the class will be added as group
            members, and mentors will be added as group mentors. Students can
            only be in one group, while mentors can been a mentor to many
            groups. (Current group size limit is {groupSizeLimit})
          </DialogContentText>
          Mentors:{" "}
          <Select
            multiple
            value={selectedMentors}
            onChange={(event) => setSelectedMentors(event.target.value)}
          >
            {addableMentors.map((mentorName) => (
              <MenuItem key={mentorName} value={mentorName}>
                {mentorName}
              </MenuItem>
            ))}
          </Select>
          Students:{" "}
          <Select
            multiple
            value={selectedStudents}
            onChange={(event) => handleSelectStudents(event.target.value)}
          >
            {addableStudents.map((studentName) => (
              <MenuItem key={studentName} value={studentName}>
                {studentName}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
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

export default AddUserDialog;
