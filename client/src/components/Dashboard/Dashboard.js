import { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";

import CustomBox from "../CustomBox";
import DashboardTasks from "./DashboardTasks";
import DashboardAnnouncements from "./DashboardAnnouncements";
import DashboardComments from "./DashboardComments";

function Dashboard() {
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [userTaskList, setUserTaskList] = useState([]);
  const [userAnnouncementList, setUserAnnouncementList] = useState([]);
  const [userCommentList, setUserCommentList] = useState([]);

  // conduct query for users tasks
  function getAllUserTasks() {
    //query user stuff

    // dummy task list for now
    setUserTaskList([
      { name: "Task 1", desc: "dummy task 1", id: 1, dueDate: "23 Jun 2021" },
      { name: "Task 2", desc: "dummy task 3", id: 2, dueDate: "28 Jun 2021" },
      { name: "Task 5", desc: "dummdee", id: 3, dueDate: "20 Jul 2021" },
    ]);

    setUserAnnouncementList([
      {
        createdBy: "Mr A",
        creationDate: "4 Jun 2021",
        title: "Reminder: Task due tomorrow",
        content:
          "Please be reminded that your task 1 is due tomorrow 2359. Late submissions will not be tolerated. Thank you.",
        class: "Class A",
      },
      {
        createdBy: "Mr A",
        creationDate: "1 Jun 2021",
        title: "Correction: Question 5",
        content:
          "Please take note that there is an error in Question 5 of Assignment 1. 'for all' should be 'there exists'. Apologies.",
        class: "Class A",
      },
    ]);

    setUserCommentList([
      {
        createdBy: "User 2",
        creationDate: "3 Jun 2021",
        title: "additional changes",
        content:
          "need to add an extra sentence explaining the cause in front i think",
      },
    ]);

    setIsRetrieving(false);
  }

  useEffect(() => getAllUserTasks(), []);

  return (
    isRetrieving || (
      <div>
        <h1 style={{ textAlign: "center" }}>Dashboard</h1>
        <div style={{ display: "flex" }}>
          <CustomBox>
            <Typography variant="h5">Tasks Due</Typography>
            <DashboardTasks userTaskList={userTaskList} />
          </CustomBox>
          <div>
            <CustomBox>
              <Typography variant="h5">Announcements</Typography>
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
