import { useState, useEffect } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import axios from "axios";

import CustomBox from "./CustomBox";
import DashboardTasks from "./DashboardTasks";
import DashboardAnnouncements from "./DashboardAnnouncements";
import DashboardComments from "./DashboardComments";

const useStyles = makeStyles({
  container: {
    display: "flex",
  },

  left: {
    width: "50%",
  },

  right: {
    width: "50%",
  },
  title: {
    textAlign: "center",
    padding: "1rem",
  },
});

function Dashboard() {
  // Queried values
  const [userTaskList, setUserTaskList] = useState([]);
  const [userAnnouncementList, setUserAnnouncementList] = useState([]);
  const [userCommentList, setUserCommentList] = useState([]);
  const [username, setUsername] = useState("");

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);
  const classes = useStyles();

  const isCompletedClass = (item) =>
    item.attributes.classId.attributes.isCompleted;

  // Query for user info (tasks, announcements, comments)
  function getAllUserDashInfo() {
    // Query announcements
    axios
      .all([
        axios.get("/api/v1/announcements", { withCredentials: true }),
        axios.get("/api/v1/tasks", { withCredentials: true }),
        axios.get("/api/v1/comments", { withCredentials: true }),
        axios.get("/api/v1/users", { withCredentials: true }),
      ])
      .then(
        axios.spread((announcements, tasks, comments, userData) => {
          setUserAnnouncementList(
            announcements.data.filter((ann) => !isCompletedClass(ann))
          );
          setUserTaskList(
            tasks.data.incompletedTasks.filter(
              (task) => !isCompletedClass(task)
            )
          );
          setUserCommentList(comments.data);
          setUsername(userData.data.attributes.username);
        })
      )
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => getAllUserDashInfo(), []);

  return (
    isRetrieving || (
      <div>
        <Typography variant="h4" className={classes.title}>
          Welcome back, {username}!
        </Typography>{" "}
        <div className={classes.container}>
          <div className={classes.left}>
            <CustomBox>
              <Typography variant="h5">Task List</Typography>
              <DashboardTasks userTaskList={userTaskList} />
            </CustomBox>
          </div>
          <div className={classes.right}>
            <CustomBox>
              <Typography variant="h5">Recent Announcements</Typography>
              <DashboardAnnouncements
                userAnnouncementList={userAnnouncementList}
              />
            </CustomBox>
            <CustomBox>
              <Typography variant="h5">Recent Comments</Typography>
              <DashboardComments userCommentList={userCommentList} />
            </CustomBox>
          </div>
        </div>
      </div>
    )
  );
}

export default Dashboard;
