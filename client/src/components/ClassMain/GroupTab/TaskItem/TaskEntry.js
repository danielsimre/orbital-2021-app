import { useState } from "react";
import {
  Box,
  Collapse,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Typography,
  TableCell,
  TableRow,
  makeStyles,
} from "@material-ui/core/";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import axios from "axios";

import EditSubmissionButton from "./EditSubmissionButton";
import AddSubtaskButton from "./AddSubtaskButton";
import AddCommentButton from "./AddCommentButton";
import SubtaskTable from "../SubtaskTable/SubtaskTable";

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
    flexDirection: "column",
    width: "100%",
  },
  descAndButtonsBox: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  descTitle: {
    display: "flex",
    justifyContent: "space-between",
  },
  addSubtaskButton: {
    border: "1px solid black",
    marginTop: "0.5em",
    marginLeft: "0.25em",
    width: "fit-container",
  },
  addCommentButton: {
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
  actionsBox: {
    display: "flex",
    flex: "0 0 38%",
    marginLeft: "auto",
    margin: "0.5em",
    padding: "0.5rem",
    height: "fit-content",
    width: "fit-content",
    boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.2)",
  },
});

function TaskItem(props) {
  // Queried values
  const { taskObject, refreshGroupData, groupMembers, isMentor } = props;

  // taskObject.attributes contains submissions, comment and subtask list
  const taskAttributes = taskObject.attributes;

  // arrays from taskAttributes
  const subtaskList = taskAttributes.subtasks;
  const submissionsList = taskAttributes.submissions;

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
    return subtaskArr.every((subtask) => subtask.attributes.isCompleted);
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
                disabled={!allSubtasksCompleted(subtaskList) || isMentor}
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
              <Box className={classes.descAndButtonsBox}>
                <Box className={classes.descBox}>
                  <Typography variant="h5" display="block" align="left">
                    Description
                  </Typography>

                  <Typography variant="body1" display="block" align="left">
                    {taskAttributes.desc}
                  </Typography>
                  {submissionsList.length === 0 || (
                    <Typography variant="h5" align="left">
                      Submission Links:
                    </Typography>
                  )}
                  <Typography
                    variant="body1"
                    display="block"
                    style={{ whiteSpace: "pre" }}
                    align="left"
                  >
                    {submissionsList.map((submission) => (
                      <>{submission + "\n"}</>
                    ))}
                  </Typography>
                </Box>
                {/* User actions */}
                <Paper className={classes.actionsBox}>
                  <EditSubmissionButton
                    submissionLinks={submissionsList}
                    refreshGroupData={refreshGroupData}
                    taskId={taskObject.id}
                  />
                  <AddSubtaskButton
                    className={classes.addSubtaskButton}
                    parentDueDate={taskAttributes.dueDate}
                    refreshGroupData={refreshGroupData}
                    taskId={taskObject.id}
                    groupMembers={groupMembers}
                  />
                  <AddCommentButton
                    className={classes.addCommentButton}
                    taskId={taskObject.id}
                  />
                </Paper>
              </Box>
              {/* Subtask List. If there are no subtasks, do not render this part */}
              {subtaskList !== undefined && subtaskList.length !== 0 && (
                <SubtaskTable
                  subtaskList={subtaskList}
                  groupMembers={groupMembers}
                  refreshGroupData={refreshGroupData}
                  parentDueDate={taskAttributes.dueDate}
                  isMentor={isMentor}
                />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default TaskItem;
