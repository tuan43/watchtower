import React, { Component } from 'react';
import { withRouter } from "react-router";
import CircularProgress from '@material-ui/core/CircularProgress';

class Logout extends Component {
  componentDidMount() {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  render() {
    return <CircularProgress />
  }
}

export default withRouter(Logout);