import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

function DashboardTasks(props) {
  const { userTaskList } = props;

  const classes = useStyles();

  return userTaskList.length === 0 ? (
    <Typography> No tasks! </Typography>
  ) : (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>Task Name</TableCell>
          <TableCell align="right">Due Date</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userTaskList.map((task) => (
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
  );
}

export default DashboardTasks;
