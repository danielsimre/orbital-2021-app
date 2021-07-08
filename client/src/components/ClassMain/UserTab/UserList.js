import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
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
    refreshClassData,
    creatorId,
    curUserData,
  } = props;

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Pagination values
  const ITEMS_PER_PAGE = 6;
  const numPages = Math.ceil(queriedUserList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState(
    queriedUserList.slice(0, ITEMS_PER_PAGE)
  );

  // Misc values
  const classes = useStyles();
  const userRows = displayList.reduce((cols, key, index) => {
    return (
      (index % 2 === 0 ? cols.push([key]) : cols[cols.length - 1].push(key)) &&
      cols
    );
  }, []);

  const isOwner = curUserData.id === creatorId;

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      queriedUserList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  // Current only handles adding 1 at a time
  function handleAddUsers(userEmails, newUserRole) {
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
        // Alert message current only handles one user
        if (response.data.doesNotExist.length !== 0) {
          handleAlert("Error!", "The user does not exist.", "error");
        } else if (response.data.alreadyAdded.length !== 0) {
          handleAlert("Error!", "The user has already been added.", "error");
        } else {
          handleAlert(
            "User Added!",
            "The user has been added successfully.",
            "success"
          );
        }
      })
      .then(() => refreshClassData(classID))
      .then(() => setDisplayAlert(true))
      .catch((err) => console.log(err));
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
                    {
                      /* Check if owner or if mentor, but mentor can only remove student */
                      (isOwner ||
                        (curUserRole === ClassRoles.MENTOR &&
                          curUser.role === ClassRoles.STUDENT)) && (
                        <CardActions>
                          <Tooltip title="Remove user from class">
                            <Button>
                              <CloseIcon />
                            </Button>
                          </Tooltip>
                        </CardActions>
                      )
                    }
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
  );
}

export default UserList;
