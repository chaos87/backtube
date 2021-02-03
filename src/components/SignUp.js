import React, { Component } from "react";
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from "react-router-dom";
import { ModalLink } from "react-router-modal-gallery";
import { connect } from 'react-redux';
import { registerUser } from '../actions/register';
import { refreshAuthToken } from '../actions/auth';
import { readProfile, createProfile } from '../actions/profile';
import { delay } from '../services/utils';
import { MixPanel } from './MixPanel';
import GoogleButton from 'react-google-button';
import { getSearchParam } from '../services/url';
import { cognitoURL } from '../config/urls';
import { parseJwt } from "../services/utils"

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(2),
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
    marginTop: theme.spacing(3),
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
  },
  buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing(4)
  },
  important: {
      marginTop: theme.spacing(1),
      color: 'red'
  }
});

class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
          email: '',
          password: '',
          hasError: false,
          passwordMatch: true,
          signUpSuccessful: false
        };
    }

    componentDidMount() {
        MixPanel.track('View Sign Up');
        if (this.props.reg.isRegistered && !this.props.reg.isConfirmed) {
            setTimeout(function () { this.props.history.push('/confirm'); }.bind(this), 1000);
        }
        const code = getSearchParam(this.props.location, 'code');
        if (code) {
            this.handlePostGoogleSignUp(code);
        }
    }

    handlePostGoogleSignUp = async (code) => {
        const payload = {
            "grant_type": "authorization_code",
            "client_id": "13jgajqggg04mq38g14iv6lba5",
            "redirect_uri": "https://backtube.app/register",
            "code": code
        }
        const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&')
        let response = await fetch(cognitoURL + '/oauth2/token', {
          method: 'POST',
          body: formBody,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(res => {
            return res.json();
        })
        .catch(err => {
            return err;
        })
        const username = parseJwt(response['access_token'])['username']
        const sub = parseJwt(response['access_token'])['sub']
        const email = parseJwt(response['id_token'])['email']
        await this.props.refreshToken(username, response['refresh_token']).then(res => {
            this.props.createProfile({
                id: sub,
                username: username,
                accessToken: this.props.auth.session.accessToken.jwtToken,
            })
        })
        await this.props.read({
            accessToken: this.props.auth.session.accessToken.jwtToken,
            userSub: sub
        });
        MixPanel.identify(sub);
        MixPanel.people.set({
            $name: username,
            $email: email,
            $distinct_id: sub
        });
        MixPanel.track('Sign Up');
        this.props.history.push('/');
    }

    handleSubmit = (event) => {
        this.setState({error: null})
        event.preventDefault();
        // API call to register
        let registerDate = new Date().toISOString();
        this.props.register({
            'username': 'user_' + Date.now().toString(),
            'email': this.state.email,
            'password': this.state.password,
            'confirmPassword': this.state.confirmPassword
        })
        .then(res => {
          if (this.props.reg.isRegistered) {
              MixPanel.alias(this.props.reg.userSub);
              MixPanel.people.set({
                  $name: this.props.reg.username,
                  $email: this.state.email,
                  $distinct_id: this.props.reg.userSub,
                  $created: registerDate,
                  'Is Confirmed': false,
              });
              MixPanel.track('Sign Up');
              this.setState({signUpSuccessful: true});
              setTimeout(function () { this.props.history.push('/confirm'); }.bind(this), 1000);
          } else {
            MixPanel.track('Error Sign Up');
            this.setState({hasError: true});
          }
        })
    };

    handleInputChange = async (event) => {
        const { value, name } = event.target;
        this.setState({
          [name]: value,
        });
        delay(100).then(res => {
            let response = this.handleCheckPassword(this.state.password, this.state.confirmPassword);
            this.setState({
              passwordMatch: response,
            });
        });
    }

    handleCheckPassword = (password, confirmPassword) => {
        if (!password && !confirmPassword) {
            return true;
        }
        return password === confirmPassword ? true: false;
    }

    handleGoogleSubmit = async (event) => {
        event.preventDefault();
        window.location.assign(cognitoURL + '/oauth2/authorize?redirect_uri=https://backtube.app/register&response_type=code&client_id=13jgajqggg04mq38g14iv6lba5&identity_provider=Google');
    };

    render(){
     const { classes } = this.props;
     const buttonClassname = clsx({[classes.buttonSuccess]: this.state.signUpSuccessful});
     const alertClassname = clsx({[classes.alert]: !this.state.hasError});
     return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography className={classes.title} component="h1" variant="h5">
                Sign up
              </Typography>
              <Alert severity="error" className={alertClassname}>{this.props.reg.error}</Alert>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    inputProps={{ maxLength: 160 }}
                    autoComplete="email"
                    onChange={this.handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!this.state.passwordMatch}
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    inputProps={{ maxLength: 160 }}
                    autoComplete="current-password"
                    onChange={this.handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!this.state.passwordMatch}
                    variant="outlined"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="current-password"
                    inputProps={{ maxLength: 160 }}
                    onChange={this.handleInputChange}
                    helperText={this.state.passwordMatch ? "": "Passwords don't match."}
                  />
                </Grid>
              </Grid>
              <div className={classes.wrapper}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={this.props.reg.isFetching || !this.state.passwordMatch}
                    className={buttonClassname}
                    onClick={this.handleSubmit}
                  >
                    Sign Up
                  </Button>
                  {this.props.reg.isFetching && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
              <div className={classes.buttonContainer}>
                <GoogleButton
                    label='Sign Up With Google'
                    onClick={this.handleGoogleSubmit}
                  />
                  <Typography className={classes.important} component="h1" variant="caption">
                    (If you already signed up with email/password method, this will create an extra user. Merge is not possible.)
                  </Typography>
              </div>
              <Grid container justify="flex-end">
                <Grid item>
                    <ModalLink to='/login'>
                      {"Already have an account? Sign in"}
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
    reg: state.register,
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    register: (userInfo) => dispatch(registerUser(userInfo)),
    refreshToken: (username, token) => dispatch(refreshAuthToken(username, token)),
    read: userInfo => dispatch(readProfile(userInfo)),
    createProfile: userInfo => dispatch(createProfile(userInfo)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SignUp)));
