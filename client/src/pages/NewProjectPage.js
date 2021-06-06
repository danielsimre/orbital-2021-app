import { useState } from "react";

import NewProjectForm from "../components/NewProjectForm";

function NewProjectPage() {
    const [hasNewProjectCreated, setHasNewProjectCreated] = useState(false);
    const [projName, setProjName] = useState("");

    return (
        <>
            <NewProjectForm
                projName={projName}
                setProjName={setProjName}
                setHasNewProjectCreated={setHasNewProjectCreated}
            />
            <div>
                {hasNewProjectCreated && (
                    <p>New Project {projName} has been created!</p>
                )}
            </div>
        </>
    );
}

export default NewProjectPage;
