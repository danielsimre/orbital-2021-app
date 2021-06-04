import HeaderBar from "../components/HeaderBar";
import ProjectList from "../components/ProjectList/ProjectList";

function MyProjectsPage(props) {
    const { setIsAuthenticated, projectList, setProjectList } = props;

    return (
        <>
            <HeaderBar setIsAuthenticated={setIsAuthenticated} />
            <ProjectList
                projectList={projectList}
                setProjectList={setProjectList}
            />
        </>
    );
}

export default MyProjectsPage;
