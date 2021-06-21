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
  /*
  function getUserData() {
    try {
      axios
        .get("/api/v1/users/auth", {
          withCredentials: true,
        })
        .then((response) => {
          return response.data.isAuthenticated;
        });
    } catch (err) {
      console.log(err.response.data);
      setIsAuthenticated(false);
    } finally {
      console.log("In finally block");
    }
  }
  async function getUserData() {
    const res = await axios.get("/api/v1/users/auth", {
      withCredentials: true,
    });
    return await res.data.isAuthenticated;
  }
  */

  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/v1/users/auth", {
        withCredentials: true,
      });
      setIsAuthenticated(res.data.isAuthenticated);
    })();
  }, [setIsAuthenticated]);

  return (
    <BrowserRouter>
      <HeaderBar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
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
          path="/new_class"
          component={NewClassPage}
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
          path="/groups/:groupID"
          component={GroupMainPage}
          isAuthenticated={isAuthenticated}
        />

        <Route path="*" component={Page404} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
