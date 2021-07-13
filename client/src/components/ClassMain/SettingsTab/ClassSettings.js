import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Redirect, useParams } from "react-router-dom";
import { ClassRoles } from "../../../enums";

const useStyles = makeStyles({
  header: {
    textAlign: "center",
    padding: "1rem",
  },
  completeButton: {
    color: "red",
  },
});

function ClassSettings(props) {
  // Queried values
  const { curUserRole } = props;
  const { classID } = useParams();

  // Class Complete Dialog values
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

  function handleDialogOpen() {
    setCompleteDialogOpen(true);
  }

  function handleDialogClose() {
    setCompleteDialogOpen(false);
  }

  function handleClassComplete() {
    console.log("Class is locked");
  }

  const classes = useStyles();

  if (curUserRole !== ClassRoles.MENTOR) {
    return <Redirect to={`/classes/${classID}`} />;
  }
  return (
    <>
      <Typography variant="h5" className={classes.header}>
        Class Settings
      </Typography>
      <div>
        <Typography variant="body1">
          End the class: Users can still view the class information, but will no
          longer be able to join the class, create tasks, make modifications,
          etc.
        </Typography>
        <Button onClick={handleDialogOpen}>Mark this class as finished</Button>
      </div>
      <Dialog open={completeDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>End the class?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end this class? You can still view the
            class information, but all class data will be locked and cannot be
            modified ever again. WARNING: THIS ACTION IS IRREVERSIBLE!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            className={classes.completeButton}
            onClick={(event) => handleClassComplete(event)}
          >
            End the class
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ClassSettings;
