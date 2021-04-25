import React, { useEffect } from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import CompanyList from "../companies/CompanyList";
import JobList from "../jobs/JobList";
import CompanyDetail from "../companies/CompanyDetail";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profiles/ProfileForm";
import SignupForm from "../auth/SignupForm";
import PrivateRoute from "./PrivateRoute";
import JoblyAPI from "./api/api";
import UserContext from "./auth/UserContext";
import NavBar from "./routes-nav/NavBar";

export const TOKEN_STORAGE_ID = "jobly-token";

const App = () => {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [applicationIds, setApplicationIds] = useState(new Set([]));
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID)
  
  console.debug(
    "App",
    "infoLoaded=", infoLoaded,
    "currentUser=", currentUser,
    "token=", token,
  );

  useEffect( function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          JoblyAPI.token = token;
          let currentUser = await JoblyAPI.getCurrentUser(username);
          setCurrentUser(currentUser);
          setApplicationIds(new Set(currentUser.applications));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getCurrentUser();
  },[token]);

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  }

  async function signup(signupData) {
    try {
      let token = await JoblyAPI.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let token = await JoblyAPI.login(loginData);
      setToken(token);
      return { success: true};
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  const hasAppliedToJob = (id) => {
    return applicationIds.has(id);
  }

  const applyToJob = (id) => {
    if (hasAppliedToJob(id)) return;
    JoblyAPI.applyToJob(currentUser.username, id);
    setApplicationIds(new Set([...applicationIds, id]));
  }

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{ currentUser, setCurrentUser, hasAppliedToJob,applyToJob}}>
          <div className="App">
            <NavBar logout={logout} />
            <Routes login={login} signup={signup} />
          </div>
        </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
