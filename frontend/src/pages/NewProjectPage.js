import NewProjectForm from "../components/NewProjectForm";
import HeaderBar from "../components/HeaderBar";
function NewProjectPage(props) {
    const { setIsAuthenticated, projectList, setProjectList } = props;

    return (
        <>
            <HeaderBar setIsAuthenticated={setIsAuthenticated} />
            <NewProjectForm
                projectList={projectList}
                setProjectList={setProjectList}
            />
        </>
    );
}

export default NewProjectPage;
