import { useEffect, useState } from "react";
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
import { Pagination } from "@material-ui/lab";

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
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
});

function GroupUserList(props) {
  // Queried values
  const { groupMembers, mentors } = props;

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
                    <CardContent>
                      <Typography variant="h6">
                        {curUser.attributes.username}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Email: {curUser.attributes.email}
                      </Typography>
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
                    <CardContent>
                      <Typography variant="h6">
                        {curUser.attributes.username}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Email: {curUser.attributes.email}
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
    </div>
  );
}

export default GroupUserList;
