import { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

/* TODO:
    1) Figure out how to pass name, desc, due date props to a project in the list
    
*/

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

function ProjectList(props) {
  const { projectList } = props;
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [queriedProjectList, setQueriedProjectList] = useState([]);
  const classes = useStyles();

  async function queryProjectList() {
    try {
      await axios
        .get("/api/v1/users?projects", {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          setQueriedProjectList(response.data.projects);
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsRetrieving(false);
    }
  }

  useEffect(() => queryProjectList(), []);

  return isRetrieving ? (
    <div>
      <h1>Retrieving your projects...</h1>
    </div>
  ) : (
    <div>
      <h2 className={classes.tableTitle}>Project List</h2>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody align="center">
          {queriedProjectList.map((project, index) => (
            <tr key={project.projectId._id}>
              <td>{index + 1}</td>
              {/* Current link is a link to a common page not modified by any props */}
              <td>
                <Button href="/project/main">{project.projectId.name}</Button>
              </td>
              <td>{project.projectId.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectList;
