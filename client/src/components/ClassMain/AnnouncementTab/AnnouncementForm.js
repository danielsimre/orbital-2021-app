import { useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  makeStyles,
} from "@material-ui/core";

import axios from "axios";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
});

function AnnouncementForm(props) {
  // Queried values
  const {
    classID,
    handleAlert,
    setDisplayAlert,
    getClassAnnouncements,
    handleDialogClose,
  } = props;

  // Form values
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceBody, setAnnounceBody] = useState("");

  // Misc values
  const classes = useStyles();

  function handleSubmit(event) {
    event.preventDefault();
    handleMakeAnnouncement(announceTitle.trim(), announceBody.trim(), classID);
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
        handleDialogClose();
        setDisplayAlert(true);
      });
  }

  return (
    <>
      <DialogTitle>Create Announcement</DialogTitle>
      <DialogContent>
        <DialogContentText>Create an announcement below.</DialogContentText>
        <form className={classes.root} onSubmit={handleSubmit}>
          <TextField
            id="announcement_title"
            label="Announcement Title"
            variant="outlined"
            required
            value={announceTitle}
            onChange={(event) => {
              // Do not allow spaces at the beginning, one space between words
              const regex = /^[^\s]+(\s?[^\s]+)*(\s)?$/g;
              const value = event.target.value;
              if (value === "" || regex.test(value)) {
                setAnnounceTitle(value);
              }
            }}
          />
          <TextField
            id="announcement_body"
            label="Announcement Text"
            variant="outlined"
            multiline
            required
            value={announceBody}
            onChange={(event) => {
              // Do not allow spaces at the beginning
              const regex = /^[^\s]+(\s+[^\s]+)*(\s)*$/g;
              const value = event.target.value;
              if (value === "" || regex.test(value)) {
                setAnnounceBody(value);
              }
            }}
          />
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit">Make Announcement</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </>
  );
}

export default AnnouncementForm;
