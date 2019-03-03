import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import SignIn from './SignIn';
import Home from './Home';
import Logout from './Logout';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    localStorage.getItem('token')
      ? <Component {...props} />
      : <Redirect to='/' />
    )} 
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.object.isRequired
};

const App = () => (
  <>
    <Route exact path='/' component={SignIn} />
    <Route path='/login' component={SignIn} />
    <Route path='/logout' component={Logout} />
    <PrivateRoute path='/home' component={Home} />
  </>
);

export default App;
