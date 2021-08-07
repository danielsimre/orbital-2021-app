import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Snackbar, makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import axios from "axios";

const useStyles = makeStyles({
  registrationForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  button: {
    margin: "0 auto",
    marginTop: "0.3em",
    display: "flex",
    background: "#eba834",
  },
  textField: {
    padding: "0.5rem",
  },
});

function RegistrationForm() {
  // Form values
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [hasNameError, setHasNameError] = useState(false);

  // Alert values
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  // Misc values
  const classes = useStyles();
  const [errorText, setErrorText] = useState("");
  const [nameErrorText, setNameErrorText] = useState("");

  const MIN_PASSWORD_LENGTH = 6;

  function handleRegistration(event) {
    event.preventDefault();
    registerUser(
      registerUsername,
      registerFirstName,
      registerLastName,
      registerEmail,
      registerPassword,
      registerPasswordConfirm
    );
  }

  function registerUser(
    username,
    first,
    last,
    email,
    password,
    passwordConfirm
  ) {
    // Reset state of password checker
    setHasPasswordError(false);
    setHasNameError(false);
    setErrorText("");
    setNameErrorText("");

    // Validate password
    if (password !== passwordConfirm) {
      setHasPasswordError(true);
      setErrorText("Passwords do not match");
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      setHasPasswordError(true);
      setErrorText("Password is too short");
    } else if (
      registerFirstName.trim() === "" ||
      registerLastName.trim() === ""
    ) {
      setHasNameError(true);
      setNameErrorText("Please fill in a name");
    } else {
      // Passwords are valid
      axios
        .post(
          "/api/v1/users/register",
          {
            username: username,
            firstName: first.trim(),
            lastName: last.trim(),
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
          },
          { withCredentials: true }
        )
        .then(
          (res) =>
            handleAlert(
              "Success!",
              "Your new account has been created!",
              "success"
            ),
          (err) =>
            handleAlert("Error!", "Reason: " + err.response.data.msg, "error")
        )
        .finally(() => setDisplayAlert(true));
    }
  }

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  return (
    <div className={classes.registrationForm}>
      <form onSubmit={handleRegistration}>
        <fieldset>
          <legend>Register</legend>
          <div className={classes.textField}>
            <TextField
              required
              id="email"
              label="Email"
              variant="outlined"
              type="email"
              value={registerEmail}
              onChange={(event) => {
                // Do not allow spaces
                const regex = /^\S*$/g;
                const value = event.target.value;
                if (value === "" || regex.test(value)) {
                  setRegisterEmail(value);
                }
              }}
            />
          </div>
          <div className={classes.textField}>
            <TextField
              required
              id="username"
              label="Username"
              variant="outlined"
              value={registerUsername}
              onChange={(event) => {
                // Do not allow spaces
                const regex = /^\S*$/g;
                const value = event.target.value;
                if (value === "" || regex.test(value)) {
                  setRegisterUsername(value);
                }
              }}
            />
          </div>
          <div className={classes.textField}>
            <TextField
              required
              id="first name"
              label="First name"
              variant="outlined"
              value={registerFirstName}
              error={hasNameError}
              onChange={(event) => {
                setRegisterFirstName(event.target.value);
              }}
            />
          </div>
          <div className={classes.textField}>
            <TextField
              required
              id="last name"
              label="Last name"
              variant="outlined"
              value={registerLastName}
              error={hasNameError}
              helperText={nameErrorText}
              onChange={(event) => {
                setRegisterLastName(event.target.value);
              }}
            />
          </div>
          <div className={classes.textField}>
            <TextField
              required
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              value={registerPassword}
              onChange={(event) => {
                // Do not allow spaces
                const regex = /^\S*$/g;
                const value = event.target.value;
                if (value === "" || regex.test(value)) {
                  setRegisterPassword(value);
                }
              }}
              error={hasPasswordError}
            />
          </div>
          <div className={classes.textField}>
            <TextField
              required
              id="password"
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={registerPasswordConfirm}
              onChange={(event) => {
                // Do not allow spaces
                const regex = /^\S*$/g;
                const value = event.target.value;
                if (value === "" || regex.test(value)) {
                  setRegisterPasswordConfirm(value);
                }
              }}
              error={hasPasswordError}
              helperText={errorText}
            />
          </div>
          <div>
            <Button
              type="submit"
              variant="contained"
              className={classes.button}
            >
              Register
            </Button>
          </div>
        </fieldset>
      </form>
      <Button
        style={{
          display: "flex",
        }}
        component={Link}
        to="/"
      >
        Back to Login
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={displayAlert}
        onClose={() => setDisplayAlert(false)}
      >
        <Alert onClose={() => setDisplayAlert(false)} severity={alertState}>
          <AlertTitle>{alertTitleText}</AlertTitle>
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default RegistrationForm;
