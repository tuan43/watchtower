import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';

class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem('token');
    this.props.history.push('/');
  }

  render() {
    return <CircularProgress />
  }
}

Logout.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(Logout);
