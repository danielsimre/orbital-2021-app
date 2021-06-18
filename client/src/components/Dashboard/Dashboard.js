import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function DashboardTasks(props) {
  const { userTaskList } = props;

  const classes = useStyles();

  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Task Name</TableCell>
          <TableCell align="right">Description</TableCell>
          <TableCell align="right">Due</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userTaskList.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.name}</TableCell>
            <TableCell align="right">{task.desc}</TableCell>
            <TableCell align="right">{task.dueDate}</TableCell>
            <TableCell align="right">
              <Button component={Link} to={`/tasks/${task.id}`}>
                See More {" >>"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Dashboard() {
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [userTaskList, setUserTaskList] = useState([]);

  // conduct query for users tasks
  function getAllUserTasks() {
    //query user stuff

    // dummy task list for now
    setUserTaskList([
      { name: "Task 1", desc: "dummy task 1", id: 1, dueDate: "23 Jun 2021" },
      { name: "Task 2", desc: "dummy task 3", id: 2, dueDate: "28 Jun 2021" },
      { name: "Task 5", desc: "dummdee", id: 3, dueDate: "20 Jul 2021" },
    ]);

    setIsRetrieving(false);
  }

  useEffect(() => getAllUserTasks(), []);

  return (
    isRetrieving || (
      <div>
        <h1>My Tasks</h1>
        <DashboardTasks userTaskList={userTaskList} />
      </div>
    )
  );
}

export default Dashboard;
