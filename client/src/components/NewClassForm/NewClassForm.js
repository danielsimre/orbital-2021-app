import { useState } from "react";
import { Button, TextField, Snackbar } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import styles from "./NewClassForm.module.css";
import axios from "axios";

function NewClassForm(props) {
  // for the form
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");

  // for the alert
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    handleNewClass(className, classDescription);
  };

  function handleNewClass(name, desc) {
    axios
      .post(
        "/api/v1/classes/",
        {
          name: name,
          desc: desc,
        },
        { withCredentials: true }
      )
      .then(
        (res) =>
          handleAlert(
            "Class Created!",
            "The class has been created successfully!",
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
      <form onSubmit={handleSubmit} className={styles.newClassForm}>
        <fieldset>
          <legend>Create New Class</legend>
          <div>
            <TextField
              id="class_name"
              label="Class Name"
              variant="outlined"
              required
              value={className}
              onChange={(event) => setClassName(event.target.value)}
            />
          </div>
          <div>
            <TextField
              id="class_descrption"
              label="Class Description"
              variant="outlined"
              multiline
              required
              value={classDescription}
              onChange={(event) => setClassDescription(event.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ margin: "0 auto", display: "flex" }}
          >
            Create New Class
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

export default NewClassForm;
