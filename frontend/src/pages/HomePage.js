import HeaderBar from "../components/HeaderBar";
import Home from "../components/Home";

function HomePage(props) {
    const { setIsAuthenticated } = props;
    return (
        <>
            <HeaderBar setIsAuthenticated={setIsAuthenticated} />
            <Home />
        </>
    );
}

export default HomePage;
