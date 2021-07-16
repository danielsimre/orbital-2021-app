import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Snackbar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Alert, AlertTitle, Pagination } from "@material-ui/lab";
import axios from "axios";

import AddUserDialog from "./AddUserDialog";
import { ClassRoles } from "../../../enums";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    overflow: "auto",
  },
  table: {
    margin: "0 auto",
    width: "100%",
    borderTop: "1px solid black",
  },
  tableRow: {
    border: "none",
  },
  tableCell: {
    border: "none",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "center",
  },
  tableTitle: {
    flex: "0 1",
    padding: "0.5em",
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
  deleteButton: {
    color: "red",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
});

function UserList(props) {
  // Queried values
  const { classID } = useParams();
  const {
    curUserRole,
    queriedUserList,
    creatorId,
    refreshClassData,
    curUserData,
  } = props;

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Dialog values
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [curUserId, setCurUserId] = useState(null);

  // Pagination values
  const ITEMS_PER_PAGE = 6;
  const numPages = Math.ceil(queriedUserList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState(
    queriedUserList.slice(0, ITEMS_PER_PAGE)
  );

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      queriedUserList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  useEffect(() => {
    setDisplayList(
      queriedUserList.slice(
        ITEMS_PER_PAGE * (page - 1),
        ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE
      )
    );
  }, [queriedUserList, page]);

  // Misc values
  const classes = useStyles();
  const userRows = displayList.reduce((cols, key, index) => {
    return (
      (index % 2 === 0 ? cols.push([key]) : cols[cols.length - 1].push(key)) &&
      cols
    );
  }, []);

  const isCreator = curUserData.id === creatorId;

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
    setDisplayAlert(true);
  }

  function handleDeleteOpen(userId) {
    setDeleteDialogOpen(true);
    setCurUserId(userId);
  }

  function handleDeleteClose() {
    setDeleteDialogOpen(false);
  }

  function handleAddUsers(userEmails, newUserRole) {
    axios
      .post(
        `/api/v1/classes/${classID}/users`,
        {
          userEmails: userEmails,
          newUserRole: newUserRole,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        const message = `User does not exist for emails: ${response.data.doesNotExist} \n
        User is already in the class: ${response.data.alreadyAdded} \n
        Sucessfully added users: ${response.data.successfullyAdded}`;
        if (response.data.successfullyAdded.length === 0) {
          handleAlert("Failure!", message, "error");
        } else {
          handleAlert(
            `${response.data.successfullyAdded.length} users added!`,
            message,
            "success"
          );
        }
      })
      .then(() => refreshClassData(classID))
      .catch((err) => console.log(err));
  }

  function handleDeleteUser(event) {
    event.preventDefault();
    axios
      .delete(`/api/v1/classes/${classID}/users/${curUserId}`, {
        withCredentials: true,
      })
      .then((res) => handleAlert("Success!", res.data.msg, "success"))
      .catch((err) => {
        console.log(err);
        handleAlert("Error!", err, "error");
      })
      .finally(() => {
        // clean up state
        setCurUserId(null);
        setDeleteDialogOpen(false);
        refreshClassData(classID);
      });
  }

  return (
    <div className={classes.root}>
      <div className={classes.tableHeader}>
        <Typography variant="h5" className={classes.tableTitle}>
          Users
        </Typography>
        {
          // If user is a mentor, render the add users button
          curUserRole === ClassRoles.MENTOR && (
            <AddUserDialog handleAddUsers={handleAddUsers} />
          )
        }
      </div>
      <Table className={classes.table}>
        <TableBody align="center">
          {userRows.map((curRow, index) => (
            <TableRow className={classes.tableRow}>
              {curRow.map((curUser) => (
                <TableCell
                  className={classes.tableCell}
                  key={curUser.userId.attributes.username}
                >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">
                        {curUser.userId.attributes.username}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Role: {curUser.role}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Email: {curUser.userId.attributes.email}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {
                        /* Button only clickable if:
                      1) The user is not yourself AND either
                      2a) You are the creator of the class OR
                      2b) You are a mentor AND the user is a student */
                        curUser.userId.id !== curUserData.id &&
                        (isCreator ||
                          (curUserRole === ClassRoles.MENTOR &&
                            curUser.role === ClassRoles.STUDENT)) ? (
                          <Tooltip title="Remove user from class">
                            <Button
                              onClick={() =>
                                handleDeleteOpen(curUser.userId.id)
                              }
                            >
                              <CloseIcon />
                            </Button>
                          </Tooltip>
                        ) : (
                          <Button disabled>
                            <CloseIcon />
                          </Button>
                        )
                      }
                    </CardActions>
                  </Card>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {numPages < 2 || (
        <Pagination
          count={numPages}
          page={page}
          onChange={handleChange}
          className={classes.pagination}
        />
      )}
      <Snackbar
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        open={displayAlert}
        onClose={() => setDisplayAlert(false)}
      >
        <Alert onClose={() => setDisplayAlert(false)} severity={alertState}>
          <AlertTitle>{alertTitleText}</AlertTitle>
          {alertText}
        </Alert>
      </Snackbar>
      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Remove User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this user from the class? This
            action is irreversible, but you can add the user again in the
            future.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            className={classes.deleteButton}
            onClick={(event) => handleDeleteUser(event)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserList;
