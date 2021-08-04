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
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import axios from "axios";

const useStyles = makeStyles({
  tableTitle: {
    paddingTop: "0.5em",
    textAlign: "center",
  },
  table: {
    margin: "0 auto",
    width: "100%",
    border: "1px solid black",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
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

  // Pagination values
  const ITEMS_PER_PAGE = 5;
  const numMemberPages = Math.ceil(memberGroupList.length / ITEMS_PER_PAGE);
  const [memberPage, setMemberPage] = useState(1);
  const [displayMemberList, setDisplayMemberList] = useState([]);
  const numMentorPages = Math.ceil(mentorGroupList.length / ITEMS_PER_PAGE);
  const [mentorPage, setMentorPage] = useState(1);
  const [displayMentorList, setDisplayMentorList] = useState([]);

  const classCompleted = (group) =>
    group.attributes.classId.attributes.isCompleted;

  function handleMemberChange(event, value) {
    setMemberPage(value);
    setDisplayMemberList(
      memberGroupList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  function handleMentorChange(event, value) {
    setMentorPage(value);
    setDisplayMentorList(
      mentorGroupList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  function handleChange(event, newValue) {
    setTabIndex(newValue);
  }

  function queryGroupList() {
    axios
      .get("/api/v1/groups", {
        withCredentials: true,
      })
      .then((response) => {
        setMemberGroupList(
          response.data.memberOf.filter((group) => !classCompleted(group))
        );
        setMentorGroupList(
          response.data.mentorOf.filter((group) => !classCompleted(group))
        );
        setDisplayMemberList(
          response.data.memberOf
            .filter((group) => !classCompleted(group))
            .slice(0, ITEMS_PER_PAGE)
        );
        setDisplayMentorList(
          response.data.mentorOf
            .filter((group) => !classCompleted(group))
            .slice(0, ITEMS_PER_PAGE)
        );
        console.log(response.data.memberOf);
        console.log(response.data.mentorOf);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => queryGroupList(), []);

  const groupList = tabIndex === 0 ? displayMemberList : displayMentorList;

  const paginationIndex =
    tabIndex === 0
      ? (memberPage - 1) * ITEMS_PER_PAGE
      : (mentorPage - 1) * ITEMS_PER_PAGE;

  const paginationButtons =
    tabIndex === 0
      ? numMemberPages < 2 || (
          <Pagination
            count={numMemberPages}
            page={memberPage}
            onChange={handleMemberChange}
            className={classes.pagination}
          />
        )
      : numMentorPages < 2 || (
          <Pagination
            count={numMentorPages}
            page={mentorPage}
            onChange={handleMentorChange}
            className={classes.pagination}
          />
        );

  return (
    isRetrieving || (
      <div>
        <Typography variant="h5" className={classes.tableTitle}>
          Group List
        </Typography>
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
                <TableCell>{paginationIndex + index + 1}</TableCell>
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
        {paginationButtons}
      </div>
    )
  );
}

export default GroupList;
