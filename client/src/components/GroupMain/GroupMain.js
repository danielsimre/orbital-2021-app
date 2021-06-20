import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function GroupMain(props) {
  const { groupID } = useParams();

  const [groupData, setGroupData] = useState({});
  const [isRetrieving, setIsRetrieving] = useState(true);

  function getGroupData(groupID) {
    console.log(groupID);
    axios
      .get(`/api/v1/groups/${groupID}`, {
        withCredentials: true,
      })
      .then(function (response) {
        console.log(response);
        setGroupData(response.data.attributes);
      })
      .catch(function (error) {
        console.log(`Could not find group with ID: ${groupID}`);
      })
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => {
    getGroupData(groupID);
  }, [groupID]);

  return (
    isRetrieving || (
      <div>
        <h2>Group name: {groupData.name}</h2>
        <p>Tasks: </p>
        <p>Users: </p>
      </div>
    )
  );
}

export default GroupMain;
