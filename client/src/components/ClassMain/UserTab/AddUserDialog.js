import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  MenuItem,
  Select,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Papa from "papaparse";

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
  const [userEmailsCSV, setUserEmailsCSV] = useState(null);
  const [newUserRole, setNewUserRole] = useState("STUDENT");

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function parseCSV() {
    Papa.parse(userEmailsCSV, {
      complete: function (results, file) {
        console.log("Parsing complete");
        handleAddUsers(
          results.data.flat().filter((email) => email !== ""),
          newUserRole
        );
      },
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    parseCSV();
    setUserEmailsCSV(null);
    handleDialogClose();
  }

  return (
    <>
      <Tooltip title="Add Users" placement="top">
        <Button className={classes.button} onClick={handleDialogOpen}>
          <AddIcon />
        </Button>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Users</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add users to this class by uploading a csv file <br />
            containing the emails of the users you want to add.
          </DialogContentText>
          <div>
            <Input
              type="file"
              inputProps={{ accept: ".csv" }}
              name="file"
              placeholder={null}
              onChange={(event) => setUserEmailsCSV(event.target.files[0])}
            />
          </div>
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
