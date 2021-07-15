import { useEffect, useState } from "react";
import { Switch, useRouteMatch, Route, useParams } from "react-router-dom";
import { Button, makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";

import ClassSidebar from "./ClassSidebar";
import UserList from "./UserTab/UserList";
import ClassGroupList from "./GroupTab/ClassGroupList";
import GroupMain from "./GroupTab/GroupMain";
import ClassAnnouncements from "./AnnouncementTab/ClassAnnouncements";
import TaskMain from "./TaskTab/TaskMain";
import ClassSettings from "./SettingsTab/ClassSettings";

import { ClassRoles } from "../../enums";

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

  const [classData, setClassData] = useState({});

  const [isRetrieving, setIsRetrieving] = useState(true);
  const { path } = useRouteMatch();

  const classes = useStyles();

  function getClassData() {
    axios
      .get(`/api/v1/classes/${classID}`, { withCredentials: true })
      .then((res) => {
        setClassData(res.data.attributes);
        console.log(res.data.attributes);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  function handleGenerateStudentInviteCode() {
    axios
      .put(`/api/v1/classes/${classID}?studentInviteCode`, {
        withCredentials: true,
      })
      .then(() => getClassData(classID))
      .catch((error) =>
        console.log(`Could not find class with ID: ${classID}`)
      );
  }

  function handleGenerateMentorInviteCode() {
    axios
      .put(`/api/v1/classes/${classID}?mentorInviteCode`, {
        withCredentials: true,
      })
      .then(() => getClassData(classID))
      .catch((error) =>
        console.log(`Could not find class with ID: ${classID}`)
      );
  }

  useEffect(() => {
    getClassData();
  }, [classID]);

  return (
    isRetrieving || (
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
                creatorId={classData.created_by}
                refreshClassData={getClassData}
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
                isCompleted={classData.isCompleted}
              />
            </Route>
            <Route path={`${path}/groups`}>
              <ClassGroupList
                curUserRole={classData.role}
                refreshClassData={() => getClassData(classID)}
                isCompleted={classData.isCompleted}
              />
            </Route>
            <Route path={`${path}/settings`}>
              <ClassSettings
                curUserRole={classData.role}
                refreshClassData={getClassData}
                isCompleted={classData.isCompleted}
              />
            </Route>
            <Route path={`${path}`}>
              <h1>Class Main Page for {classData.name}</h1>
              <p>Description: {classData.desc}</p>
              {classData.role === ClassRoles.MENTOR && (
                <div>
                  <div>
                    Student Invite Code: {classData.studentInviteCode}
                    <Button
                      onClick={handleGenerateStudentInviteCode}
                      disabled={classData.isCompleted}
                    >
                      Generate New Code
                    </Button>
                  </div>
                  <div>
                    Mentor Invite Code: {classData.mentorInviteCode}
                    <Button
                      onClick={handleGenerateMentorInviteCode}
                      disabled={classData.isCompleted}
                    >
                      Generate New Code
                    </Button>
                  </div>
                </div>
              )}
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
    )
  );
}

export default ClassMain;
