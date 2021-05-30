import Login from "../components/Login";
import { Button } from "@material-ui/core";

function LoginPage(props) {
  const { isAuthenticated, setIsAuthenticated } = props;

  return (
    <>
      <Login
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Button href="/register">Register for new account</Button>
    </>
  );
}

export default LoginPage;
