import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  makeStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";

const useStyles = makeStyles({
  button: {
    border: "1px solid black",
    alignSelf: "center",
  },
});

function EditSubmissionButton(props) {
  // Queried values
  const { submissionLinks, refreshGroupData, taskId, isCompleted } = props;

  // Form values
  const [newSubmissionLink, setNewSubmissionLink] = useState("");

  // Misc values
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
  }

  // new URL will throw an error if the url is invalid
  function isValidURL(url) {
    try {
      new URL(url);
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }

  function handleSaveLinks(submissionLinks) {
    axios
      .put(
        `/api/v1/tasks/${taskId}?submissions`,
        {
          submissionLinks: submissionLinks,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        refreshGroupData();
      })
      .catch((err) => console.log(err));
  }

  function handleAddLink() {
    if (isValidURL(newSubmissionLink)) {
      const newSubmissionLinks = [...submissionLinks, newSubmissionLink];
      handleSaveLinks(newSubmissionLinks);
    }
    // snackbar error
    setNewSubmissionLink("");
  }

  function handleDeleteLink(index) {
    handleSaveLinks(
      submissionLinks.slice(0, index).concat(submissionLinks.slice(index + 1))
    );
  }

  return (
    <>
      <Button
        onClick={handleDialogOpen}
        className={classes.button}
        disabled={isCompleted}
      >
        Add Submission
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Submissions</DialogTitle>
        <DialogContent>
          {submissionLinks.map((link, index) => (
            <div>
              {link}{" "}
              <Button onClick={() => handleDeleteLink(index)}>
                <CloseIcon />
              </Button>
            </div>
          ))}
          <DialogContentText>
            Add links for your submissions here.
          </DialogContentText>
          <form>
            <div className={classes.root}>
              <TextField
                id="submission url"
                label="Submission Link"
                variant="outlined"
                required
                value={newSubmissionLink}
                onChange={(event) => setNewSubmissionLink(event.target.value)}
              />
            </div>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button type="submit" onClick={handleAddLink}>
                Add Submission Link
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditSubmissionButton;
