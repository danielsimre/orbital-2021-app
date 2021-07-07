import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Modal,
  Paper,
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

import NewClassForm from "./NewClassForm";

const useStyles = makeStyles({
  header: {
    padding: "12px",
  },
  table: {
    margin: "0 auto",
    width: "100%",
    border: "1px solid black",
  },
  button: {
    float: "right",
  },
  paper: {
    width: "20%",
    margin: "0 auto",
    padding: "16px",
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
  const [formModalOpen, setFormModalOpen] = useState(false);
  const classes = useStyles();

  // Pagination values
  const ITEMS_PER_PAGE = 2;
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

  function closeForm() {
    setFormModalOpen(false);
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

  return (
    isRetrieving || (
      <div>
        <Typography variant="h5" align="left" className={classes.header}>
          Class List
          <Button
            onClick={() => setFormModalOpen(true)}
            className={classes.button}
          >
            Create New Class
          </Button>
        </Typography>
        <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
          <Paper elevation={1} className={classes.paper}>
            <NewClassForm closeForm={closeForm} />
          </Paper>
        </Modal>
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
                <TableCell>{index + 1}</TableCell>
                <TableCell>{curClass.classId.attributes.name}</TableCell>
                <TableCell>{curClass.classId.attributes.desc}</TableCell>
                <TableCell align="right">
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
    )
  );
}

export default ClassList;
