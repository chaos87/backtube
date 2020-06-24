import React, { Component } from "react";
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { confirmUser, resendConfirmationCode } from '../actions/register';
import { withLastLocation } from 'react-router-last-location';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  title: {
      marginBottom: theme.spacing(3),
  },
  subtitle: {
      margin: theme.spacing(1),
  },
  wrapper: {
    margin: theme.spacing(8, 0, 3),
    position: 'relative',
  },
  wrapperResend: {
    position: 'relative',
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

class ConfirmRegistration extends Component {
    constructor(props) {
        super(props)
        this.state = {
          code : '',
          hasError: false
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.confirm(this.props.reg.username, this.state.code)
        .then(res => {
          if (!this.props.reg.isConfirmed) {
              this.setState({'hasError': true});
          }
        })
    };

    handleResend = (event) => {
        event.preventDefault();
        this.props.resend(this.props.reg.username)
        .then(res => {
          if (!this.props.reg.isResent) {
              this.setState({'hasError': true});
          }
        })
    };

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
          [name]: value
        });
    }

    render(){
     const { classes } = this.props
     const buttonSubmitClassname = clsx({[classes.buttonSuccess]: this.props.reg.isConfirmed});
     const buttonResendClassname = clsx({[classes.buttonSuccess]: this.props.reg.isResent});
     const alertErrorClassname = clsx({[classes.alert]: !this.state.hasError});
     const alertSuccessClassname = clsx({[classes.alert]: !this.props.reg.isConfirmed});
     return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" className={classes.title}>
              Confirm Registration
            </Typography>
            <Typography component="h1" variant="subtitle1" align="justify" className={classes.subtitle}>
              A verification code has been sent to your email address.
              Please input it below.
            </Typography>
            <Alert severity="error" className={alertErrorClassname}>{this.props.reg.error}</Alert>
            <Alert severity="success" className={alertSuccessClassname}>Congratulations! Your account is verified.
                Please note you have to sign in if you want to access your account.</Alert>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="code"
                label="Verification Code"
                id="code"
                onChange={this.handleInputChange}
              />
              <div className={classes.wrapper}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={this.props.reg.isConfirmFetching}
                    className={buttonSubmitClassname}
                    onClick={this.handleSubmit}
                  >
                    Confirm
                  </Button>
                  {this.props.reg.isConfirmFetching && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
              </form>
              <div className={classes.wrapperResend}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="default"
                    disabled={this.props.reg.isResendFetching}
                    className={buttonResendClassname}
                    onClick={this.handleResend}
                  >
                    Resend confirmation code
                  </Button>
                  {this.props.reg.isResendFetching && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>

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
    confirm: (username, code) => dispatch(confirmUser(username, code)),
    resend: username => dispatch(resendConfirmationCode(username)),
  };
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ConfirmRegistration))));
