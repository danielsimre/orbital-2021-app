import { useState } from "react";
import { Redirect } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import styles from "./LoginForm.module.css";
import axios from "axios";

function LoginForm(props) {
  const [logInEmail, setLogInEmail] = useState("");
  const [logInPassword, setLogInPassword] = useState("");
  const { isAuthenticated, setIsAuthenticated } = props;

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
        console.log(response);
        if (response.data.msg === "Successfully Authenticated") {
          setIsAuthenticated(true);
        }
      })
      .catch(function (error) {
        console.log(userEmail);
        console.log(error);
      });
  }

  return isAuthenticated ? (
    <Redirect to="/home" />
  ) : (
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
  );
}

export default LoginForm;
