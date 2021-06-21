import { useState, useEffect } from "react";
import {
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@material-ui/core";
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

  const classes = useStyles();

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
        <h2 className={classes.tableTitle}>Class List</h2>
        <Tabs value={tabIndex} onChange={handleChange} centered>
          <Tab label="Member" />
          <Tab label="Mentor" />
        </Tabs>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Group Name</TableCell>
              <TableCell>Class</TableCell>
            </TableRow>
          </TableHead>
          <TableBody align="center">
            {groupList.map((curGroup, index) => (
              <TableRow key={curGroup.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={getGroupURL(
                      curGroup.attributes.classId.id,
                      curGroup.id
                    )}
                  >
                    {curGroup.attributes.name}
                  </Button>
                </TableCell>
                <TableCell>
                  {curGroup.attributes.classId.attributes.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  );
}

export default GroupList;
