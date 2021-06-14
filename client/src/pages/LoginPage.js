import LoginForm from "../components/LoginForm";
import { Redirect, Link } from "react-router-dom";
import { Button } from "@material-ui/core";

function LoginPage(props) {
  const { isAuthenticated, setIsAuthenticated } = props;

  return isAuthenticated ? (
    <Redirect to="/home" />
  ) : (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <LoginForm
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <Button
        style={{ margin: "0 auto", display: "flex" }}
        component={Link}
        to="/register"
      >
        Register for new account
      </Button>
    </div>
  );
}

export default LoginPage;
