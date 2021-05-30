import "./App.css";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NewProjectPage from "./pages/NewProjectPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import RegistrationPage from "./pages/RegistrationPage";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ProjectMainPage from "./pages/ProjectMainPage";
import axios from "axios";

/* CURRENT STRUCTURE (pages -> components under them)
  - Login Page
    - Login
  - Home Page
    - HeaderBar
    - Home
  - New Project Page
    - HeaderBar
    - NewProjectForm (does not work here, need to connect to database)
  - My Projects Page
    - HeaderBar
    - ProjectList
    - NewProjectForm (works here)
  - Project Main Page (ideally linked from button from ProjectList: see dynamic paths for react-router)
    - ProjectMain
*/

function App() {
    // lift projectList state up to App level for both NewProjectForm and ProjectList
    const [projectList, setProjectList] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    console.log(isAuthenticated);

    async function getUserData() {
        try {
            await axios
                .get("http://localhost:5000/api/v1/users", {
                    withCredentials: true,
                })
                .then((response) => {
                    if (
                        response.data.msg !==
                        "Failed to authenticate, please login"
                    ) {
                        setIsAuthenticated(true);
                    }
                });
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => getUserData(), []);

    return isLoading ? (
        <div>
            <h1>Verifying...</h1>
        </div>
    ) : (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <LoginPage
                        isAuthenticated={isAuthenticated}
                        setIsAuthenticated={setIsAuthenticated}
                    />
                </Route>

                <Route exact path="/register">
                    <RegistrationPage />
                </Route>

                <ProtectedRoute
                    path="/home"
                    component={HomePage}
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                />

                <ProtectedRoute
                    path="/new_project"
                    component={NewProjectPage}
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                    projectList={projectList}
                    setProjectList={setProjectList}
                />

                <ProtectedRoute
                    path="/my_projects"
                    component={MyProjectsPage}
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                    projectList={projectList}
                    setProjectList={setProjectList}
                />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
