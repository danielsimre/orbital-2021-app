import { useState } from "react";
import { Button, TextField, makeStyles } from "@material-ui/core";

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
  const {
    classID,
    handleAlert,
    setDisplayAlert,
    getClassAnnouncements,
    closeForm,
  } = props;

  // Form values
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceBody, setAnnounceBody] = useState("");

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
      .then(() => getClassAnnouncements(classId))
      .catch((err) => console.log(err))
      .finally(() => {
        closeForm();
        setDisplayAlert(true);
      });
  }

  return (
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
  );
}

export default AnnouncementForm;
