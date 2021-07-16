import { List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ClassRoles } from "../../enums";

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
  const { classID, curUserRole } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem
          button
          className={classes.option}
          component={Link}
          to={`/classes/${classID}`}
        >
          <ListItemText primary="Main Page" />
        </ListItem>
        <ListItem
          button
          className={classes.option}
          component={Link}
          to={`/classes/${classID}/announcements`}
        >
          <ListItemText primary="Announcements" />
        </ListItem>
        <ListItem
          button
          className={classes.option}
          component={Link}
          to={`/classes/${classID}/users`}
        >
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem
          button
          className={classes.option}
          component={Link}
          to={`/classes/${classID}/tasks`}
        >
          <ListItemText primary="Class Tasks" />
        </ListItem>
        <ListItem
          button
          className={classes.option}
          component={Link}
          to={`/classes/${classID}/groups`}
        >
          <ListItemText primary="Project Groups" />
        </ListItem>
        {curUserRole === ClassRoles.MENTOR && (
          <ListItem
            button
            className={classes.option}
            component={Link}
            to={`/classes/${classID}/settings`}
          >
            <ListItemText primary="Settings" />
          </ListItem>
        )}
      </List>
    </div>
  );
}

export default ClassSidebar;
