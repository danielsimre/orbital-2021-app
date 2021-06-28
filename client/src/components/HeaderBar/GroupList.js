import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  makeStyles,
} from "@material-ui/core";
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
  // Queried values
  const [memberGroupList, setMemberGroupList] = useState([]);
  const [mentorGroupList, setMentorGroupList] = useState([]);

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const classes = useStyles();

  function handleChange(event, newValue) {
    setTabIndex(newValue);
  }

  function queryGroupList() {
    axios
      .get("/api/v1/groups", {
        withCredentials: true,
      })
      .then((response) => {
        setMemberGroupList(response.data.memberOf);
        setMentorGroupList(response.data.mentorOf);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => queryGroupList(), []);

  const groupList = tabIndex === 0 ? memberGroupList : mentorGroupList;

  return (
    isRetrieving || (
      <div>
        <h2 className={classes.tableTitle}>Group List</h2>
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
                    to={`classes/${curGroup.attributes.classId.id}/groups/${curGroup.id}`}
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
