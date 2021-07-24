import { useState } from "react";
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
  TextField,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import EditIcon from "@material-ui/icons/Edit";
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

function RenameGroupDialog(props) {
  // Queried values
  const { groupId, refreshGroupList, isCompleted } = props;

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

  // Form values
  const [newGroupName, setNewGroupName] = useState("");
  const [hasError, setHasError] = useState(false);
  const [helperText, setHelperText] = useState("");

  // Misc values
  const classes = useStyles();

  function handleRenameGroup() {
    if (newGroupName.length < 1) {
      setHasError(true);
      setHelperText("Group name cannot be empty");
    } else {
      axios
        .put(
          `/api/v1/groups/${groupId}`,
          { newName: newGroupName },
          { withCredentials: true }
        )
        .then((res) =>
          handleAlert("Success!", "The group has been renamed.", "success")
        )
        .then(() => {
          setDialogOpen(false);
          refreshGroupList();
        })
        .catch((err) => {
          handleAlert("Error!", err.response.data.msg, "error");
        });
    }
  }

  return (
    <>
      <Tooltip title="Rename group" placement="top">
        <Button
          className={classes.button}
          onClick={handleDialogOpen}
          disabled={isCompleted}
        >
          <EditIcon />
        </Button>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Rename Group</DialogTitle>
        <DialogContent>
          <DialogContentText>Rename the group.</DialogContentText>
          <TextField
            id="groupName"
            label="New Group Name"
            variant="outlined"
            required
            error={hasError}
            helperText={helperText}
            value={newGroupName}
            onChange={(event) => setNewGroupName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleRenameGroup}>Rename</Button>
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

export default RenameGroupDialog;
