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
  button: {
    border: "1px solid black",
    alignSelf: "center",
    flex: "0 0",
  },
});

function ClassList() {
  // Queried values
  const [queriedClassList, setQueriedClassList] = useState([]);
  const [completedClassList, setCompletedClassList] = useState([]);

  // Pagination values
  const ITEMS_PER_PAGE = 5;
  const numPages = Math.ceil(queriedClassList.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(1);
  const [displayList, setDisplayList] = useState([]);

  const numCompletedPages = Math.ceil(
    completedClassList.length / ITEMS_PER_PAGE
  );
  const [completedPage, setCompletedPage] = useState(1);
  const [displayCompletedList, setDisplayCompletedList] = useState([]);

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const classes = useStyles();

  function handleChange(event, value) {
    setPage(value);
    setDisplayList(
      queriedClassList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  function handleCompletedChange(event, value) {
    setCompletedPage(value);
    setDisplayCompletedList(
      completedClassList.slice(
        ITEMS_PER_PAGE * (value - 1),
        ITEMS_PER_PAGE * (value - 1) + ITEMS_PER_PAGE
      )
    );
  }

  const completedClass = (classObj) => classObj.isCompleted;
  const classList = showCompleted ? displayCompletedList : displayList;
  const paginationButtons = showCompleted
    ? numCompletedPages < 2 || (
        <Pagination
          count={numCompletedPages}
          page={completedPage}
          onChange={handleCompletedChange}
          className={classes.pagination}
        />
      )
    : numPages < 2 || (
        <Pagination
          count={numPages}
          page={page}
          onChange={handleChange}
          className={classes.pagination}
        />
      );

  function queryClassList() {
    axios
      .get("/api/v1/users?classes", {
        withCredentials: true,
      })
      .then((response) => {
        setQueriedClassList(
          response.data.classes.filter((classObj) => !completedClass(classObj))
        );
        setCompletedClassList(
          response.data.classes.filter((classObj) => completedClass(classObj))
        );
        setDisplayList(
          response.data.classes
            .filter((classObj) => !completedClass(classObj))
            .slice(0, ITEMS_PER_PAGE)
        );
        setDisplayCompletedList(
          response.data.classes
            .filter((classObj) => completedClass(classObj))
            .slice(0, ITEMS_PER_PAGE)
        );
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
              {showCompleted ? "Completed Class List" : "Current Class List"}
            </Typography>
            <div className={classes.buttons}>
              <Button
                onClick={() => setShowCompleted(!showCompleted)}
                className={classes.button}
                size="small"
              >
                {showCompleted
                  ? "View Current Classes"
                  : "View Completed Classes"}
              </Button>
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
              {classList.map((curClass, index) => (
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
          {paginationButtons}
        </div>
      </>
    )
  );
}

export default ClassList;
