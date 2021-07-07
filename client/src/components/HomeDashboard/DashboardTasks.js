import { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
});

function DashboardTasks(props) {
  const { userTaskList } = props;

  // Pagination values
  const ITEMS_PER_PAGE = 4;
  const numPages = Math.ceil(userTaskList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState(
    userTaskList.slice(0, ITEMS_PER_PAGE)
  );

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      userTaskList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  const classes = useStyles();

  return userTaskList.length === 0 ? (
    <Typography> No tasks! </Typography>
  ) : (
    <>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell align="right">Due Date</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayList.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.attributes.name}</TableCell>
              <TableCell align="right">
                {task.attributes.dueDate.slice(0, 10)}
              </TableCell>
              <TableCell align="right">
                <Button
                  component={Link}
                  to={`/classes/${task.attributes.classId.id}/groups`}
                >
                  Details
                </Button>
              </TableCell>
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
    </>
  );
}

export default DashboardTasks;
