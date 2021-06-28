import { useState } from "react";
import { Button, TextField, Snackbar, makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import axios from "axios";

const useStyles = makeStyles({
  announcementForm: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

function AnnouncementForm(props) {
  // Queried values
  const { classID, getClassAnnouncements } = props;

  // Form values
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceBody, setAnnounceBody] = useState("");

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Misc values
  const classes = useStyles();

  function handleSubmit(event) {
    event.preventDefault();
    handleMakeAnnouncement(announceTitle, announceBody, classID);
  }

  function handleMakeAnnouncement(title, content, classId) {
    axios
      .post(
        `/api/v1/classes/${classId}/announcements`,
        {
          title: title,
          content: content,
        },
        { withCredentials: true }
      )
      .then(
        (res) =>
          handleAlert(
            "Announcement Made!",
            "Your announcement has been made!",
            "success"
          ),
        (err) =>
          handleAlert(
            "Error!",
            "An error occurred: " + err.response.data.msg,
            "error"
          )
      )
      .then(() => setDisplayAlert(true))
      .then(() => getClassAnnouncements(classId))
      .catch((err) => console.log(err));
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.announcementForm}>
        <fieldset>
          <legend>Announcement</legend>
          <div>
            <TextField
              id="announcement_title"
              label="Announcement Title"
              variant="outlined"
              required
              value={announceTitle}
              onChange={(event) => setAnnounceTitle(event.target.value)}
            />
          </div>
          <div>
            <TextField
              id="announcement_body"
              label="Announcement Text"
              variant="outlined"
              multiline
              required
              value={announceBody}
              onChange={(event) => setAnnounceBody(event.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ margin: "0 auto", display: "flex" }}
          >
            Make Announcement
          </Button>
        </fieldset>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={displayAlert}
        onClose={() => setDisplayAlert(false)}
      >
        <Alert onClose={() => setDisplayAlert(false)} severity={alertState}>
          <AlertTitle>{alertTitleText}</AlertTitle>
          {alertText}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AnnouncementForm;
