import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";

import AddUserDialog from "./AddUserDialog";
import { ClassRoles } from "../../../enums";

const useStyles = makeStyles({
  tableHeader: {
    display: "flex",
    justifyContent: "center",
  },
  tableTitle: {
    flex: "0 1",
    padding: "0.5em",
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
});

function UserList(props) {
  // Queried values
  const { classID } = useParams();
  const { curUserRole, queriedUserList, refreshClassData } = props;

  // Misc values
  const classes = useStyles();
  const userRows = queriedUserList.reduce((cols, key, index) => {
    return (
      (index % 2 === 0 ? cols.push([key]) : cols[cols.length - 1].push(key)) &&
      cols
    );
  }, []);

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
        console.log(response.data);
      })
      .then(() => refreshClassData(classID))
      .catch((err) => console.log(err));
  }

  return (
    <div>
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
            <TableRow>
              {curRow.map((curUser) => (
                <TableCell key={curUser.userId.attributes.username}>
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
    </div>
  );
}

export default UserList;
