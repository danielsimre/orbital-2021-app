import { useEffect, useState } from "react";
import {
  Switch,
  useRouteMatch,
  Route,
  Redirect,
  useParams,
} from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";

import ClassSidebar from "./ClassSidebar";
import UserList from "./UserTab/UserList";
import ClassGroupList from "./GroupTab/ClassGroupList";
import GroupMain from "./GroupTab/GroupMain";
import ClassAnnouncements from "./AnnouncementTab/ClassAnnouncements";
import TaskMain from "./TaskTab/TaskMain";
import ClassSettings from "./SettingsTab/ClassSettings";

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
  alert: {
    margin: "0 auto",
    width: "70%",
    textAlign: "left",
  },
}));

function ClassMain(props) {
  const { classID } = useParams();

  // These are dependent on querying the class data from the API, so they are undefined for now
  const [classData, setClassData] = useState(undefined);
  const [isCreator, setIsCreator] = useState(undefined);

  const [isRetrieving, setIsRetrieving] = useState(true);
  const { path } = useRouteMatch();

  const classes = useStyles();

  function getClassData() {
    axios
      .get(`/api/v1/classes/${classID}`, { withCredentials: true })
      .then((res) => {
        setClassData(res.data.attributes);
        setIsCreator(
          res.data.attributes.curUserId === res.data.attributes.created_by
        );
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => {
    axios
      .get(`/api/v1/classes/${classID}`, { withCredentials: true })
      .then((res) => {
        setClassData(res.data.attributes);
        setIsCreator(
          res.data.attributes.curUserId === res.data.attributes.created_by
        );
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }, [classID]);

  return (
    isRetrieving ||
    // If user is not authorized to view this class, redirect them to the view classes page
    (classData === undefined ? (
      <Redirect to={`/classes`} />
    ) : (
      <div className={classes.root}>
        <div className={classes.sidebar}>
          <ClassSidebar classID={classID} curUserRole={classData.role} />
        </div>
        <div className={classes.info}>
          <Switch>
            <Route path={`${path}/announcements`}>
              <ClassAnnouncements
                curUserRole={classData.role}
                classID={classID}
                isCompleted={classData.isCompleted}
              />
            </Route>
            <Route path={`${path}/users`}>
              <UserList
                curUserRole={classData.role}
                queriedUserList={classData.users}
                refreshClassData={getClassData}
                isCreator={isCreator}
                curUserId={classData.curUserId}
                isCompleted={classData.isCompleted}
              />
            </Route>
            <Route path={`${path}/tasks`}>
              <TaskMain
                curUserRole={classData.role}
                taskFramework={classData.taskFramework}
                refreshClassData={getClassData}
                isCompleted={classData.isCompleted}
              />
            </Route>
            <Route path={`${path}/groups/:groupID`}>
              <GroupMain
                curUserRole={classData.role}
                refreshClassData={getClassData}
                isCompleted={classData.isCompleted}
              />
            </Route>
            <Route path={`${path}/groups`}>
              <ClassGroupList
                curUserRole={classData.role}
                groupSize={classData.groupSize}
                groupNames={classData.groups.map(
                  (group) => group.attributes.name
                )}
                refreshClassData={getClassData}
                isCompleted={classData.isCompleted}
                isCreator={isCreator}
              />
            </Route>
            <Route path={`${path}/settings`}>
              <ClassSettings
                curUserRole={classData.role}
                refreshClassData={getClassData}
                studentInviteCode={classData.studentInviteCode}
                mentorInviteCode={classData.mentorInviteCode}
                isCompleted={classData.isCompleted}
                isCreator={isCreator}
              />
            </Route>
            <Route path={`${path}`}>
              <h1>Class Main Page for {classData.name}</h1>
              <p>Description: {classData.desc}</p>
              {classData.isCompleted && (
                <Alert severity="info" className={classes.alert}>
                  <AlertTitle>This class is closed</AlertTitle>
                  This class has been marked as complete. You may still view the
                  class information, but you cannot modify anything.
                </Alert>
              )}
            </Route>
          </Switch>
        </div>
      </div>
    ))
  );
}

export default ClassMain;
