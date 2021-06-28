import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100% - 64px)",
      }}
    >
      <h1>404 Error: Page Not Found</h1>
      <Button component={Link} to="/">
        Back to Home
      </Button>
    </div>
  );
}

export default Page404;
