import { useState, useEffect } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import axios from "axios";

import CustomBox from "../CustomBox";
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
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [userTaskList, setUserTaskList] = useState([]);
  const [userAnnouncementList, setUserAnnouncementList] = useState([]);
  const [userCommentList, setUserCommentList] = useState([]);

  const classes = useStyles();

  // conduct query for users tasks
  function getAllUserDashInfo() {
    //query user stuff
    axios
      .get("/api/v1/announcements", { withCredentials: true })
      .then((res) => {
        console.log(res);
        setUserAnnouncementList(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsRetrieving(false));

    // dummy task list for now
    setUserTaskList([
      { name: "Task 1", desc: "dummy task 1", id: 1, dueDate: "23 Jun 2021" },
      { name: "Task 2", desc: "dummy task 3", id: 2, dueDate: "28 Jun 2021" },
      { name: "Task 5", desc: "dummdee", id: 3, dueDate: "20 Jul 2021" },
    ]);

    // dummy comment list for now
    setUserCommentList([
      {
        createdBy: "User 2",
        creationDate: "3 Jun 2021",
        title: "additional changes",
        content:
          "need to add an extra sentence explaining the cause in front i think",
      },
    ]);
  }

  useEffect(() => getAllUserDashInfo(), []);

  return (
    isRetrieving || (
      <div>
        <h1 style={{ textAlign: "center" }}>Dashboard</h1>{" "}
        {/* change to Typography */}
        <div className={classes.container}>
          <div className={classes.left}>
            <CustomBox>
              <Typography variant="h5">Tasks Due</Typography>
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
