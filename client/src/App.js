import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Switch from 'react-bootstrap/esm/Switch';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import FooterPage from './components/Footer/Footer';
import Home from './components/Home/Home';
import Navigation from './components/Navigation/Navigation';
import AuthContext, { extractIsAdmin, extractUser, getToken } from './providers/AuthContext';
import GuardedRoute from './providers/GuardedRoute';
import Login from './components/Login/Login';
import Logout from './components/Logout';
import Register from './components/Register/Register';
import Users from './components/Users';
import Planning from './components/Planning';
import CreateOffice from './components/CreateOffice/CreateOffice';
import Offices from './components/Offices';
import CreateProject from './components/CreateProject/CreateProject';
import Projects from './components/Projects';
import DetailProject from './components/DetailProject/DetailProject';
import MyProfile from './components/MyProfile/MyProfile';
import CovidData from './components/CovidData';

function App() {
  const [authValue, setAuthValue] = useState({
    isLoggedIn: !!extractUser(getToken()),
    isAdmin: extractIsAdmin(getToken()),
    user: extractUser(getToken())
  });
  return (
    <BrowserRouter>
      <AuthContext.Provider value={{...authValue, setLoginState: setAuthValue}}>
        <div className="App">
          <Navigation />
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/users/now" component={Users} />
            <Route path="/users/later" component={Users} />
            <GuardedRoute path="/users/me" auth={authValue.isLoggedIn} exact component={MyProfile} />
            <GuardedRoute path="/covid" auth={authValue.isLoggedIn && authValue.isAdmin} exact component={CovidData} />
            <GuardedRoute path="/logout" auth={authValue.isLoggedIn} component={Logout} />
            <GuardedRoute path="/projects/:id" exact auth={authValue.isLoggedIn} component={DetailProject} />
            <GuardedRoute path="/projects" exact auth={authValue.isLoggedIn} component={Projects} />
            <GuardedRoute path="/office/create" exact auth={authValue.isLoggedIn && authValue.isAdmin} component={CreateOffice} />
            <Route path="/offices/:id/planning" exact component={Planning} />
            <Route path="/offices/:id/planning/later" component={Planning} />
            <GuardedRoute path="/offices/:id/project/create" exact auth={authValue.isLoggedIn && authValue.isAdmin} component={CreateProject} />
            <Route path="/offices" exact component={Offices} />
            <Redirect path="/" to="/home" />

          </Switch>
        </div>
        </AuthContext.Provider>
        <FooterPage />
      </BrowserRouter>
  );
}

export default App;
