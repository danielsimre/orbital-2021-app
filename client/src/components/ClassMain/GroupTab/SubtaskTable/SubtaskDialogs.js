import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  MenuItem,
  Paper,
  Select,
  TextField,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useState } from "react";

const useStyles = makeStyles({
  deleteButton: {
    color: "red",
  },
});

function SubtaskDialogs(props) {
  const { subtaskObject } = props;

  const assignedList = subtaskObject.assignedTo; // Need to get the full list of members assigned the parent task

  // Dialog values
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Edit Dialog Form Values
  const [subtaskName, setSubtaskName] = useState(subtaskObject.name);
  const [subtaskDesc, setSubtaskDesc] = useState(subtaskObject.desc);
  const [subtaskDueDate, setSubtaskDueDate] = useState(subtaskObject.dueDate);
  const [subtaskAssignedTo, setSubtaskAssignedTo] = useState(
    subtaskObject.assignedTo
  );

  // Edit Dialog Form Error Values
  const [dateError, setDateError] = useState(false);
  const [dateHelperText, setDateHelperText] = useState("");

  // Misc values
  const classes = useStyles();

  function handleEditOpen() {
    setEditDialogOpen(true);
  }

  function handleEditClose() {
    setEditDialogOpen(false);
  }

  function handleDeleteOpen() {
    setDeleteDialogOpen(true);
  }

  function handleDeleteClose() {
    setDeleteDialogOpen(false);
  }

  function handleEditSubtask() {
    // PUT request
    console.log("PUT request");
  }

  function handleDeleteSubtask() {
    // DELETE request
    console.log("DELETE request");
  }

  return (
    <>
      <Button onClick={handleEditOpen}>
        <EditIcon />
      </Button>
      <Button onClick={handleDeleteOpen}>
        <DeleteIcon />
      </Button>
      {/* Start of Edit Subtask Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Subtask</DialogTitle>
        <DialogContent>
          <Paper>
            <form>
              <TextField
                id="task name"
                label="Task Name"
                variant="outlined"
                required
                value={subtaskName}
                onChange={(event) => setSubtaskName(event.target.value)}
              />
              <TextField
                id="task description"
                label="Task Description"
                variant="outlined"
                multiline
                required
                value={subtaskDesc}
                onChange={(event) => setSubtaskDesc(event.target.value)}
              />
              <TextField
                id="date"
                label="Due Date"
                type="date"
                required
                error={dateError}
                helperText={dateHelperText}
                value={subtaskDueDate}
                onChange={(event) => setSubtaskDueDate(event.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              Assigned To:
              <Select multiple value={[]}>
                <MenuItem>Example 1</MenuItem>
                <MenuItem>Example 2</MenuItem>
                <MenuItem>Example 3</MenuItem>
              </Select>
            </form>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubtask}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* End of Edit Subtask Dialog */}
      {/* End of Delete Subtask Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Subtask?</DialogTitle>
        <DialogContentText>
          Are you sure you want to delete this subtask? This action is
          irreversible.
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            className={classes.deleteButton}
            onClick={handleDeleteSubtask}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* End of Delete Subtask Dialog */}
    </>
  );
}

export default SubtaskDialogs;
