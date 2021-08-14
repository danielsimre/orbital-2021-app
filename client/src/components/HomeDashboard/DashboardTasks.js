import { useState } from "react";
import {
  Button,
  Tab,
  Tabs,
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
  typography: {
    display: "flex",
    justifyContent: "center",
  },
  overdue: {
    backgroundColor: "#ffb8b8",
  },
});

function DashboardTasks(props) {
  const { userTaskList, userSubtaskList } = props;

  // Misc values
  const [tabIndex, setTabIndex] = useState(0);
  const classes = useStyles();

  // Pagination values
  const ITEMS_PER_PAGE = 4;
  const numTaskPages = Math.ceil(userTaskList.length / ITEMS_PER_PAGE);
  const [taskPage, setTaskPage] = useState(1);
  const [displayTaskList, setDisplayTaskList] = useState(
    userTaskList.slice(0, ITEMS_PER_PAGE)
  );
  const numSubtaskPages = Math.ceil(userSubtaskList.length / ITEMS_PER_PAGE);
  const [subtaskPage, setSubtaskPage] = useState(1);
  const [displaySubtaskList, setDisplaySubtaskList] = useState(
    userSubtaskList.slice(0, ITEMS_PER_PAGE)
  );

  function handleTaskPageChange(event, value) {
    setTaskPage(value);
    setDisplayTaskList(
      userTaskList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }
  function handleSubtaskPageChange(event, value) {
    setSubtaskPage(value);
    setDisplaySubtaskList(
      userSubtaskList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  const isOverdue = (date) => new Date(date) < Date.now();

  const displayList = tabIndex === 0 ? displayTaskList : displaySubtaskList;

  const paginationButtons =
    tabIndex === 0
      ? numTaskPages < 2 || (
          <Pagination
            count={numTaskPages}
            page={taskPage}
            onChange={handleTaskPageChange}
            className={classes.pagination}
          />
        )
      : numSubtaskPages < 2 || (
          <Pagination
            count={numSubtaskPages}
            page={subtaskPage}
            onChange={handleSubtaskPageChange}
            className={classes.pagination}
          />
        );

  return (
    <div>
      <Tabs
        value={tabIndex}
        onChange={(event, newValue) => setTabIndex(newValue)}
        centered
      >
        <Tab label="Main Tasks" />
        <Tab label="Subtasks" />
      </Tabs>
      {displayList.length === 0 ? (
        <Typography variant="h2" className={classes.typography}>
          No tasks due!
        </Typography>
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
                  <TableCell
                    className={
                      isOverdue(task.attributes.dueDate) && classes.overdue
                    }
                  >
                    {task.attributes.name}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={
                      isOverdue(task.attributes.dueDate) && classes.overdue
                    }
                  >
                    {task.attributes.dueDate.slice(0, 10)}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={
                      isOverdue(task.attributes.dueDate) && classes.overdue
                    }
                  >
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
          {paginationButtons}
        </>
      )}
    </div>
  );
}

export default DashboardTasks;
