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
    minWidth: 500,
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
