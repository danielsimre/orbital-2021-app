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
import { useParams } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles({
  tableHeader: {
    display: "flex",
    justifyContent: "center",
  },
  tableTitle: {
    flex: "0 1",
    marginRight: "0.5em",
  },
  table: {
    margin: "0 auto",
    width: "100%",
    border: "1px solid black",
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
});

function UserList(props) {
  const { classID } = useParams();
  // Form values
  const [userEmails, setUserEmails] = useState("");
  const [newUserRole, setNewUserRole] = useState("STUDENT");

  // Queried values
  const { curUserRole, queriedUserList, refreshClassData } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const styles = useStyles();

  const userRows = queriedUserList.reduce((cols, key, index) => {
    return (
      (index % 2 === 0 ? cols.push([key]) : cols[cols.length - 1].push(key)) &&
      cols
    );
  }, []);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddUsers(userEmails, newUserRole);
  };

  // Current only handles adding 1 at a time, and only students
  const handleAddUsers = (userEmails, newUserRole) => {
    axios
      .post(
        `/api/v1/classes/${classID}/users`,
        {
          userEmails: [userEmails],
          newUserRole: newUserRole,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        setUserEmails("");
        handleDialogClose();
      })
      .then(() => refreshClassData(classID))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>Users</h2>
        {
          // If user is a mentor, render the add users button
          curUserRole === "STUDENT" || (
            <>
              <Button className={styles.button} onClick={handleDialogOpen}>
                <AddIcon />
              </Button>
              <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle id="form-dialog-title">Add Users</DialogTitle>
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
          )
        }
      </div>
      <table className={styles.table}>
        <tbody align="center">
          {userRows.map((curRow) => (
            <tr>
              {curRow.map((curUser) => (
                <td>{curUser.userId.attributes.username}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
