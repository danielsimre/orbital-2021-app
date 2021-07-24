import { useState } from "react";
import { useParams } from "react-router";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";

const useStyles = makeStyles({
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
  deleteButton: {
    color: "red",
  },
  snackbar: {
    textAlign: "center",
  },
});

function DeleteGroupDialog(props) {
  // Queried values
  const { groupId, refreshClassData, refreshGroupList, isCompleted } = props;
  const { classID } = useParams();
  // Dialog values
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
    setDisplayAlert(true);
  }

  // Misc values
  const classes = useStyles();

  function handleDeleteGroup() {
    axios
      .delete(`/api/v1/groups/${groupId}`, { withCredentials: true })
      .then((res) =>
        handleAlert("Group removed!", "The group has been removed", "success")
      )
      .then(() => {
        setDialogOpen(false);
        refreshClassData(classID);
        refreshGroupList(classID);
      })
      .catch((err) => {
        handleAlert("Error!", err.response.data.msg, "error");
      });
  }

  return (
    <>
      <Tooltip title="Delete group" placement="top">
        <Button
          className={classes.button}
          onClick={handleDialogOpen}
          disabled={isCompleted}
        >
          <DeleteIcon />
        </Button>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Delete Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this group? This action is
            irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button className={classes.deleteButton} onClick={handleDeleteGroup}>
            Delete
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

export default DeleteGroupDialog;
