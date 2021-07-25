import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

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
  const { handleDeleteGroup, isCompleted } = props;
  // Dialog values
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  // Misc values
  const classes = useStyles();

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
    </>
  );
}

export default DeleteGroupDialog;
