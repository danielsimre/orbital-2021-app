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
});

function Dashboard() {
  // Queried values
  const [userTaskList, setUserTaskList] = useState([]);
  const [userAnnouncementList, setUserAnnouncementList] = useState([]);
  const [userCommentList, setUserCommentList] = useState([]);

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);
  const classes = useStyles();

  // Query for user info (tasks, announcements, comments)
  function getAllUserDashInfo() {
    // Query announcements
    axios
      .all([
        axios.get("/api/v1/announcements", { withCredentials: true }),
        axios.get("/api/v1/tasks", { withCredentials: true }),
        axios.get("/api/v1/comments", { withCredentials: true }),
      ])
      .then(
        axios.spread((announcements, tasks, comments) => {
          setUserAnnouncementList(announcements.data.slice(0, 2));
          setUserTaskList(tasks.data.incompletedTasks.slice(0, 5));
          setUserCommentList(comments.data.slice(0, 2));
        })
      )
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => getAllUserDashInfo(), []);

  return (
    isRetrieving || (
      <div>
        <h1 style={{ textAlign: "center" }}>Dashboard</h1>{" "}
        <div className={classes.container}>
          <div className={classes.left}>
            <CustomBox>
              <Typography variant="h5">Upcoming Tasks</Typography>
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
