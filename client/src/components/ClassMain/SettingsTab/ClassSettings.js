import { Typography } from "@material-ui/core";
import { Redirect, useParams } from "react-router-dom";
import { ClassRoles } from "../../../enums";

function ClassSettings(props) {
  const { curUserRole } = props;
  const { classID } = useParams();

  if (curUserRole !== ClassRoles.MENTOR) {
    return <Redirect to={`/classes/${classID}`} />;
  }
  return <Typography>Class Settings page</Typography>;
}

export default ClassSettings;
