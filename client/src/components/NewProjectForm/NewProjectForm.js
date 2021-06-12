import { useState } from "react";
import { Button, TextField, IconButton } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";

import styles from "./NewProjectForm.module.css";
import axios from "axios";

function NewProjectForm(props) {
  // for the form
  const [projName, setProjName] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projDueDate, setProjDueDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [hasDateError, setHasDateError] = useState(false);
  const [errorText, setErrorText] = useState("");

  // for the alert
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // adds a new project to the list, should update to the database
  const handleSubmit = (event) => {
    event.preventDefault();
    handleNewProject(projName, projDescription, projDueDate);
  };

  function handleNewProject(name, desc, dueDate) {
    // Reset state of date checker
    setHasDateError(false);
    setErrorText("");

    // Validate date
    if (dueDate <= new Date().toISOString().slice(0, 10)) {
      setHasDateError(true);
      setErrorText("Invalid due date");
      return;
    }

    axios
      .post(
        "/api/v1/projects/",
        {
          name: name,
          desc: desc,
          dueDate: dueDate,
        },
        { withCredentials: true }
      )
      .then(
        (res) =>
          handleAlert(
            "Project Created!",
            "Your project has been created successfully!",
            "success"
          ),
        (err) =>
          handleAlert(
            "Error!",
            "An error occurred: " + err.response.data.msg,
            "error"
          )
      )
      .then(() => setDisplayAlert(true));
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.newProjectForm}>
        <fieldset>
          <legend>Create New Project</legend>
          <div>
            <TextField
              id="project_name"
              label="Project Name"
              variant="outlined"
              required
              value={projName}
              onChange={(event) => setProjName(event.target.value)}
            />
          </div>
          <div>
            <TextField
              id="project_descrption"
              label="Description"
              variant="outlined"
              multiline
              required
              value={projDescription}
              onChange={(event) => setProjDescription(event.target.value)}
            />
          </div>
          <div>
            <TextField
              id="due_date"
              label="Due Date"
              type="date"
              required
              value={projDueDate}
              onChange={(event) => setProjDueDate(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              error={hasDateError}
              helperText={errorText}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ margin: "0 auto", display: "flex" }}
          >
            Create New Project
          </Button>
        </fieldset>
      </form>
      <div>
        {displayAlert && (
          <Alert
            severity={alertState}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setDisplayAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>{alertTitleText}</AlertTitle>
            {alertText}
          </Alert>
        )}
      </div>
    </>
  );
}

export default NewProjectForm;
