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
import { Alert, AlertTitle, Pagination } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";

import AddUserDialog from "./AddUserDialog";
import DeleteGroupDialog from "./DeleteGroupDialog";
import RenameGroupDialog from "./RenameGroupDialog";

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
    marginRight: "0.05em",
    padding: "0.45em",
  },
  table: {
    margin: "0 auto",
    width: "100%",
    borderTop: "1px solid black",
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    margin: "0.2em",
  },
  nogroup: {
    padding: "16px",
    margin: "0 auto",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
});

function ClassGroupList(props) {
  // Queried values
  const { curUserRole, groupSize, groupNames, refreshClassData, isCompleted } =
    props;
  const { classID } = useParams();
  const [queriedGroupList, setQueriedGroupList] = useState([]);

  // Form values
  const [numOfGroups, setNumOfGroups] = useState(1);

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Pagination values
  const ITEMS_PER_PAGE = 6;
  const numPages = Math.ceil(queriedGroupList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState([]);

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      queriedGroupList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  useEffect(() => {
    setDisplayList(
      queriedGroupList.slice(
        ITEMS_PER_PAGE * (page - 1),
        ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE
      )
    );
  }, [queriedGroupList, page]);

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [distributeDialogOpen, setDistributeDialogOpen] = useState(false);
  const classes = useStyles();

  function handleDialogOpen() {
    setNumOfGroups(1);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  function handleDistributeDialogOpen() {
    setDistributeDialogOpen(true);
  }

  function handleDistributeDialogClose() {
    setDistributeDialogOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleAddGroups(numOfGroups);
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
    setDisplayAlert(true);
  }

  function handleAddGroups(numOfGroups) {
    let groups = [];
    let counter = 1;
    if (
      !Number.isInteger(numOfGroups) ||
      numOfGroups < 1 ||
      numOfGroups > 100
    ) {
      handleAlert(
        "Error!",
        "Invalid input. Number of groups must be a number between 1 and 100",
        "error"
      );
      return;
    }

    while (groups.length < numOfGroups) {
      const curGroupName = `Group ${counter}`;
      counter += 1;
      // Checks if there is a group name conflict, if not, add to the array
      if (!groupNames.some((groupName) => groupName === curGroupName)) {
        groups.push(curGroupName);
      }
    }
    axios
      .post(
        `/api/v1/classes/${classID}/groups`,
        {
          groupNames: groups,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.nameConflict.length !== 0) {
          handleAlert(
            "Error!",
            "A group with this name already exists in this class.",
            "error"
          );
        } else {
          handleAlert(
            "Groups Added!",
            "Groups have been added successfully.",
            "success"
          );
        }
      })
      .then(() => getGroupData())
      .then(() => refreshClassData())
      .catch((err) => console.log(err))
      .finally(() => {
        setNumOfGroups(1);
        handleDialogClose();
      });
  }

  // API query for list of groups
  function getGroupData() {
    axios
      .get(`/api/v1/classes/${classID}/groups`, {
        withCredentials: true,
      })
      .then((response) => {
        setQueriedGroupList(response.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  function handleDistribute() {
    axios
      .post(`/api/v1/classes/${classID}/groups/users?auto=students`, {
        withCredentials: true,
      })
      .then((response) => handleAlert("Success!", response.data.msg, "success"))
      .then(() => getGroupData())
      .catch((err) => {
        console.log(err);
        handleAlert(
          "Error!",
          "An error occurred: " + err.response.data.msg,
          "error"
        );
      })
      .finally(() => handleDistributeDialogClose());
  }

  useEffect(() => {
    getGroupData();
  }, []);

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
              <Button
                className={classes.button}
                onClick={handleDialogOpen}
                disabled={isCompleted}
              >
                <AddIcon />
              </Button>
            </Tooltip>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
              <DialogTitle>Add Groups</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Type in the number of groups that you want to add (up to 100).
                </DialogContentText>
                <TextField
                  type="number"
                  autoFocus
                  id="number of groups"
                  label="Number of Groups"
                  fullWidth
                  value={numOfGroups}
                  onChange={(event) => {
                    const regex = /^[0-9]*$/g;
                    const value = event.target.value;
                    if (
                      value !== "" &&
                      regex.test(value) &&
                      Number.parseInt(value) >= 1 &&
                      Number.parseInt(value) <= 100
                    ) {
                      setNumOfGroups(Number.parseInt(value));
                    }
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
              </DialogActions>
            </Dialog>
          </>
          <Button
            className={classes.button}
            onClick={handleDistributeDialogOpen}
            disabled={isCompleted}
          >
            Auto-distribute
          </Button>
          <Dialog
            open={distributeDialogOpen}
            onClose={handleDistributeDialogClose}
          >
            <DialogTitle>Auto-distribute Users</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to automatically allocate all students to
                a group?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDistributeDialogClose}>Cancel</Button>
              <Button onClick={handleDistribute}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </div>
        {queriedGroupList.length === 0 ? (
          <Typography variant="h5">No groups yet.</Typography>
        ) : (
          <Table className={classes.table}>
            <TableBody align="center">
              {displayList.map((curGroup) => (
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
                      groupId={curGroup.id}
                      addableMentors={curGroup.attributes.addableMentors}
                      addableStudents={curGroup.attributes.addableStudents}
                      refreshClassData={refreshClassData}
                      curGroupSize={curGroup.attributes.groupMembers.length}
                      groupSizeLimit={groupSize}
                      isCompleted={isCompleted}
                    />
                    <DeleteGroupDialog
                      groupId={curGroup.id}
                      refreshClassData={refreshClassData}
                      refreshGroupList={getGroupData}
                      isCompleted={isCompleted}
                    />
                    <RenameGroupDialog
                      groupId={curGroup.id}
                      refreshClassData={refreshClassData}
                      refreshGroupList={getGroupData}
                      isCompleted={isCompleted}
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
        {numPages < 2 || (
          <Pagination
            count={numPages}
            page={page}
            onChange={handleChange}
            className={classes.pagination}
          />
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
