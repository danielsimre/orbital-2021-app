import { useState } from "react";
import {
  Box,
  Collapse,
  Checkbox,
  FormControlLabel,
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
import axios from "axios";

import EditSubmissionButton from "./EditSubmissionButton";
import AddSubtaskButton from "./AddSubtaskButton";

const useStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  box: {
    borderTop: "1px solid black",
    marginBottom: "0.5em",
  },
  descBox: {
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  addSubtaskButton: {
    border: "1px solid black",
    marginTop: "0.5em",
    marginLeft: "0.25em",
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
});

function TaskItem(props) {
  // Queried values
  const { taskObject, refreshGroupData } = props;
  const taskAttributes = taskObject.attributes;

  // Misc values
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  function handleChangeCompletion(isCompleted) {
    axios
      .put(
        `/api/v1/tasks/${taskObject.id}?isCompleted`,
        {
          isCompleted,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.msg);
        refreshGroupData();
      })
      .catch((err) => console.log(err));
  }

  // Allow user to only check the main task as done after all subtasks are done
  function allSubtasksCompleted(subtaskArr) {
    return subtaskArr.every((subtask) => subtask.isCompleted);
  }

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell className={classes.tableCell}>
          {taskAttributes.name}
        </TableCell>
        <TableCell className={classes.tableCell}>
          {taskAttributes.dueDate.slice(0, 10)}
        </TableCell>
        <TableCell className={classes.tableCell}>
          {taskAttributes.assignedTo.map((assignedUser, index) => {
            return (
              <>
                {(index !== 0 ? ", " : "") + assignedUser.attributes.username}
              </>
            );
          })}
        </TableCell>
        <TableCell>
          <FormControlLabel
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            onChange={(event) => handleChangeCompletion(event.target.checked)}
            control={
              <Checkbox
                color="primary"
                checked={taskAttributes.isCompleted}
                disabled={!allSubtasksCompleted(taskAttributes.subtasks)}
              />
            }
            color="primary"
          />
        </TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse
            className={classes.collapse}
            in={isOpen}
            timeout="auto"
            unmountOnExit
          >
            {/*Description of Task*/}
            <Box className={classes.box}>
              <Box className={classes.descBox}>
                <Box>
                  <Typography variant="h5" align="left">
                    Description
                  </Typography>
                  <Typography variant="body" display="block" align="left">
                    {taskAttributes.desc}
                  </Typography>
                  {taskAttributes.submissions.length === 0 || (
                    <Typography variant="h5" align="left">
                      Submission Links:
                    </Typography>
                  )}
                  <Typography
                    variant="body"
                    display="block"
                    style={{ whiteSpace: "pre" }}
                    align="left"
                  >
                    {taskAttributes.submissions.map((submission) => (
                      <>{submission + "\n"}</>
                    ))}
                  </Typography>
                </Box>
                <EditSubmissionButton
                  submissionLinks={taskAttributes.submissions}
                  refreshGroupData={refreshGroupData}
                  taskId={taskObject.id}
                />
                <AddSubtaskButton className={classes.addSubtaskButton} />
              </Box>
              {/*Subtask List. If there are no subtasks, do not render this part*/}
              {(taskAttributes.subtasks !== undefined &&
                taskAttributes.subtasks !== []) || (
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
                      {taskAttributes.subtasks.map((subtaskObject) => (
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
