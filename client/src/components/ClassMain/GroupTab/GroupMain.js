import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab, makeStyles } from "@material-ui/core/";
import axios from "axios";

import GroupTaskList from "./GroupTaskList";
import GroupUserList from "./GroupUserList";
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
});

function GroupMain(props) {
  // Queried values
  const { groupID } = useParams();
  const { curUserRole, curUserId, refreshClassData, isCreator, isCompleted } =
    props;
  const [groupData, setGroupData] = useState({});

  const isMentor = curUserRole === ClassRoles.MENTOR;

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);

  // Misc values
  const [tabIndex, setTabIndex] = useState(0);
  const classes = useStyles();

  function handleChange(event, newValue) {
    setTabIndex(newValue);
  }

  function getGroupData(groupID) {
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

  useEffect(() => {
    getGroupData(groupID);
  }, [groupID]);

  return (
    isRetrieving || (
      <div className={classes.root}>
        <h1>{groupData.name}</h1>
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
            refreshGroupData={() => getGroupData(groupID)}
            groupMembers={groupData.groupMembers}
            isMentor={isMentor}
            isCompleted={isCompleted}
          />
        ) : (
          <GroupUserList
            groupMembers={groupData.groupMembers}
            mentors={groupData.mentoredBy}
            isCreator={isCreator}
            curUserId={curUserId}
            isCompleted={isCompleted}
          />
        )}
      </div>
    )
  );
}

export default GroupMain;
