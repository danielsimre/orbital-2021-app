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
import axios from "axios";

import NewClassDialog from "./NewClassDialog";
import InviteCodeDialog from "./InviteCodeDialog";

const useStyles = makeStyles({
  header: {
    padding: "0.45em",
    display: "flex",
    flexDirection: "row",
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

function ClassList() {
  // Queried values
  const [queriedClassList, setQueriedClassList] = useState([]);

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);
  const classes = useStyles();

  function queryClassList() {
    axios
      .get("/api/v1/users?classes", {
        withCredentials: true,
      })
      .then((response) => {
        setQueriedClassList(response.data.classes);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => queryClassList(), [queriedClassList]);

  return (
    isRetrieving || (
      <div>
        <div className={classes.header}>
          <Typography variant="h5">Class List</Typography>
          <NewClassDialog />
          <InviteCodeDialog />
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
            {queriedClassList.map((curClass, index) => (
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
      </div>
    )
  );
}

export default ClassList;
