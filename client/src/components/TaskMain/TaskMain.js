import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TextField,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useParams } from "react-router-dom";
import axios from "axios";

import TaskFrameworkEntry from "./TaskFrameworkEntry";
import TaskItem from "../TaskItem";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
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
  const { curUserRole, taskFramework, refreshClassData } = props;
  const { classID } = useParams();

  // Form values
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [newTaskFramework, setNewTaskFramework] = useState(taskFramework);
  const [displayAlert, setDisplayAlert] = useState(false);

  const [propagateDialogOpen, setPropagateDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const classes = useStyles();

  const handlePropDialogOpen = () => {
    // Reset the unsaved task framework on dialog open
    // Note: the reset is placed here rather than dialog close due to an issue where
    // the framework resets before the dialog fully closes, causing a display oddity
    setNewTaskFramework(taskFramework);
    setPropagateDialogOpen(true);
  };

  const handlePropDialogClose = () => {
    setPropagateDialogOpen(false);
  };

  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // dummy task constant; delete after
  const dummyTestTaskObject = {
    name: "Create cover page for report",
    desc: "Cover page should include title and group member names. Use a nice template online.",
    dueDate: "21 Jun 2021",
    assignedTo: "User 1",
    subtasks: [],
    isCompleted: false,
  };

  function handleAddTask(event) {
    event.preventDefault();
    if (new Date(taskDueDate) < Date.now()) {
      setDisplayAlert(true);
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
      .then((response) => {
        console.log(response.data);
      })
      .then(() => refreshClassData(classID))
      .catch((err) => console.log(err));
    handleConfirmDialogClose();
    handlePropDialogClose();
  }

  function handleDeleteEntry(index) {
    // Removes the task corresponding to the index
    setNewTaskFramework(
      newTaskFramework.slice(0, index).concat(newTaskFramework.slice(index + 1))
    );
  }

  return curUserRole === "MENTOR" ? (
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
        <Alert onClose={() => setDisplayAlert(false)} severity="error">
          <AlertTitle>Invalid date</AlertTitle>
          Your selected due date is invalid.
        </Alert>
      </Snackbar>
    </div>
  ) : (
    <TaskItem taskObject={dummyTestTaskObject} />
  );
}

export default TaskMain;
