import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Snackbar,
  makeStyles,
  Typography,
} from "@material-ui/core/";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";

import GroupTaskList from "./GroupTaskList";
import GroupUserList from "./GroupUserList";
import RenameGroupDialog from "./RenameGroupDialog";
import { ClassRoles } from "../../../enums";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    maxHeight: "100%",
    overflow: "auto",
  },
  tabs: {
    display: "flex",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
  },
  header: {
    padding: "1rem",
  },
  leaveButton: {
    color: "red",
  },
});

function GroupMain(props) {
  // Queried values
  const { classID, groupID } = useParams();
  const { curUserRole, isCompleted } = props;
  const [groupData, setGroupData] = useState(undefined);

  const isMentor = curUserRole === ClassRoles.MENTOR;

  // Dialog values
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
    setDisplayAlert(true);
  }

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);

  // Tab values
  const [tabIndex, setTabIndex] = useState(0);
  const classes = useStyles();

  function handleChange(event, newValue) {
    setTabIndex(newValue);
  }

  function handleLeaveOpen() {
    setLeaveDialogOpen(true);
  }

  function handleLeaveClose() {
    setLeaveDialogOpen(false);
  }

  function getGroupData() {
    axios
      .get(`/api/v1/groups/${groupID}`, {
        withCredentials: true,
      })
      .then((res) => {
        setGroupData(res.data.attributes);
      })
      .catch((err) => {
        console.log(`Could not find group with ID: ${groupID}`);
      })
      .finally(() => setIsRetrieving(false));
  }

  function handleLeaveGroup(event) {
    event.preventDefault();
    axios
      .delete(`/api/v1/groups/${groupID}/users`, { withCredentials: true })
      .then((res) =>
        handleAlert(
          "Left the group",
          "You have successfully left the group",
          "success"
        )
      )
      .catch((err) => {
        console.log(err);
        handleAlert("Error!", err.response.data.msg, "error");
      })
      .finally(() => setLeaveDialogOpen(false));
    // Unsure how to redirect if needed, may also need alert
  }

  useEffect(() => {
    axios
      .get(`/api/v1/groups/${groupID}`, {
        withCredentials: true,
      })
      .then((res) => {
        setGroupData(res.data.attributes);
      })
      .catch((err) => {
        console.log(`Could not find group with ID: ${groupID}`);
      })
      .finally(() => setIsRetrieving(false));
  }, [groupID]);

  return (
    isRetrieving ||
    // If user is not authorized to view this group, redirect them to the class main page
    (groupData === undefined ? (
      <Redirect to={`/classes/${classID}`} />
    ) : (
      <div className={classes.root}>
        <div>
          <Typography variant="h5" className={classes.header}>
            {groupData.name}
            <RenameGroupDialog
              groupId={groupID}
              refreshGroupList={getGroupData}
              isCompleted={isCompleted}
            />
          </Typography>

          <Button onClick={handleLeaveOpen}>Leave Group</Button>
        </div>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          centered
          className={classes.tabs}
        >
          <Tab label="Tasks" />
          <Tab label="Users" />
        </Tabs>
        {tabIndex === 0 ? (
          <GroupTaskList
            queriedTaskList={groupData.tasks}
            refreshGroupData={getGroupData}
            groupMembers={groupData.groupMembers}
            isMentor={isMentor}
            isCompleted={isCompleted}
          />
        ) : (
          <GroupUserList
            groupMembers={groupData.groupMembers}
            mentors={groupData.mentoredBy}
            isMentor={isMentor}
            isCompleted={isCompleted}
            refreshGroupData={getGroupData}
            groupID={groupID}
          />
        )}
        {/* Start of Delete Comment Dialog */}
        <Dialog open={leaveDialogOpen} onClose={handleLeaveClose}>
          <DialogTitle>Leave Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to leave this group?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLeaveClose}>Cancel</Button>
            <Button
              type="submit"
              className={classes.leaveButton}
              onClick={(event) => handleLeaveGroup(event)}
            >
              Leave
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={displayAlert}
          onClose={() => setDisplayAlert(false)}
        >
          <Alert onClose={() => setDisplayAlert(false)} severity={alertState}>
            <AlertTitle>{alertTitleText}</AlertTitle>
            {alertText}
          </Alert>
        </Snackbar>
      </div>
    ))
  );
}

export default GroupMain;
