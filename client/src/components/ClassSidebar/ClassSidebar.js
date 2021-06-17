import { List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    borderRight: "1px solid grey",
  },
  option: {
    borderBottom: "1px solid grey",
  },
}));

function ClassSidebar(props) {
  const { classID } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem
          button
          className={classes.option}
          component={Link}
          to={`/my_classes/${classID}`}
        >
          <ListItemText primary="Main Page" />
        </ListItem>
        <ListItem
          button
          className={classes.option}
          component={Link}
          to={`/my_classes/${classID}/users`}
        >
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem
          button
          className={classes.option}
          component={Link}
          to={`/my_classes/${classID}/tasks`}
        >
          <ListItemText primary="Class Tasks" />
        </ListItem>
        <ListItem
          button
          className={classes.option}
          component={Link}
          to={`/my_classes/${classID}/groups`}
        >
          <ListItemText primary="Project Groups" />
        </ListItem>
      </List>
    </div>
  );
}

export default ClassSidebar;
