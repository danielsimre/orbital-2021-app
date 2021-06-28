import { Redirect } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function LoginPage(props) {
  const { isAuthenticated, setIsAuthenticated } = props;

  return isAuthenticated ? (
    <Redirect to="/home" />
  ) : (
    <LoginForm
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
    />
  );
}

export default LoginPage;
