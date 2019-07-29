import React, { Fragment, useEffect } from 'react';
import './App.css';

import AddEducation from './components/profile-form/AddEducation';
import AddExperience from './components/profile-form/AddExperience';
import Alert from './components/layout/Alert';
import CreateProfile from './components/profile-form/CreateProfile';
import Dashboard from './components/dashboard/Dashboard';
import EditProfile from './components/profile-form/EditProfile';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import { loadAccount } from './actions/Auth';
import Navbar from './components/layout/Navbar';
import Posts from './components/posts/Posts';
import PrivateRoute from './components/routing/PrivateRoute';
import Profile from './components/profile/Profile';
import Profiles from './components/Profiles/Profiles';
import Register from './components/auth/Register';
import SetAuthToken from './utils/SetAuthToken';
import store from './store';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

if (localStorage.token) {
  SetAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadAccount);
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profile/:id' component={Profile} />
              <Route exact path='/profiles' component={Profiles} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/create-profile' component={CreateProfile} />
              <PrivateRoute exact path='/edit-profile' component={EditProfile} />
              <PrivateRoute exact path='/add-experience' component={AddExperience} />
              <PrivateRoute exact path='/add-education' component={AddEducation} />
              <PrivateRoute exact path='/posts' component={Posts} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;