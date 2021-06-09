import { Button } from "@material-ui/core";

function Page404() {
  return (
    <div style={{ textAlign: "flex" }}>
      <p>404 Error: Page Not Found</p>
      <Button href="/">Back to Home</Button>
    </div>
  );
}

export default Page404;
