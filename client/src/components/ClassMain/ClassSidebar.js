import { useState } from "react";
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

  const [selectedTab, setSelectedTab] = useState(0);

  function handleSelectTab(event, index) {
    setSelectedTab(index);
  }

  const isMentor = curUserRole === "MENTOR";

  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem
          button
          onClick={(event) => handleSelectTab(event, 0)}
          selected={selectedTab === 0}
          className={classes.option}
          component={Link}
          to={`/classes/${classID}`}
        >
          <ListItemText primary="Main Page" />
        </ListItem>
        <ListItem
          button
          onClick={(event) => handleSelectTab(event, 1)}
          selected={selectedTab === 1}
          className={classes.option}
          component={Link}
          to={`/classes/${classID}/announcements`}
        >
          <ListItemText primary="Announcements" />
        </ListItem>
        <ListItem
          button
          onClick={(event) => handleSelectTab(event, 2)}
          selected={selectedTab === 2}
          className={classes.option}
          component={Link}
          to={`/classes/${classID}/users`}
        >
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem
          button
          onClick={(event) => handleSelectTab(event, 3)}
          selected={selectedTab === 3}
          className={classes.option}
          component={Link}
          to={`/classes/${classID}/tasks`}
        >
          <ListItemText
            primary={isMentor ? "Task Framework" : "Class Task List"}
          />
        </ListItem>
        <ListItem
          button
          onClick={(event) => handleSelectTab(event, 4)}
          selected={selectedTab === 4}
          className={classes.option}
          component={Link}
          to={`/classes/${classID}/groups`}
        >
          <ListItemText primary={isMentor ? "Project Groups" : "My Group"} />
        </ListItem>
        {curUserRole === ClassRoles.MENTOR && (
          <ListItem
            button
            onClick={(event) => handleSelectTab(event, 5)}
            selected={selectedTab === 5}
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
