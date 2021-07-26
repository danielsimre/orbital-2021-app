import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/router/ProtectedRoute";
import axios from "axios";

import HeaderBar from "./components/HeaderBar/HeaderBar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import MyClassesPage from "./pages/MyClassesPage";
import MyGroupsPage from "./pages/MyGroupsPage";
import RegistrationPage from "./pages/RegistrationPage";
import ClassMainPage from "./pages/ClassMainPage";
import ProfilePage from "./pages/ProfilePage";
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

  // This const is used to (crudely) force HeaderBar to update username
  const [updateUser, setUpdateUser] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
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
    fetchData();
  }, []);

  return (
    isLoading || (
      <BrowserRouter>
        <HeaderBar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          updateUser={updateUser}
        />
        <Switch>
          <Route exact path="/">
            <LoginPage
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          </Route>

          <Route exact path="/register">
            <RegistrationPage isAuthenticated={isAuthenticated} />
          </Route>

          <ProtectedRoute
            path="/home"
            component={HomePage}
            isAuthenticated={isAuthenticated}
          />

          <ProtectedRoute
            path="/classes/:classID"
            component={ClassMainPage}
            isAuthenticated={isAuthenticated}
          />

          <ProtectedRoute
            path="/classes"
            component={MyClassesPage}
            isAuthenticated={isAuthenticated}
          />

          <ProtectedRoute
            path="/groups"
            component={MyGroupsPage}
            isAuthenticated={isAuthenticated}
          />
          <ProtectedRoute
            path="/profile"
            component={ProfilePage}
            isAuthenticated={isAuthenticated}
            updateUser={updateUser}
            setUpdateUser={setUpdateUser}
          />

          <Route path="*" component={Page404} />
        </Switch>
      </BrowserRouter>
    )
  );
}

export default App;
