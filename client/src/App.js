import React, { Fragment, useEffect } from 'react';
import './App.css';

import Landing from './components/layout/Landing';
import { loadAccount } from './actions/Auth';
import Navbar from './components/layout/Navbar';
import Routes from './components/routing/Routes';
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
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;