import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
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

function ClassList(props) {
  const [isRetrieving, setIsRetrieving] = useState(true);
  const [queriedClassList, setQueriedClassList] = useState([]);
  const styles = useStyles();

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

  useEffect(() => queryClassList(), []);

  function getClassURL(classID) {
    return "my_classes/" + classID;
  }

  return (
    isRetrieving || (
      <div>
        <h2 className={styles.tableTitle}>Class List</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody align="center">
            {queriedClassList.map((curClass, index) => (
              <tr key={curClass.classId.id}>
                <td>{index + 1}</td>
                <td>
                  <Button
                    component={Link}
                    to={getClassURL(curClass.classId.id)}
                  >
                    {curClass.classId.attributes.name}
                  </Button>
                </td>
                <td>{curClass.classId.attributes.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}

export default ClassList;
