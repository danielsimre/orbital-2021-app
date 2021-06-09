import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "0 auto",
    position: "center",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function TaskForm(props) {
  const {
    newTaskName,
    setNewTaskName,
    newTaskDesc,
    setNewTaskDesc,
    handleAddTask,
  } = props;

  const classes = useStyles();

  return (
    <form onSubmit={handleAddTask} className={classes.paper}>
      <fieldset>
        <TextField
          label="Task Name"
          variant="outlined"
          value={newTaskName}
          required
          onChange={(event) => setNewTaskName(event.target.value)}
        />
        <TextField
          label="Task Description"
          variant="outlined"
          multiline
          value={newTaskDesc}
          required
          onChange={(event) => setNewTaskDesc(event.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Task
        </Button>
      </fieldset>
    </form>
  );
}

export default TaskForm;
