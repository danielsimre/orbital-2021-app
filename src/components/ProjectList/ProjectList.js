import { Route } from "react-router-dom";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

/* TODO:
    1) Figure out how to pass name, desc, due date props to a project in the list
    
*/

const useStyles = makeStyles({
    tableTitle: {
        textAlign: "center",
    },
    table: {
        margin: "0 auto",
        width: "100%",
        border: "1px solid black",
    },
});

function ProjectList(props) {
    const { projectList } = props;

    const classes = useStyles();

    return (
        <div>
            <h2 className={classes.tableTitle}>Project List</h2>
            <table className={classes.table}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody align="center">
                    {projectList.map((project, index) => (
                        <tr key={project.name}>
                            <td>{index + 1}</td>
                            {/* Current link is a link to a common page not modified by any props */}
                            <td>
                                <Button href="/project/main">
                                    {project.name}
                                </Button>
                            </td>
                            <td>{project.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProjectList;
