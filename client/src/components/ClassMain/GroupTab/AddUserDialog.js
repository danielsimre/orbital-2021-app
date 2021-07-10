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
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";

const useStyles = makeStyles({
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
});

function AddUserDialog(props) {
  // Queried values
  const { groupId, refreshClassData, addableMentors, addableStudents } = props;
  // Form values
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const styles = useStyles();

  function handleDialogOpen() {
    setSelectedMentors([]);
    setSelectedStudents([]);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(selectedMentors.concat(selectedStudents));
    handleAddUsers(selectedMentors.concat(selectedStudents));
    setSelectedMentors([]);
    setSelectedStudents([]);
    handleDialogClose();
  }

  function handleAddUsers(usernames) {
    axios
      .post(
        `/api/v1/groups/${groupId}/users`,
        {
          usernames,
        },
        { withCredentials: true }
      )
      .then((response) => console.log(response))
      .then(() => refreshClassData())
      .catch((err) => console.log(err));
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
            Add users to the group. Students of the class will be added as group
            members, and mentors will be added as group mentors. Students can
            only be in one group, while mentors can been a mentor to many
            groups.
          </DialogContentText>
          Mentors:{" "}
          <Select
            multiple
            value={selectedMentors}
            onChange={(event) => setSelectedMentors(event.target.value)}
          >
            {addableMentors.map((mentorName) => (
              <MenuItem key={mentorName} value={mentorName}>
                {mentorName}
              </MenuItem>
            ))}
          </Select>
          Students:{" "}
          <Select
            multiple
            value={selectedStudents}
            onChange={(event) => setSelectedStudents(event.target.value)}
          >
            {addableStudents.map((studentName) => (
              <MenuItem key={studentName} value={studentName}>
                {studentName}
              </MenuItem>
            ))}
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
