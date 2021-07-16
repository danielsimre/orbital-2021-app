import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import axios from "axios";

import NewClassDialog from "./NewClassDialog";
import InviteCodeDialog from "./InviteCodeDialog";

const useStyles = makeStyles({
  header: {
    padding: "0.45em",
    display: "flex",
    textAlign: "center",
  },
  span: { flex: "1" },
  title: { flex: "1" },
  table: {
    margin: "0 auto",
    width: "100%",
    border: "1px solid black",
    overflow: "auto",
  },
  tableCell: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "0",
  },
  buttons: {
    flex: "1",
    textAlign: "right",
  },
  paper: {
    width: "20%",
    margin: "0 auto",
    padding: "1rem",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
});

function ClassList() {
  // Queried values
  const [queriedClassList, setQueriedClassList] = useState([]);

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);
  const classes = useStyles();

  // Pagination values
  const ITEMS_PER_PAGE = 5;
  const numPages = Math.ceil(queriedClassList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState([]);

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      queriedClassList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  function queryClassList() {
    axios
      .get("/api/v1/users?classes", {
        withCredentials: true,
      })
      .then((response) => {
        setQueriedClassList(response.data.classes);
        setDisplayList(response.data.classes.slice(0, ITEMS_PER_PAGE));
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => queryClassList(), []);

  useEffect(() => {
    setDisplayList(
      queriedClassList.slice(
        ITEMS_PER_PAGE * (page - 1),
        ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE
      )
    );
  }, [queriedClassList, page]);

  return (
    isRetrieving || (
      <>
        <div>
          <div className={classes.header}>
            <span className={classes.span}></span>
            <Typography variant="h5" className={classes.title}>
              Class List
            </Typography>
            <div className={classes.buttons}>
              <NewClassDialog refreshClassList={queryClassList} />
              <InviteCodeDialog refreshClassList={queryClassList} />
            </div>
          </div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody align="center">
              {displayList.map((curClass, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    {(page - 1) * ITEMS_PER_PAGE + index + 1}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {curClass.classId.attributes.name}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {curClass.classId.attributes.desc}
                  </TableCell>
                  <TableCell align="right" className={classes.tableCell}>
                    <Button
                      component={Link}
                      to={`/classes/${curClass.classId.id}`}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {numPages < 2 || (
            <Pagination
              count={numPages}
              page={page}
              onChange={handleChange}
              className={classes.pagination}
            />
          )}
        </div>
      </>
    )
  );
}

export default ClassList;
