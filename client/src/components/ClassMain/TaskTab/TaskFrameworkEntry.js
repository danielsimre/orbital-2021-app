import { Box, Button, Tooltip, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    border: "1px solid black",
    borderRadius: "5px",
    marginBottom: "0.25em",
    boxShadow: "0px 0px 5px 2px rgba(0, 0, 0, 0.2)",
  },
  name: {
    flex: "1 1 20%",
    alignSelf: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginLeft: "5%",
  },
  desc: {
    flex: "1 1 50%",
    alignSelf: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginLeft: "5%",
  },
  dueDate: {
    flex: "1 1 20%",
    alignSelf: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginLeft: "5%",
  },
}));

function TaskFrameworkEntry(props) {
  const { taskName, taskDesc, taskDueDate, handleDeleteEntry } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Tooltip title={taskName} placement="top">
        <div className={classes.name}>{taskName}</div>
      </Tooltip>
      <Tooltip title={taskDesc} placement="top">
        <div className={classes.desc}>{taskDesc}</div>
      </Tooltip>
      <Tooltip title={taskDueDate} placement="top">
        <div className={classes.dueDate}>{taskDueDate.slice(0, 10)}</div>
      </Tooltip>
      <Button onClick={handleDeleteEntry}>
        <CloseIcon />
      </Button>
    </Box>
  );
}

export default TaskFrameworkEntry;
