import { useState } from "react";
import { Button, TextField, IconButton } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import CloseIcon from "@material-ui/icons/Close";

import styles from "./RegistrationForm.module.css";
import axios from "axios";

function RegistrationForm() {
  // for the form
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [errorText, setErrorText] = useState("");

  // for the laert
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  const MIN_PASSWORD_LENGTH = 6;

  function handleRegistration(event) {
    event.preventDefault();
    registerUser(
      registerUsername,
      registerEmail,
      registerPassword,
      registerPasswordConfirm
    );
  }

  function registerUser(username, email, password, passwordConfirm) {
    // Reset state of password checker
    setHasPasswordError(false);
    setErrorText("");

    // Validate password
    if (password !== passwordConfirm) {
      setHasPasswordError(true);
      setErrorText("Passwords do not match");
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      setHasPasswordError(true);
      setErrorText("Password is too short");
    } else {
      // Passwords are valid
      axios
        .post(
          "/api/v1/users/register",
          {
            username: username,
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
    <>
      <form className={styles.registrationForm} onSubmit={handleRegistration}>
        <fieldset>
          <legend>Register</legend>
          <div>
            <TextField
              required
              id="email"
              label="Email"
              variant="outlined"
              type="email"
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
            />
          </div>
          <div>
            <TextField
              required
              id="username"
              label="Username"
              variant="outlined"
              value={registerUsername}
              onChange={(event) => setRegisterUsername(event.target.value)}
            />
          </div>
          <div>
            <TextField
              required
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
              error={hasPasswordError}
            />
          </div>
          <div>
            <TextField
              required
              id="password"
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={registerPasswordConfirm}
              onChange={(event) =>
                setRegisterPasswordConfirm(event.target.value)
              }
              error={hasPasswordError}
              helperText={errorText}
            />
          </div>
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "0 auto", display: "flex" }}
            >
              Register
            </Button>
          </div>
        </fieldset>
      </form>
      <div>
        <Button
          style={{
            display: "flex",
            margin: "0 auto",
            width: "200px",
          }}
          href="/"
        >
          Back to Login
        </Button>
      </div>
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

export default RegistrationForm;
