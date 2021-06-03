import LoginForm from "../components/LoginForm";
import { Button } from "@material-ui/core";

function LoginPage(props) {
  const { isAuthenticated, setIsAuthenticated } = props;

  return (
    <>
      <LoginForm
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Button href="/register">Register for new account</Button>
    </>
  );
}

export default LoginPage;
