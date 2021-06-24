import { useState, useEffect } from "react";
import { Button, Tabs, Tab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles({
  tableTitle: {
    textAlign: "center",
  },
  table: {
    margin: "0 auto",
    width: "100%",
    border: "1px solid black",
  },
});

function GroupList(props) {
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [memberGroupList, setMemberGroupList] = useState([]);
  const [mentorGroupList, setMentorGroupList] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const styles = useStyles();

  async function queryGroupList() {
    try {
      await axios
        .get("/api/v1/groups", {
          withCredentials: true,
        })
        .then((response) => {
          setMemberGroupList(response.data.memberOf);
          setMentorGroupList(response.data.mentorOf);
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsRetrieving(false);
    }
  }

  useEffect(() => queryGroupList(), []);

  function getGroupURL(classID, groupID) {
    return `classes/${classID}/groups/${groupID}`;
  }

  const groupList = tabIndex === 0 ? memberGroupList : mentorGroupList;

  return (
    isRetrieving || (
      <div>
        <h2 className={styles.tableTitle}>Group List</h2>
        <Tabs value={tabIndex} onChange={handleChange} centered>
          <Tab label="Member" />
          <Tab label="Mentor" />
        </Tabs>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Group Name</th>
              <th>Class</th>
            </tr>
          </thead>
          <tbody align="center">
            {groupList.map((curGroup, index) => (
              <tr key={curGroup.id}>
                <td>{index + 1}</td>
                <td>
                  <Button
                    component={Link}
                    to={getGroupURL(
                      curGroup.attributes.classId.id,
                      curGroup.id
                    )}
                  >
                    {curGroup.attributes.name}
                  </Button>
                </td>
                <td>{curGroup.attributes.classId.attributes.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default GroupList;
