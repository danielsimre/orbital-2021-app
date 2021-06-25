import { useState, useEffect } from "react";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import axios from "axios";

import NewClassForm from "../NewClassForm/NewClassForm";

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
});

function ClassList(props) {
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [queriedClassList, setQueriedClassList] = useState([]);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const classes = useStyles();

  async function queryClassList() {
    try {
      await axios
        .get("/api/v1/users?classes", {
          withCredentials: true,
        })
        .then((response) => {
          setQueriedClassList(response.data.classes);
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsRetrieving(false);
    }
  }

  useEffect(() => queryClassList(), [queriedClassList]);

  function getClassURL(classID) {
    return `/classes/${classID}`;
  }

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
            <NewClassForm />
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
            {queriedClassList.map((curClass, index) => (
              <TableRow key={index} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{curClass.classId.attributes.name}</TableCell>
                <TableCell>{curClass.classId.attributes.desc}</TableCell>
                <TableCell align="right">
                  <Button
                    component={Link}
                    to={getClassURL(curClass.classId.id)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  );
}

export default ClassList;
