import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
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

function AddUserDialog(props) {
  // Form values
  const [userEmails, setUserEmails] = useState("");
  const [newUserRole, setNewUserRole] = useState("STUDENT");

  const { handleAddUsers } = props;
  const [dialogOpen, setDialogOpen] = useState(false);

  const styles = useStyles();

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddUsers(userEmails, newUserRole);
    setUserEmails("");
    handleDialogClose();
  };

  return (
    <>
      <Button className={styles.button} onClick={handleDialogOpen}>
        <AddIcon />
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Users</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add user(s) by typing in their emails.
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
            <MenuItem value={"STUDENT"}>Student</MenuItem>
            <MenuItem value={"MENTOR"}>Mentor</MenuItem>
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
