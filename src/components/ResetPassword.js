import React, { Component } from "react";
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { resetUserPassword } from '../actions/reset';
import { delay } from '../services/utils';
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

class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
          code: '',
          password: '',
          hasError: false,
          passwordMatch: true,
          resetSuccessful: false
        };
    }

    componentDidMount() {
        MixPanel.track('View Reset Password');
    }

    handleSubmit = (event) => {
        this.setState({error: null})
        event.preventDefault();
        // API call to register
        this.props.resetPassword({
            'username': this.props.reset.email,
            'code': this.state.code,
            'password': this.state.password
        })
        .then(res => {
          if (this.props.reset.isPasswordReset) {
              this.setState({ resetSuccessful: true });
              MixPanel.track('Confirm Reset Password');
          } else {
            this.setState({ hasError: true });
             MixPanel.track('Error Confirm Reset Password');
            console.log(res)
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
     const buttonClassname = clsx({[classes.buttonSuccess]: this.state.resetSuccessful});
     const alertErrorClassname = clsx({[classes.alert]: !this.state.hasError});
     const alertSuccessClassname = clsx({[classes.alert]: !this.state.resetSuccessful});
     return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <VpnKeyIcon />
              </Avatar>
              <Typography className={classes.title} component="h1" variant="h5">
                Reset Password
              </Typography>
              <Alert severity="error" className={alertErrorClassname}>{this.props.reset.error}</Alert>
              <Alert severity="success" className={alertSuccessClassname}>Your password has been successfully reset.</Alert>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="code"
                    label="Confirmation code"
                    name="code"
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
                    disabled={this.props.reset.isResetFetching || !this.state.passwordMatch}
                    className={buttonClassname}
                    onClick={this.handleSubmit}
                  >
                    Reset
                  </Button>
                  {this.props.reset.isResetFetching && <CircularProgress size={24} className={classes.buttonProgress} />}
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
    resetPassword: (userInfo) => dispatch(resetUserPassword(userInfo))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ResetPassword)));
