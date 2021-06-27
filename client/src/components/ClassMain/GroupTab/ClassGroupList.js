import { useState, useEffect } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";

import AddUserDialog from "../UserTab/AddUserDialog";
import { ClassRoles } from "../../../enums";

const useStyles = makeStyles({
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
    border: "1px solid black",
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
        console.log(response.data);
        setGroupNames("");
        handleDialogClose();
      })
      .then(() => getGroupData(classID))
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
      })
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
      <div>
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
                  Add groups by typing in group names.
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
          <Typography variant="h5">No groups yet! Create one now!</Typography>
        ) : (
          <Table className={classes.table}>
            <TableBody align="center">
              {queriedGroupList.map((curGroup) => (
                <TableRow key={curGroup.id}>
                  <TableCell>Group Name: {curGroup.attributes.name}</TableCell>
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
