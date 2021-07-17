import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Pagination } from "@material-ui/lab";
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
    padding: "0.5em",
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
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
  userButton: {
    marginLeft: "auto",
    color: "red",
  },
  userCard: {
    display: "flex",
    justifyContent: "space-between",
  },
  deleteButton: {
    color: "red",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
});

function GroupUserList(props) {
  // Queried values
  const { groupMembers, mentors, isCreator, curUserId, isCompleted } = props;

  // Pagination values
  const ITEMS_PER_PAGE = 4;
  const numMemberPages = Math.ceil(groupMembers.length / ITEMS_PER_PAGE);
  const [memberPage, setMemberPage] = useState(1);
  const [displayMemberList, setDisplayMemberList] = useState(
    groupMembers.slice(0, ITEMS_PER_PAGE)
  );
  const numMentorPages = Math.ceil(mentors.length / ITEMS_PER_PAGE);
  const [mentorPage, setMentorPage] = useState(1);
  const [displayMentorList, setDisplayMentorList] = useState(
    mentors.slice(0, ITEMS_PER_PAGE)
  );

  function handleMemberChange(event, value) {
    setMemberPage(value);
    setDisplayMemberList(
      groupMembers.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  function handleMentorChange(event, value) {
    setMentorPage(value);
    setDisplayMentorList(
      mentors.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  // Dialog values
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  function handleDeleteOpen(userId) {
    setDeleteDialogOpen(true);
    setDeleteUserId(userId);
  }

  function handleDeleteClose() {
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
  }

  function handleDeleteUser(event) {
    event.preventDefault();
    console.log(`Deleting user ${deleteUserId}...`);
  }

  useEffect(() => {
    setMemberPage(memberPage);
    setDisplayMemberList(
      groupMembers.slice(
        ITEMS_PER_PAGE * (memberPage - 1),
        ITEMS_PER_PAGE * (memberPage - 1) + ITEMS_PER_PAGE
      )
    );
  }, [groupMembers, memberPage]);

  useEffect(() => {
    setMentorPage(mentorPage);
    setDisplayMentorList(
      mentors.slice(
        ITEMS_PER_PAGE * (mentorPage - 1),
        ITEMS_PER_PAGE * (mentorPage - 1) + ITEMS_PER_PAGE
      )
    );
  }, [mentors, mentorPage]);

  // Misc values
  const classes = useStyles();
  const memberRows = displayMemberList.reduce((cols, key, index) => {
    return (
      (index % 2 === 0 ? cols.push([key]) : cols[cols.length - 1].push(key)) &&
      cols
    );
  }, []);
  const mentorRows = displayMentorList.reduce((cols, key, index) => {
    return (
      (index % 2 === 0 ? cols.push([key]) : cols[cols.length - 1].push(key)) &&
      cols
    );
  }, []);

  return (
    <div>
      <div className={classes.tableHeader}>
        <Typography variant="h5" className={classes.tableTitle}>
          Group Members
        </Typography>
      </div>
      <Table className={classes.table}>
        <TableBody align="center">
          {memberRows.map((curRow, index) => (
            <TableRow className={classes.tableRow}>
              {curRow.map((curUser) => (
                <TableCell
                  className={classes.tableCell}
                  key={curUser.attributes.username}
                >
                  <Card variant="outlined">
                    <CardContent className={classes.userCard}>
                      <div>
                        <Typography variant="h6">
                          {curUser.attributes.username}
                        </Typography>
                      </div>
                      <div>
                        {
                          /* Button only clickable if:
                      1) The user is not yourself AND either
                      2a) You are the creator of the class OR
                      2b) You are a mentor AND the user is a student */
                          curUser.id !== curUserId &&
                            (isCreator ||
                              (curUser.role === ClassRoles.MENTOR &&
                                curUser.role === ClassRoles.STUDENT)) && (
                              <Tooltip title="Remove user from group">
                                <Button
                                  onClick={() => handleDeleteOpen(curUser.id)}
                                  className={classes.userButton}
                                  disabled={isCompleted}
                                >
                                  <CloseIcon />
                                </Button>
                              </Tooltip>
                            )
                        }
                      </div>
                    </CardContent>
                  </Card>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {numMemberPages < 2 || (
        <Pagination
          count={numMemberPages}
          page={memberPage}
          onChange={handleMemberChange}
          className={classes.pagination}
        />
      )}
      <div className={classes.tableHeader}>
        <Typography variant="h5" className={classes.tableTitle}>
          Mentors
        </Typography>
      </div>
      <Table className={classes.table}>
        <TableBody align="center">
          {mentorRows.map((curRow, index) => (
            <TableRow className={classes.tableRow}>
              {curRow.map((curUser) => (
                <TableCell
                  className={classes.tableCell}
                  key={curUser.attributes.username}
                >
                  <Card variant="outlined">
                    <CardContent className={classes.userCard}>
                      <Typography variant="h6">
                        {curUser.attributes.username}
                      </Typography>
                    </CardContent>
                  </Card>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {numMentorPages < 2 || (
        <Pagination
          count={numMentorPages}
          page={mentorPage}
          onChange={handleMentorChange}
          className={classes.pagination}
        />
      )}
      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Remove User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this user from the group?
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

export default GroupUserList;
