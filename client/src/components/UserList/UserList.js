import {
  makeStyles,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";

import AddUserDialog from "../AddUserDialog";

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

  // Queried values
  const { curUserRole, queriedUserList, refreshClassData } = props;

  const classes = useStyles();

  const userRows = queriedUserList.reduce((cols, key, index) => {
    return (
      (index % 2 === 0 ? cols.push([key]) : cols[cols.length - 1].push(key)) &&
      cols
    );
  }, []);

  // Current only handles adding 1 at a time
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
      })
      .then(() => refreshClassData(classID))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className={classes.tableHeader}>
        <h2 className={classes.tableTitle}>Users</h2>
        {
          // If user is a mentor, render the add users button
          curUserRole === "STUDENT" || (
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
                  {curUser.userId.attributes.username}
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
