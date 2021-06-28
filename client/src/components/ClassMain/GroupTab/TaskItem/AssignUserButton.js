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
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles({
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
});

function AssignUserButton(props) {
  // Queried values
  const { assignedUsers } = props;

  // Form values
  const [userEmail, setUserEmail] = useState(false);

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleAssignUser() {
    setUserEmail("");
    handleDialogClose();
  }

  return (
    <>
      <Button className={classes.button} onClick={handleDialogOpen}>
        <AddIcon />
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Propagate Task List</DialogTitle>
        <DialogContent>
          {assignedUsers.map((assignedUser) => (
            <></>
          ))}
          <DialogContentText>
            Add new tasks to the framework, which can be saved and propagated to
            all groups.
          </DialogContentText>
          <form>
            <div className={classes.root}>
              <TextField
                id="user email"
                label="Email"
                variant="outlined"
                required
                value={userEmail}
                onChange={(event) => setUserEmail(event.target.value)}
              />
            </div>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button
                type="submit"
                onClick={(event) => handleAssignUser(event)}
              >
                Assign User
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AssignUserButton;
