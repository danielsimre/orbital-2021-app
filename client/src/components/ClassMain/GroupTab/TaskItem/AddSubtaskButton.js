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
  TextField,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    marginLeft: "auto",
  },
});

function AddSubtaskButton(props) {
  // Queried values
  const { parentDueDate, refreshGroupData, taskId, groupMembers, isCompleted } =
    props;

  // Form values
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [newSubtaskDesc, setNewSubtaskDesc] = useState("");
  const [newSubtaskDueDate, setNewSubtaskDueDate] = useState(
    parentDueDate.slice(0, 10)
  );
  const [newSubtaskAssignedTo, setNewSubtaskAssignedTo] = useState([]);

  // Edit Dialog Form Error Values
  const [dateError, setDateError] = useState(false);
  const [dateHelperText, setDateHelperText] = useState("");

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  function handleDialogOpen() {
    setNewSubtaskName("");
    setNewSubtaskDesc("");
    setNewSubtaskDueDate(parentDueDate.slice(0, 10));
    setNewSubtaskAssignedTo([]);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleAddSubtask(event) {
    event.preventDefault();
    setDateError(false);
    setDateHelperText("");
    if (new Date(newSubtaskDueDate) > new Date(parentDueDate)) {
      setDateError(true);
      setDateHelperText(
        "Invalid due date (must be earlier than parent task's due date)"
      );
      return;
    }

    axios
      .post(
        `/api/v1/tasks/${taskId}`,
        {
          taskName: newSubtaskName,
          taskDesc: newSubtaskDesc,
          dueDate: newSubtaskDueDate,
          assignedTo: newSubtaskAssignedTo,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        refreshGroupData();
      })
      .catch((err) => console.log(err));
    handleDialogClose();
  }

  return (
    <>
      <Button
        className={classes.button}
        onClick={handleDialogOpen}
        disabled={isCompleted}
      >
        Add Subtask
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Subtasks</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create subtasks to manage your work better.
          </DialogContentText>
          <form
            className={classes.root}
            onSubmit={(event) => handleAddSubtask(event)}
          >
            <TextField
              id="subtask name"
              label="Name"
              variant="outlined"
              required
              value={newSubtaskName}
              onChange={(event) => setNewSubtaskName(event.target.value)}
            />
            <TextField
              id="subtask description"
              label="Description"
              variant="outlined"
              required
              multiline
              value={newSubtaskDesc}
              onChange={(event) => setNewSubtaskDesc(event.target.value)}
            />
            <TextField
              id="date"
              label="Due Date"
              type="date"
              required
              error={dateError}
              helperText={dateHelperText}
              value={newSubtaskDueDate}
              onChange={(event) => setNewSubtaskDueDate(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            Assigned To:
            <Select
              multiple
              value={newSubtaskAssignedTo}
              onChange={(event) => setNewSubtaskAssignedTo(event.target.value)}
            >
              {groupMembers.map((groupMember) => (
                <MenuItem
                  key={groupMember.attributes.username}
                  value={groupMember.attributes.username}
                >
                  {groupMember.attributes.username}
                </MenuItem>
              ))}
            </Select>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button type="submit">Add Subtask</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddSubtaskButton;
