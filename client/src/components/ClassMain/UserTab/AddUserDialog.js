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
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { ClassRoles } from "../../../enums";

const useStyles = makeStyles({
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
});

function AddUserDialog(props) {
  // Queried values
  const { handleAddUsers } = props;

  // Form values
  const [userEmails, setUserEmails] = useState("");
  const [newUserRole, setNewUserRole] = useState("STUDENT");

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const styles = useStyles();

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleAddUsers(userEmails, newUserRole);
    setUserEmails("");
    handleDialogClose();
  }

  return (
    <>
      <Tooltip title="Add Users" placement="top">
        <Button className={styles.button} onClick={handleDialogOpen}>
          <AddIcon />
        </Button>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Users</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a user by typing in their email.
          </DialogContentText>
          <TextField
            autoFocus
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={userEmails}
            onChange={(event) => setUserEmails(event.target.value)}
          />
          <Select
            value={newUserRole}
            onChange={(event) => setNewUserRole(event.target.value)}
            label="New User Role"
          >
            <MenuItem value={ClassRoles.STUDENT}>Student</MenuItem>
            <MenuItem value={ClassRoles.MENTOR}>Mentor</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddUserDialog;
