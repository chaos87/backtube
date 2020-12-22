import React, { Component } from "react";
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from "react-router-dom";
import { ModalLink } from "react-router-modal-gallery";
import { connect } from 'react-redux';
import { loginUser } from '../actions/auth';
import { readProfile } from '../actions/profile';
import { withLastLocation } from 'react-router-last-location';
import { MixPanel } from './MixPanel';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
      marginBottom: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  wrapper: {
    margin: theme.spacing(3, 0, 3),
    position: 'relative',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  alert: {
    visibility: 'hidden'
  }
});

class SignIn extends Component {

  constructor(props) {
      super(props)
      this.state = {
        email : '',
        password: '',
        hasError: false
      };
  }

  handleInputChange = (event) => {
      const { value, name } = event.target;
      this.setState({
        [name]: value
      });
  }

  handleSubmit = (event) => {
      event.preventDefault();
      this.props.login(this.state.email, this.state.password)
      .then(res => {
        if (this.props.auth.isLoggedIn) {
            this.props.read({
                accessToken: this.props.auth.session.accessToken.jwtToken,
                userSub: this.props.auth.session.accessToken.payload.sub
            });
            MixPanel.identify(this.props.auth.session.accessToken.payload.sub);
            MixPanel.people.set({
                $name: this.props.username,
                $email: this.state.email,
                $distinct_id: this.props.auth.session.accessToken.payload.sub
            });
            MixPanel.track('Sign In');
            let location = this.props.lastLocation.pathname === '/login' ? '/' : this.props.lastLocation.pathname
            setTimeout(function () { this.props.history.push(location); }.bind(this), 1000);
        } else {
            this.setState({'hasError': true});
            MixPanel.track('Error Sign In');
            if (this.props.auth.error === "User is not confirmed.") {
                setTimeout(function () { this.props.history.push('/confirm'); }.bind(this), 1000);

            }
        }
    })
  };

  render(){
      const { classes } = this.props;
      const buttonClassname = clsx({[classes.buttonSuccess]: this.props.auth.isLoggedIn});
      const alertClassname = clsx({[classes.alert]: !this.state.hasError});
      return(
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography className={classes.title} component="h1" variant="h5">
                  Sign in
                </Typography>
                <Alert severity="error" className={alertClassname}>{this.props.auth.error}</Alert>
                <form className={classes.form} noValidate>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={this.handleInputChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={this.handleInputChange}
                  />
                  <div className={classes.wrapper}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={this.props.auth.isFetching}
                        className={buttonClassname}
                        onClick={this.handleSubmit}
                      >
                        Sign In
                      </Button>
                      {this.props.auth.isFetching && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </div>
                  <Grid container>
                    <Grid item xs>
                      <ModalLink to='/forgotPassword'>
                        {"Forgot password?"}
                      </ModalLink>
                    </Grid>
                    <Grid item>
                      <ModalLink to='/register'>
                        {"Don't have an account? Sign Up"}
                    </ModalLink>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Container>
        );
  }
}

function mapStateToProps(state, props) {
  return {
    auth: state.auth,
    username: state.profile.username !== undefined ? state.profile.username: "",
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (username, password) => dispatch(loginUser(username, password)),
    read: userInfo => dispatch(readProfile(userInfo))
  };
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SignIn))));
