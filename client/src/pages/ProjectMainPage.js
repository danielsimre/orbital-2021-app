import HeaderBar from "../components/HeaderBar";
import ProjectMain from "../components/ProjectMain";

function ProjectMainPage(props) {
    const { setIsAuthenticated } = props;

    return (
        <>
            <HeaderBar setIsAuthenticated={setIsAuthenticated} />
            <ProjectMain />
        </>
    );
}

export default ProjectMainPage;
