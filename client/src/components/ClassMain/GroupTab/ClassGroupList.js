import { useState, useEffect } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";

import AddUserDialog from "../UserTab/AddUserDialog";
import { ClassRoles } from "../../../enums";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    overflow: "auto",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "center",
  },
  tableTitle: {
    flex: "0 1",
    marginRight: "0.5em",
    padding: "16px",
  },
  table: {
    margin: "0 auto",
    width: "100%",
    borderTop: "1px solid black",
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
  nogroup: {
    padding: "16px",
    margin: "0 auto",
  },
});

function ClassGroupList(props) {
  // Queried values
  const { curUserRole } = props;
  const { classID } = useParams();
  const [queriedGroupList, setQueriedGroupList] = useState([]);

  // Form values
  const [groupNames, setGroupNames] = useState("");

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleAddGroups(groupNames);
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  // Current only handles adding 1 at a time
  function handleAddGroups(groupNames) {
    axios
      .post(
        `/api/v1/classes/${classID}/groups`,
        {
          groupNames: [groupNames],
        },
        { withCredentials: true }
      )
      .then((response) => {
        // Alert message current only handles one group
        if (response.data.nameConflict.length !== 0) {
          handleAlert(
            "Error!",
            "A group with this name already exists in this class.",
            "error"
          );
        } else {
          handleAlert(
            "Group Added!",
            "The group has been added successfully.",
            "success"
          );
        }
        setGroupNames("");
        handleDialogClose();
      })
      .then(() => getGroupData(classID))
      .then(() => setDisplayAlert(true))
      .catch((err) => console.log(err));
  }

  // Current only handles adding 1 at a time
  function handleAddUsersToGroups(groupID, userEmails, newUserRole) {
    // Edit this when adding group leaders are implemented
    if (newUserRole === ClassRoles.STUDENT) {
      newUserRole = "GROUPMEMBER";
    }
    axios
      .post(
        `/api/v1/groups/${groupID}/users`,
        {
          userEmails: [userEmails],
          newUserRole: newUserRole,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        // Alert message current only handles one user
        if (response.data.doesNotExist.length !== 0) {
          handleAlert("Error!", "This user does not exist.", "error");
        } else if (response.data.notInClass.length !== 0) {
          handleAlert("Error!", "This user is not in the class.", "error");
        } else if (response.data.alreadyHasGroup.length !== 0) {
          handleAlert(
            "Error!",
            "This user already has a group or is already in this group.",
            "error"
          );
        } else if (response.data.roleMismatch.length !== 0) {
          handleAlert(
            "Error!",
            "This user cannot be added as that role. " +
              "(Mentors in the class can only be added as group mentors, " +
              "and students can only be added as group members)",
            "error"
          );
        } else {
          handleAlert(
            "User Added!",
            "The user has been added successfully.",
            "success"
          );
        }
      })
      .then(() => setDisplayAlert(true))
      .catch((err) => console.log(err));
  }

  function getGroupData(classID) {
    axios
      .get(`/api/v1/classes/${classID}/groups`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setQueriedGroupList(response.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => {
    getGroupData(classID);
  }, [classID]);

  // If the user is a mentor, display the add groups button + all groups this mentor is mentoring
  // Else, if the user is a student, redirect them directly to their group page if they have a group,
  // and display a message if they are not.
  return (
    isRetrieving ||
    (curUserRole === "MENTOR" ? (
      <div className={classes.root}>
        <div className={classes.tableHeader}>
          <Typography variant="h5" className={classes.tableTitle}>
            Groups
          </Typography>
          <>
            <Tooltip title="Create groups for this class" placement="top">
              <Button className={classes.button} onClick={handleDialogOpen}>
                <AddIcon />
              </Button>
            </Tooltip>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
              <DialogTitle>Add Groups</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Add a group by typing in a group name.
                </DialogContentText>
                <TextField
                  autoFocus
                  id="group names"
                  label="Group Name"
                  fullWidth
                  value={groupNames}
                  onChange={(event) => setGroupNames(event.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
              </DialogActions>
            </Dialog>
          </>
        </div>
        {queriedGroupList.length === 0 ? (
          <Typography variant="h5">No groups yet.</Typography>
        ) : (
          <Table className={classes.table}>
            <TableBody align="center">
              {queriedGroupList.map((curGroup) => (
                <TableRow key={curGroup.id}>
                  <TableCell>{curGroup.attributes.name}</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/classes/${classID}/groups/${curGroup.id}`}
                    >
                      View Group
                    </Button>
                  </TableCell>
                  <TableCell>
                    <AddUserDialog
                      handleAddUsers={(userEmails, newUserRole) =>
                        handleAddUsersToGroups(
                          curGroup.id,
                          userEmails,
                          newUserRole
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={displayAlert}
          onClose={() => setDisplayAlert(false)}
        >
          <Alert onClose={() => setDisplayAlert(false)} severity={alertState}>
            <AlertTitle>{alertTitleText}</AlertTitle>
            {alertText}
          </Alert>
        </Snackbar>
      </div>
    ) : queriedGroupList.length !== 0 ? (
      <Redirect to={`/classes/${classID}/groups/${queriedGroupList[0].id}`} />
    ) : (
      <Typography variant="h5" className={classes.nogroup}>
        Not in a group! Wait for your teachers to add you to one.{" "}
      </Typography>
    ))
  );
}

export default ClassGroupList;
