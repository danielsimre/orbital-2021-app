import { useState } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import NewProjectForm from "../components/NewProjectForm";

function NewProjectPage() {
  const [hasNewProjectCreated, setHasNewProjectCreated] = useState(false);
  const [projName, setProjName] = useState("");
  const [newestProjName, setNewestProjName] = useState("");

  return (
    <>
      <NewProjectForm
        projName={projName}
        setProjName={setProjName}
        setHasNewProjectCreated={setHasNewProjectCreated}
        setNewestProjName={setNewestProjName}
      />
      <div>
        {hasNewProjectCreated && (
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setHasNewProjectCreated(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            <AlertTitle>Successfully created project!</AlertTitle>
            Your project <strong>{newestProjName}</strong> has been created
            successfully!
          </Alert>
        )}
      </div>
    </>
  );
}

export default NewProjectPage;
