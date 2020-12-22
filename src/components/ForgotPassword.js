import React, { Component } from "react";
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import { withRouter } from "react-router-dom";
import { sendForgotPasswordEmail } from '../actions/reset';
import { MixPanel } from './MixPanel';

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

class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
          email : '',
          hasError: false,
          emailSentSuccessful: false
        };
    }

    componentDidMount() {
        MixPanel.track('View Forgot Password');
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.forgotPassword(this.state.email).then(res => {
            if (this.props.reset.isEmailSent) {
                this.setState({ emailSentSuccessful: true });
                setTimeout(function () { this.props.history.push('/resetPassword'); }.bind(this), 1000);
            } else {
                this.setState({ hasError: true })
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
     const buttonSubmitClassname = clsx({[classes.buttonSuccess]: this.state.emailSentSuccessful});
     return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <VpnKeyIcon />
            </Avatar>
            <Typography component="h1" variant="h5" className={classes.title}>
              Forgot Password?
            </Typography>
            <Typography component="h1" variant="subtitle1" align="justify" className={classes.subtitle}>
             Input your email address and hit the button to receive an email containing a confirmation code.
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                error={this.state.hasError}
                variant="outlined"
                required
                fullWidth
                name="email"
                label="email"
                id="email"
                onChange={this.handleInputChange}
              />
              <div className={classes.wrapper}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={this.props.reset.isForgotFetching}
                    className={buttonSubmitClassname}
                    onClick={this.handleSubmit}
                  >
                    CONTINUE
                  </Button>
                  {this.props.reset.isForgotFetching && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
              </form>
          </div>
        </Container>
      );
  }
}

function mapStateToProps(state, props) {
  return {
    reset: state.reset
  };
}

function mapDispatchToProps(dispatch) {
  return {
    forgotPassword: email => dispatch(sendForgotPasswordEmail(email)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ForgotPassword)));
