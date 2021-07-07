import { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  makeStyles,
} from "@material-ui/core/";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  collapse: {
    width: "100%",
  },
  detail: {
    width: "100%",
  },
  tableCell: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  box: {
    borderTop: "1px solid black",
    marginBottom: "0.5em",
  },
});

function TaskItem(props) {
  // Queried values
  const { taskObject } = props;

  // Misc values
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell className={classes.tableCell}>{taskObject.name}</TableCell>
        <TableCell className={classes.tableCell}>
          {taskObject.dueDate.slice(0, 10)}
        </TableCell>
        <TableCell className={classes.tableCell}>
          {taskObject.isCompleted ? "Yes" : "No"}
        </TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse
            className={classes.collapse}
            in={isOpen}
            timeout="auto"
            unmountOnExit
          >
            {/*Description of Task*/}
            <Box className={classes.box}>
              <Typography variant="h5" align="left">
                Description
              </Typography>
              <Typography variant="body1" display="block">
                {taskObject.desc}
              </Typography>
              {/*Subtask List. If there are no subtasks, do not render this part*/}
              {(taskObject.subtasks !== undefined &&
                taskObject.subtasks !== []) || (
                <>
                  <Typography variant="h5" align="left">
                    Subtasks
                  </Typography>
                  <Table size="small" className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Due Date</TableCell>
                        <TableCell>Completed?</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {taskObject.subtasks.map((subtaskObject) => (
                        <TaskItem taskObject={subtaskObject.attributes} />
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default TaskItem;
