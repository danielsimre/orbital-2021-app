import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ClassMain(props) {
  const { classID } = useParams();
  const [classData, setClassData] = useState({});

  function getClassData(classID) {
    axios
      .get(`/api/v1/classes/${classID}`, {
        withCredentials: true,
        params: {
          id: classID,
        },
      })
      .then(function (response) {
        console.log(response); // REMOVE WHEN NOT NEEDED
        setClassData(response.data.attributes);
      })
      .catch(function (error) {
        console.log(`Could not find class with ID: ${classID}`);
      });
  }

  useEffect(() => {
    getClassData(classID);
    console.log(classID);
  }, [classID]);

  return (
    <div>
      <h1>Class Main Page for {classData.name}</h1>
      <p>Description: {classData.desc}</p>
    </div>
  );
}

export default ClassMain;
