import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Snackbar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
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
});

function UserList(props) {
  // Queried values
  const { classID } = useParams();
  const { curUserRole, queriedUserList, refreshClassData } = props;

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Misc values
  const classes = useStyles();
  const userRows = queriedUserList.reduce((cols, key, index) => {
    return (
      (index % 2 === 0 ? cols.push([key]) : cols[cols.length - 1].push(key)) &&
      cols
    );
  }, []);

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
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
                  </Card>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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