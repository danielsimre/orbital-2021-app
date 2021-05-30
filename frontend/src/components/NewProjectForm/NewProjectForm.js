import { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import styles from "./NewProjectForm.module.css";

function NewProjectForm(props) {
    // States for project name, description and due date
    const [projName, setProjName] = useState("");
    const [projDescription, setProjDescription] = useState("");
    const [projDueDate, setProjDueDate] = useState();

    const { projectList, setProjectList } = props;

    // adds a new project to the list, should update to the database
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(
            "New Project (Due " +
                projDueDate +
                ") " +
                projName +
                ": " +
                projDescription
        );
        const newProjectList = [
            ...projectList,
            {
                name: projName,
                description: projDescription,
                dueDate: projDueDate,
            },
        ];
        setProjectList(newProjectList);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.newProjectForm}>
            <fieldset>
                <legend>Create New Project</legend>
                <div>
                    <TextField
                        id="project_name"
                        label="Project Name"
                        variant="outlined"
                        required
                        value={projName}
                        onChange={(event) => setProjName(event.target.value)}
                    />
                </div>
                <div>
                    <TextField
                        id="project_descrption"
                        label="Description"
                        variant="outlined"
                        multiline
                        required
                        value={projDescription}
                        onChange={(event) =>
                            setProjDescription(event.target.value)
                        }
                    />
                </div>
                <div>
                    <TextField
                        id="due_date"
                        label="Due Date"
                        type="date"
                        required
                        value={projDueDate}
                        onChange={(event) => setProjDueDate(event.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ margin: "0 auto", display: "flex" }}
                >
                    Create New Project
                </Button>
            </fieldset>
        </form>
    );
}

export default NewProjectForm;
