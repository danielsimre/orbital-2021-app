import { useState } from "react";
import { Button, TextField, Snackbar, makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import axios from "axios";

const useStyles = makeStyles({
  newClassForm: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

function NewClassForm(props) {
  // Passed values
  const { refreshClassList, closeForm, handleAlert, setDisplayAlert } = props;

  // Form values
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");

  // Misc values
  const classes = useStyles();

  function handleSubmit(event) {
    event.preventDefault();
    handleNewClass(className, classDescription);
  }

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
      .then(() => refreshClassList())
      .then(() => setDisplayAlert(true))
      .finally(() => closeForm());
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.newClassForm}>
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
    </>
  );
}

export default NewClassForm;
