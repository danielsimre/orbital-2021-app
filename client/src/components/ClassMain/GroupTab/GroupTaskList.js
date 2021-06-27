import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  makeStyles,
} from "@material-ui/core";

import TaskItem from "./TaskItem";

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
  const { queriedTaskList } = props;
  const classes = useStyles();

  return <div className={classes.root}></div>;
}

export default GroupTaskList;
