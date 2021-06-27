import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Snackbar, makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import axios from "axios";

const useStyles = makeStyles({
  loginForm: {
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
});

function LoginForm(props) {
  const [logInEmail, setLogInEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const { setIsAuthenticated } = props;

  // for the alert
  const [displayAlert, setDisplayAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTitleText, setAlertTitleText] = useState("");
  const [alertState, setAlertState] = useState("");

  const classes = useStyles();

  function handleAlert(title, message, severity) {
    setAlertTitleText(title);
    setAlertText(message);
    setAlertState(severity);
  }

  function handleLogin(event) {
    event.preventDefault();
    login(logInEmail, logInPassword);
  }

  function login(userEmail, userPassword) {
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
    <div className={classes.loginForm}>
      <form onSubmit={handleLogin}>
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
              className={classes.button}
            >
              Log In
            </Button>
          </div>
        </fieldset>
      </form>
      <Button
        style={{ margin: "0 auto", display: "flex" }}
        component={Link}
        to="/register"
      >
        Register for new account
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
export default LoginForm;
