import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function GroupMain(props) {
  // Queried values
  const { groupID } = useParams();
  const [groupData, setGroupData] = useState({});

  // Misc values
  const [isRetrieving, setIsRetrieving] = useState(true);

  function getGroupData(groupID) {
    console.log(groupID);
    axios
      .get(`/api/v1/groups/${groupID}`, {
        withCredentials: true,
      })
      .then((res) => {
        setGroupData(res.data.attributes);
      })
      .catch((err) => {
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
        <p>
          Tasks:{" "}
          {groupData.tasks.map((task) => (
            <>{task.attributes.name} </>
          ))}
        </p>
        <p>
          Users:{" "}
          {groupData.groupMembers.map((member) => (
            <>{member.attributes.username} </>
          ))}
        </p>
        <p>
          Mentors:{" "}
          {groupData.mentoredBy.map((mentor) => (
            <>{mentor.attributes.username} </>
          ))}
        </p>
      </div>
    )
  );
}

export default GroupMain;
