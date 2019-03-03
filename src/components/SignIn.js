import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import moment from 'moment';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import styles from './SignInStyles';

class SignIn extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      token: ''
    };
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      const expiration = localStorage.getItem('expiration');
      if (moment().isBefore(expiration)) {
        this.props.history.push('/home');
      }
    }
  }

  auth(e) {
    e.preventDefault();

    const { history } = this.props;

    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.ok) {
        return res;
      } else {
        throw new Error(`Request rejected with status ${res.status}`);
      }
    }).then(res => res.json())
      .then(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('expiration', res.expiration);

        history.push('/home');
      })
      .catch(console.error);

    this.setState({ 
      username: '',
      password: '',
      token: ''
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Watch Tower
          </Typography>
          <form className={classes.form} onSubmit={this.auth.bind(this)}>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='username'>Username</InputLabel>
              <Input 
                id='username' 
                name='username' 
                autoComplete='username'
                onChange={(e) => this.setState({ username: e.target.value })}
                value={this.state.username}
                autoFocus
              />
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='password'>Password</InputLabel>
              <Input 
                name='password'
                type='password'
                id='password'
                autoComplete='current-password'
                onChange={(e) => this.setState({ password: e.target.value })}
                value={this.state.password}
              />
            </FormControl>
            <FormControl margin='normal' required fullWidth>
              <InputLabel htmlFor='token'>Token</InputLabel>
              <Input
                name='token'
                id='token'
                onChange={(e) => this.setState({ token: e.target.value })}
                value={this.state.token}
              />
            </FormControl>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(SignIn));