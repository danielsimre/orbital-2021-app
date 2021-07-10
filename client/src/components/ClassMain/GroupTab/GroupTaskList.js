import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  makeStyles,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

import TaskItem from "./TaskItem/TaskEntry";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    overflow: "auto",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
});

function GroupTaskList(props) {
  const { queriedTaskList, refreshGroupData, groupMembers } = props;
  const classes = useStyles();

  // Pagination values
  const ITEMS_PER_PAGE = 4;
  const numPages = Math.ceil(queriedTaskList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState(
    queriedTaskList.slice(0, ITEMS_PER_PAGE)
  );

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      queriedTaskList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  useEffect(
    () =>
      setDisplayList(
        queriedTaskList.slice(
          ITEMS_PER_PAGE * (page - 1),
          ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE
        )
      ),
    [queriedTaskList, page]
  );

  return (
    <div className={classes.root}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayList.map((taskObject) => (
            <TaskItem
              taskObject={taskObject}
              refreshGroupData={refreshGroupData}
              groupMembers={groupMembers}
            />
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
    </div>
  );
}

export default GroupTaskList;
