import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProjectMain(props) {
  const { projectID } = useParams();
  const [projectData, setProjectData] = useState({});

  function getProjectData(projID) {
    axios
      .get(`/api/v1/projects/${projID}`, {
        withCredentials: true,
        params: {
          id: projID,
        },
      })
      .then(function (response) {
        console.log(response); // REMOVE WHEN NOT NEEDED
        setProjectData(response.data.attributes);
      })
      .catch(function (error) {
        console.log(`Could not find project with ID: ${projID}`);
      });
  }

  useEffect(() => {
    getProjectData(projectID);
    console.log(projectID);
  }, [projectID]);

  function convertDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <div>
      <h1>
        Project Main Page for {projectData.name} due{" "}
        {convertDate(projectData.dueDate)}.
      </h1>
      <p>Description: {projectData.desc}</p>
    </div>
  );
}

export default ProjectMain;
