import { useEffect, useState } from "react";
import { Switch, useRouteMatch, Route, useParams } from "react-router-dom";
import { Button, makeStyles } from "@material-ui/core";
import axios from "axios";

import ClassSidebar from "./ClassSidebar";
import UserList from "./UserTab/UserList";
import ClassGroupList from "./GroupTab/ClassGroupList";
import GroupMain from "./GroupTab/GroupMain";
import ClassAnnouncements from "./AnnouncementTab/ClassAnnouncements";
import TaskMain from "./TaskTab/TaskMain";
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
}));

function ClassMain(props) {
  const { classID } = useParams();

  const [classData, setClassData] = useState({});
  const [curUserData, setCurUserData] = useState({});

  const [isRetrieving, setIsRetrieving] = useState(true);
  const { path } = useRouteMatch();

  const classes = useStyles();

  function getClassData() {
    axios
      .all([
        axios.get(`/api/v1/classes/${classID}`, { withCredentials: true }),
        axios.get(`/api/v1/users`, { withCredentials: true }),
      ])
      .then(
        axios.spread((classData, userData) => {
          setClassData(classData.data.attributes);
          setCurUserData(userData.data);
        })
      )
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
    getClassData(classID);
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
              <ClassAnnouncements
                curUserRole={classData.role}
                classID={classID}
              />
            </Route>
            <Route path={`${path}/users`}>
              <UserList
                curUserRole={classData.role}
                queriedUserList={classData.users}
                creatorId={classData.created_by}
                refreshClassData={getClassData}
                curUserData={curUserData}
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
              <GroupMain curUserRole={classData.role} />
            </Route>
            <Route path={`${path}/groups`}>
              <ClassGroupList
                curUserRole={classData.role}
                groupSize={classData.groupSize}
                refreshClassData={() => getClassData(classID)}
              />
            </Route>
            <Route path={`${path}`}>
              <h1>Class Main Page for {classData.name}</h1>
              <p>Description: {classData.desc}</p>
              {classData.role === ClassRoles.MENTOR && (
                <div>
                  <div>
                    Student Invite Code: {classData.studentInviteCode}
                    <Button onClick={handleGenerateStudentInviteCode}>
                      Generate New Code
                    </Button>
                  </div>
                  <div>
                    Mentor Invite Code: {classData.mentorInviteCode}
                    <Button onClick={handleGenerateMentorInviteCode}>
                      Generate New Code
                    </Button>
                  </div>
                </div>
              )}
            </Route>
          </Switch>
        </div>
      </div>
    )
  );
}

export default ClassMain;
