import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProjectMain(props) {
  const { projectID } = useParams();
  const [projectData, setProjectData] = useState({});

  function getProjectData(projID) {
    axios
      .get(`/api/v1/projects/info/${projID}`, {
        withCredentials: true,
        params: {
          id: projID,
        },
      })
      .then(function (response) {
        console.log(response); // REMOVE WHEN NOT NEEDED
        setProjectData(response.data);
      })
      .catch(function (error) {
        console.log(`Could not find project with ID: ${projID}`);
      });
  }

  useEffect(() => {
    getProjectData(projectID);
    console.log(projectID);
  }, [projectID]);

  return (
    <div>
      <h1>
        Project Main Page for {projectData.name} due {projectData.dueDate}.
      </h1>
      <p>Description: {projectData.desc}</p>
    </div>
  );
}

export default ProjectMain;
