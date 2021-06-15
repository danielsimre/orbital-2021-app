import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/router/ProtectedRoute";
import axios from "axios";

import HeaderBar from "./components/HeaderBar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NewClassPage from "./pages/NewClassPage";
import MyClassesPage from "./pages/MyClassesPage";
import RegistrationPage from "./pages/RegistrationPage";
import ClassMainPage from "./pages/ClassMainPage";
import GroupMainPage from "./pages/GroupMainPage";
import Page404 from "./pages/Page404";

/* CURRENT STRUCTURE (pages -> components under them)
  - Login Page
    - Login
  - HeaderBar on all pages below
  - Home Page
    - Home
  - New Class Page
    - NewClassForm
  - My Classes Page
    - ClassList
  - Class Main Page
    - ClassMain
  - Group Main Page
    - TaskBoard
      - TaskList
*/

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function getUserData() {
    try {
      await axios
        .get("/api/v1/users/auth", {
          withCredentials: true,
        })
        .then((response) => {
          setIsAuthenticated(response.data.isAuthenticated);
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

          <ProtectedRoute
            path="/home"
            component={HomePage}
            isAuthenticated={isAuthenticated}
          />

          <ProtectedRoute
            path="/new_class"
            component={NewClassPage}
            isAuthenticated={isAuthenticated}
          />

          <ProtectedRoute
            path="/my_classes/:classID"
            component={ClassMainPage}
            isAuthenticated={isAuthenticated}
          />

          <ProtectedRoute
            path="/my_classes"
            component={MyClassesPage}
            isAuthenticated={isAuthenticated}
          />

          <ProtectedRoute
            path="/groups/:groupID"
            component={GroupMainPage}
            isAuthenticated={isAuthenticated}
          />

          <Route path="*" component={Page404} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
