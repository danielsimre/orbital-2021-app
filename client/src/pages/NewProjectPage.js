import { useState } from "react";

import NewProjectForm from "../components/NewProjectForm";
import HeaderBar from "../components/HeaderBar";

function NewProjectPage(props) {
    const { setIsAuthenticated } = props;
    const [hasNewProjectCreated, setHasNewProjectCreated] = useState(false);
    const [projName, setProjName] = useState("");

    return (
        <>
            <HeaderBar setIsAuthenticated={setIsAuthenticated} />
            <NewProjectForm
                projName={projName}
                setProjName={setProjName}
                setHasNewProjectCreated={setHasNewProjectCreated}
            />
            <div>
                {hasNewProjectCreated ? (
                    <p>New Project {projName} has been created!</p>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}

export default NewProjectPage;
