import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/router/ProtectedRoute";
import axios from "axios";

import HeaderBar from "./components/HeaderBar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NewProjectPage from "./pages/NewProjectPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProjectMainPage from "./pages/ProjectMainPage";
import Page404 from "./pages/Page404";

/* CURRENT STRUCTURE (pages -> components under them)
  - Login Page
    - Login
  - Home Page
    - HeaderBar
    - Home
  - New Project Page
    - HeaderBar
    - NewProjectForm
  - My Projects Page
    - HeaderBar
    - ProjectList
  - Project Main Page (ideally linked from button from ProjectList: see dynamic paths for react-router)
    - ProjectMain
*/

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    async function getUserData() {
        try {
            await axios
                .get("/api/v1/users", {
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
        <>
            {isAuthenticated ? (
                <HeaderBar setIsAuthenticated={setIsAuthenticated} />
            ) : (
                <></>
            )}
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

                    <ProtectedRoute path="/home" component={HomePage} />

                    <ProtectedRoute
                        path="/new_project"
                        component={NewProjectPage}
                    />

                    <ProtectedRoute
                        path="/my_projects/:projectID"
                        component={ProjectMainPage}
                    />

                    <ProtectedRoute
                        path="/my_projects"
                        component={MyProjectsPage}
                    />

                    <Route path="*" component={Page404} />
                </Switch>
            </BrowserRouter>
        </>
    );
}

export default App;
