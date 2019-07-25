import React, { Fragment, useEffect } from 'react';
import './App.css';

import Alert from './components/layout/Alert';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import { loadAccount } from './actions/Auth';
import Navbar from './components/layout/Navbar';
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
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;