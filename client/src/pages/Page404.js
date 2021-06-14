import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <div style={{ textAlign: "flex" }}>
      <p>404 Error: Page Not Found</p>
      <Button component={Link} to="/">
        Back to Home
      </Button>
    </div>
  );
}

export default Page404;
