import { useState } from "react";
import { Button, TextField, Snackbar } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import styles from "./LoginForm.module.css";
import axios from "axios";

function LoginForm(props) {
  const [logInEmail, setLogInEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const { setIsAuthenticated } = props;

  // for the alert
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  function handleLogIn(event) {
    event.preventDefault();
    logIn(logInEmail, logInPassword);
  }

  function logIn(userEmail, userPassword) {
    axios
      .post(
        "/api/v1/users/login",
        {
          email: userEmail,
          password: userPassword,
        },
        { withCredentials: true }
      )
      .then(function (response) {
        if (response.data.msg === "Successfully Authenticated") {
          setIsAuthenticated(true);
        }
      })
      .catch(function (error) {
        console.log("Error with email: " + userEmail);
        console.log(error);
        handleAlert("Failed to login", "Incorrect email or password", "error");
        setDisplayAlert(true);
      });
  }

  return (
    <>
      <form className={styles.loginForm} onSubmit={handleLogIn}>
        <fieldset>
          <legend>Sign in</legend>
          <div>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              type="email"
              value={logInEmail}
              onChange={(event) => setLogInEmail(event.target.value)}
            />
          </div>
          <div>
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              value={logInPassword}
              onChange={(event) => setLogInPassword(event.target.value)}
            />
          </div>
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "0 auto", display: "flex" }}
            >
              Log In
            </Button>
          </div>
        </fieldset>
      </form>
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
    </>
  );
}
export default LoginForm;
