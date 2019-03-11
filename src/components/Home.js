import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Nav from './Nav';
import styles from './HomeStyles';

class Home extends Component {
  constructor() {
    super();
    this.state = { authKey: null };
  }

  componentDidMount() {
    fetch('/api/authenticated', {
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(res => res.json())
      .then(res => this.setState({ authKey: res.authKey }))
      .catch(console.error);
  }

  render() {
    return (
      <>
        <Nav />
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='center'
        >
          {this.state.authKey}
        </Grid>
      </>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
