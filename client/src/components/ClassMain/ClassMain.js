import { useEffect, useState } from "react";
import { Switch, useRouteMatch, Route, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import axios from "axios";

import ClassSidebar from "./ClassSidebar";
import UserList from "./UserTab/UserList";
import ClassGroupList from "./GroupTab/ClassGroupList";
import GroupMain from "./GroupTab/GroupMain";
import ClassAnnouncements from "./AnnouncementTab/ClassAnnouncements";
import TaskMain from "./TaskTab/TaskMain";

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
  }, [classID, setClassData]);

  return (
    isRetrieving || (
      <div className={classes.root}>
        <div className={classes.sidebar}>
          <ClassSidebar classID={classID} />
        </div>
        <div className={classes.info}>
          <Switch>
            <Route path={`${path}/announcements`}>
              <ClassAnnouncements
                curUserRole={classData.role}
                classID={classID}
              />
            </Route>
            <Route path={`${path}/users`}>
              <UserList
                curUserRole={classData.role}
                queriedUserList={classData.users}
                refreshClassData={getClassData}
              />
            </Route>
            <Route path={`${path}/tasks`}>
              <TaskMain
                curUserRole={classData.role}
                taskFramework={classData.taskFramework}
                refreshClassData={getClassData}
              />
            </Route>
            <Route path={`${path}/groups/:groupID`}>
              <GroupMain />
            </Route>
            <Route path={`${path}/groups`}>
              <ClassGroupList curUserRole={classData.role} />
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
