import React from 'react';
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

const App = () => (
  <>
    <Route exact path='/' component={SignIn} />
    <PrivateRoute path='/home' component={Home} />
    <Route path='/logout' component={Logout} />
  </>
);

export default App;
