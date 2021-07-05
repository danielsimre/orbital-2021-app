import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  makeStyles,
} from "@material-ui/core";

import TaskItem from "./TaskItem/TaskEntry";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    overflow: "auto",
  },
});

function GroupTaskList(props) {
  const { queriedTaskList, refreshGroupData, groupMembers } = props;
  const classes = useStyles();

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
          {queriedTaskList.map((taskObject) => (
            <TaskItem
              taskObject={taskObject}
              refreshGroupData={refreshGroupData}
              groupMembers={groupMembers}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default GroupTaskList;
