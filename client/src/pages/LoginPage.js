import LoginForm from "../components/LoginForm";
import { Button } from "@material-ui/core";

function LoginPage(props) {
  const { isAuthenticated, setIsAuthenticated } = props;

  return (
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

      <Button style={{ margin: "0 auto", display: "flex" }} href="/register">
        Register for new account
      </Button>
    </div>
  );
}

export default LoginPage;
