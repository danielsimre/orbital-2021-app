import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";

import TaskFrameworkEntry from "./TaskFrameworkEntry";
import TaskItem from "./TaskItem";
import { ClassRoles } from "../../../enums";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    overflow: "auto",
  },
  button: {
    border: "1px solid black",
    alignSelf: "center",
    marginTop: "1em",
  },
  taskFramework: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    overflow: "auto",
  },
  table: {
    width: "100%",
  },
  tableCell: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

function TaskMain(props) {
  // Queried values
  const { classID } = useParams();
  const { curUserRole, taskFramework, refreshClassData } = props;
  const [queriedTaskList, setQueriedTaskList] = useState([]);

  // Form values
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [newTaskFramework, setNewTaskFramework] = useState(taskFramework);
  const [dateError, setDateError] = useState(false);
  const [dateHelperText, setDateHelperText] = useState("");

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Misc values
  const [propagateDialogOpen, setPropagateDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const classes = useStyles();

  function handlePropDialogOpen() {
    // Reset the unsaved task framework on dialog open
    // Note: the reset is placed here rather than dialog close due to an issue where
    // the framework resets before the dialog fully closes, causing a display oddity
    setNewTaskFramework(taskFramework);
    setPropagateDialogOpen(true);
  }

  function handlePropDialogClose() {
    setPropagateDialogOpen(false);
  }

  function handleConfirmDialogOpen() {
    setConfirmDialogOpen(true);
  }

  function handleConfirmDialogClose() {
    setConfirmDialogOpen(false);
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  function handleAddTask(event) {
    event.preventDefault();
    setDateError(false);
    setDateHelperText("");
    if (new Date(taskDueDate) < Date.now()) {
      setDateError(true);
      setDateHelperText("Invalid due date");
      return;
    }

    if (taskName !== "" && taskDesc !== "") {
      // Add new task and slot it into the framework based on its due date
      setNewTaskFramework(
        [
          ...newTaskFramework,
          {
            name: taskName,
            desc: taskDesc,
            dueDate: taskDueDate,
            isMilestone: true,
          },
        ].sort((task1, task2) => {
          if (task1.dueDate < task2.dueDate) {
            return -1;
          }
          if (task1.dueDate > task2.dueDate) {
            return 1;
          }
          return 0;
        })
      );
      // Reset task name and description fields
      setTaskName("");
      setTaskDesc("");
    }
  }

  function handlePropagateTasks() {
    axios
      .post(
        `/api/v1/classes/${classID}/tasks`,
        {
          taskArray: newTaskFramework,
        },
        { withCredentials: true }
      )
      .then(() => {
        handleAlert(
          "Task Framework Propagated!",
          "The task framework has been propagated successfully.",
          "success"
        );
      })
      .then(() => refreshClassData(classID))
      .catch((err) => {
        console.log(err);
        handleAlert(
          "Error!",
          "One of the tasks has an invalid date or the framework is unchanged",
          "error"
        );
      });
    setDisplayAlert(true);
    handleConfirmDialogClose();
    handlePropDialogClose();
  }

  function handleDeleteEntry(index) {
    // Removes the task corresponding to the index
    setNewTaskFramework(
      newTaskFramework.slice(0, index).concat(newTaskFramework.slice(index + 1))
    );
  }

  useEffect(() => {
    if (curUserRole === ClassRoles.STUDENT) {
      axios
        .get(`/api/v1/classes/${classID}/tasks`, {
          withCredentials: true,
        })
        .then((response) => {
          setQueriedTaskList(response.data);
        })
        .catch((err) => console.log(err));
    }
  }, [curUserRole, classID]);

  return curUserRole === ClassRoles.MENTOR ? (
    <div className={classes.root}>
      <Button onClick={handlePropDialogOpen} className={classes.button}>
        {" "}
        Create New Task Framework{" "}
      </Button>
      <Dialog open={propagateDialogOpen} onClose={handlePropDialogClose}>
        <DialogTitle>Propagate Task List</DialogTitle>
        <DialogContent>
          {newTaskFramework.map((taskObject, index) => (
            <TaskFrameworkEntry
              taskName={taskObject.name}
              taskDesc={taskObject.desc}
              taskDueDate={taskObject.dueDate}
              handleDeleteEntry={() => handleDeleteEntry(index)}
            />
          ))}
          <DialogContentText>
            Add new tasks to the framework, which can be saved and propagated to
            all groups.
          </DialogContentText>
          <form>
            <div className={classes.root}>
              <TextField
                id="task name"
                label="Task Name"
                variant="outlined"
                required
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
              />
              <TextField
                id="task description"
                label="Task Description"
                variant="outlined"
                multiline
                required
                value={taskDesc}
                onChange={(event) => setTaskDesc(event.target.value)}
              />
            </div>
            <TextField
              id="date"
              label="Due Date"
              type="date"
              required
              error={dateError}
              helperText={dateHelperText}
              value={taskDueDate}
              className={classes.textField}
              onChange={(event) => setTaskDueDate(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <DialogActions>
              <Button onClick={handlePropDialogClose}>Cancel</Button>
              <Button type="submit" onClick={(event) => handleAddTask(event)}>
                Add Task
              </Button>
              <Button onClick={handleConfirmDialogOpen}>Save Framework</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Propagating tasks now will reset all comments, subtasks and
            submissions made from all groups. Would you like to continue?
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleConfirmDialogClose}>Cancel</Button>
            <Button onClick={handlePropagateTasks}>Confirm</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Box className={classes.taskFramework}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Task Description</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="center">
            {taskFramework.map((curTask) => (
              <TableRow key={curTask.id}>
                <TableCell className={classes.tableCell}>
                  {curTask.name}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {curTask.desc}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {curTask.dueDate.slice(0, 10)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={displayAlert}
        onClose={() => setDisplayAlert(false)}
      >
        <Alert onClose={() => setDisplayAlert(false)} severity={alertState}>
          <AlertTitle>{alertTitleText}</AlertTitle>
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  ) : (
    <div className={classes.root}>
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
          {queriedTaskList.map((taskObject) => (
            <TaskItem taskObject={taskObject.attributes} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TaskMain;
