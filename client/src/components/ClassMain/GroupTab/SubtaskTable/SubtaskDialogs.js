import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  deleteButton: {
    color: "red",
  },
});

function SubtaskDialogs(props) {
  const { subtaskObject, groupMembers, refreshGroupData, parentDueDate } =
    props;

  // Dialog values
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Edit Dialog Form Values
  const [subtaskName, setSubtaskName] = useState(subtaskObject.attributes.name);
  const [subtaskDesc, setSubtaskDesc] = useState(subtaskObject.attributes.desc);
  const [subtaskDueDate, setSubtaskDueDate] = useState(
    subtaskObject.attributes.dueDate.slice(0, 10)
  );
  const [subtaskAssignedTo, setSubtaskAssignedTo] = useState(
    subtaskObject.attributes.assignedTo.map(
      (groupMember) => groupMember.attributes.username
    )
  );

  // Edit Dialog Form Error Values
  const [dateError, setDateError] = useState(false);
  const [dateHelperText, setDateHelperText] = useState("");

  // Misc values
  const classes = useStyles();

  function handleEditOpen() {
    // Reset all variables if edit is cancelled halfway
    setSubtaskName(subtaskObject.attributes.name);
    setSubtaskDesc(subtaskObject.attributes.desc);
    setSubtaskDueDate(subtaskObject.attributes.dueDate.slice(0, 10));
    setSubtaskAssignedTo(
      subtaskObject.attributes.assignedTo.map(
        (groupMember) => groupMember.attributes.username
      )
    );
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

  function handleEditSubtask(event) {
    event.preventDefault();
    setDateError(false);
    setDateHelperText("");
    if (new Date(subtaskDueDate) > new Date(parentDueDate)) {
      setDateError(true);
      setDateHelperText(
        "Invalid due date (must be earlier than parent task's due date)"
      );
      return;
    }

    axios
      .put(
        `/api/v1/tasks/${subtaskObject.id}?subtasks`,
        {
          name: subtaskName.trim(),
          desc: subtaskDesc.trim(),
          dueDate: subtaskDueDate,
          assignedTo: subtaskAssignedTo,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        refreshGroupData();
      })
      .catch((err) => console.log(err));
    handleEditClose();
  }

  function handleDeleteSubtask() {
    axios
      .delete(`/api/v1/tasks/${subtaskObject.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.msg);
        refreshGroupData();
      })
      .catch((err) => console.log(err));
    handleDeleteClose();
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
          <form
            className={classes.root}
            onSubmit={(event) => handleEditSubtask(event)}
          >
            <TextField
              id="task name"
              label="Task Name"
              variant="outlined"
              required
              value={subtaskName}
              onChange={(event) => {
                // Do not allow spaces at the beginning, one space between words
                const regex = /^[^\s]+(\s?[^\s]+)*(\s)?$/g;
                const value = event.target.value;
                if (value === "" || regex.test(value)) {
                  setSubtaskName(value);
                }
              }}
            />
            <TextField
              id="task description"
              label="Task Description"
              variant="outlined"
              multiline
              required
              value={subtaskDesc}
              onChange={(event) => {
                // Do not allow spaces at the beginning
                const regex = /^[^\s]+(\s+[^\s]+)*(\s)*$/g;
                const value = event.target.value;
                if (value === "" || regex.test(value)) {
                  setSubtaskDesc(value);
                }
              }}
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
            <Select
              multiple
              value={subtaskAssignedTo}
              onChange={(event) => setSubtaskAssignedTo(event.target.value)}
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
              <Button onClick={handleEditClose}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      {/* End of Edit Subtask Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Subtask?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this subtask? This action is
          irreversible.
        </DialogContent>
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
