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
});

function GroupUserList(props) {
  // Queried values
  const { groupMembers, mentors } = props;

  // Misc values
  const classes = useStyles();
  const memberRows = groupMembers.reduce((cols, key, index) => {
    return (
      (index % 2 === 0 ? cols.push([key]) : cols[cols.length - 1].push(key)) &&
      cols
    );
  }, []);
  const mentorRows = mentors.reduce((cols, key, index) => {
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
    </div>
  );
}

export default GroupUserList;
