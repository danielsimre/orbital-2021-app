import { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@material-ui/core";

function ProfilePage(props) {
  const [curUserInfo, setCurUserInfo] = useState({});
  const [isRetrieving, setIsRetrieving] = useState(true);

  function getUserData() {
    // GET request
    axios
      .get("/api/v1/users", { withCredentials: true })
      .then((res) => {
        setCurUserInfo(res.data.attributes);
        console.log(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsRetrieving(false));
  }

  useEffect(() => getUserData(), []);

  return (
    isRetrieving || (
      <div>
        <Typography>Username: {curUserInfo.username}</Typography>
      </div>
    )
  );
}

export default ProfilePage;
