import { Redirect } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";

function RegistrationPage(props) {
  const { isAuthenticated } = props;

  return isAuthenticated ? <Redirect to="/home" /> : <RegistrationForm />;
}

export default RegistrationPage;
