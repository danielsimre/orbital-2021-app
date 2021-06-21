import { useEffect, useState } from "react";
import { Switch, useRouteMatch, Route, useParams } from "react-router-dom";
import { makeStyles, Typography } from "@material-ui/core";
import axios from "axios";

import ClassSidebar from "../ClassSidebar";
import TaskItem from "../TaskItem";
import UserList from "../UserList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    height: "calc(100% - 64px)",
  },
  sidebar: {
    flex: "0 0 10em",
    height: "100%",
  },
  info: {
    flex: "1 1",
    height: "100%",
    textAlign: "center",
  },
}));

// for testing purposes, please delete after
const dummyTestTaskObject = {
  name: "Create cover page for report",
  desc: "Cover page should include title and group member names. Use a nice template online.",
  dueDate: "21 Jun 2021",
  assignedTo: "User 1",
};

function ClassMain(props) {
  const { classID } = useParams();
  const [classData, setClassData] = useState({});
  const [isRetrieving, setIsRetrieving] = useState(true);
  const { path } = useRouteMatch();

  const classes = useStyles();

  function getClassData(classID) {
    axios
      .get(`/api/v1/classes/${classID}`, {
        withCredentials: true,
      })
      .then(function (response) {
        setClassData(response.data.attributes);
      })
      .catch(function (error) {
        console.log(`Could not find class with ID: ${classID}`);
      })
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => {
    getClassData(classID);
    console.log(classID);
  }, [classID]);

  return (
    isRetrieving || (
      <div className={classes.root}>
        <div className={classes.sidebar}>
          <ClassSidebar classID={classID} />
        </div>
        <div className={classes.info}>
          <Switch>
            <Route path={`${path}/announcements`}>
              <p>Announcements</p>
            </Route>
            <Route path={`${path}/users`}>
              <UserList />
            </Route>
            <Route path={`${path}/tasks`}>
              <Typography variant="h4" textAlign="center">
                Tasks
              </Typography>
              <TaskItem taskObject={dummyTestTaskObject} />
              <TaskItem taskObject={dummyTestTaskObject} />
            </Route>
            <Route path={`${path}/groups`}>
              <p>Groups</p>
            </Route>
            <Route path={`${path}`}>
              <h1>Class Main Page for {classData.name}</h1>
              <p>Description: {classData.desc}</p>
            </Route>
          </Switch>
        </div>
      </div>
    )
  );
}

export default ClassMain;
