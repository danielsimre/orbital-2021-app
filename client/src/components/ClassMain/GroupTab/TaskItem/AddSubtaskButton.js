import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  makeStyles,
} from "@material-ui/core";

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
  const { subtaskList, refreshGroupData, taskId } = props;

  // Form values
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [newSubtaskDesc, setNewSubtaskDesc] = useState("");

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const styles = useStyles();

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  return (
    <>
      <Button className={styles.button} onClick={handleDialogOpen}>
        Add Subtask
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Subtasks</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create subtasks to manage your work better.
          </DialogContentText>
          <form>
            <div className={styles.root}>
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
            </div>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button>Add Subtask</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddSubtaskButton;
