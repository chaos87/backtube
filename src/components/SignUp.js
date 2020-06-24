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
import { delay } from '../services/utils';

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

    handleSubmit = (event) => {
        this.setState({error: null})
        event.preventDefault();
        // API call to register
        this.props.register({
            'username': 'user_' + Date.now().toString(),
            'email': this.state.email,
            'password': this.state.password,
            'confirmPassword': this.state.confirmPassword
        })
        .then(res => {
          if (this.props.reg.isRegistered) {
              this.setState({signUpSuccessful: true});
              setTimeout(function () { this.props.history.push('/confirm'); }.bind(this), 1000);
          } else {
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
    reg: state.register
  };
}

function mapDispatchToProps(dispatch) {
  return {
    register: (userInfo) => dispatch(registerUser(userInfo))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SignUp)));
