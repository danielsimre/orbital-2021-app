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

const useStyles = makeStyles({
  accordion: {
    width: "100%",
  },
  detail: {
    width: "100%",
  },
  detailBox: {
    padding: "16px",
  },
});

function TaskItem(props) {
  // Queried values
  const { taskObject } = props;

  // Form values
  const [submissionURL, setSubmissionURL] = useState("");

  // Misc values
  const [isOpen, setIsOpen] = useState(false);
  const [subtaskFormOpen, setSubtaskFormOpen] = useState(false);
  const classes = useStyles();

  // new URL will throw an error if the url is invalid
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      console.log(err);
    } finally {
      return false;
    }
  };

  // Handle dialog opening and closing
  function handleSubtaskOpen() {
    setSubtaskFormOpen(true);
  }

  function handleSubtaskClose() {
    setSubtaskFormOpen(false);
  }

  // Allow user to only check the main task as done after all subtasks are done
  function allSubtasksCompleted(subtaskArr) {
    return subtaskArr.every((subtask) => subtask.isCompleted);
  }

  function handleLinkSubmit(event) {
    event.preventDefault();
    if (isValidURL(submissionURL)) {
      // PUT request here
    }
  }

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell className={classes.tableCell}>{taskObject.name}</TableCell>
        <TableCell className={classes.tableCell}>
          {taskObject.dueDate.slice(0, 10)}
        </TableCell>
        <TableCell>
          <FormControlLabel
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={
              <Checkbox
                color="primary"
                disabled={!allSubtasksCompleted(taskObject.subtasks)}
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
              <Typography variant="h5" align="left">
                Description
              </Typography>
              <Typography variant="body" display="block">
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
