import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { updateProfile, readProfile } from '../actions/profile';
import { MixPanel } from './MixPanel';

const styles = theme => ({
  profile: {
    justifyContent: "center",
    flexDirection: "column",
    display: "flex",
    alignItems:'center',
  },
  avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  button: {
      margin: theme.spacing(2),
  },
  typo: {
    margin: theme.spacing(10, 0, 0),
  },
  wrapper: {
    margin: theme.spacing(5, 0, 3),
    position: 'relative',
  },
  form: {
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
});

class Profile extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          file: this.props.urlAvatar,
          username: this.props.username,
          hasError: false,
          error: null,
          updateSuccessful: false,
        }
    }
    componentDidMount() {
        this.props.read({
            accessToken: this.props.accessToken,
            userSub: this.props.userid
        });
    }
    handleAvatarChange = (event) => {
        this.setState({
          file: URL.createObjectURL(event.target.files[0])
        })
    }
    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
          [name]: value
        });
    }
    handleSubmit = (event) => {
        this.setState({error: null})
        event.preventDefault();
        // API call to register
        this.props.update({
            'username': this.state.username,
            'file': this.uploadInput.files[0],
            'accessToken': this.props.accessToken,
            'userSub': this.props.userid
        })
        .then(res => {
          if (!this.props.isUpdated) {
            this.setState({hasError: true});
            MixPanel.track('Error Update Profile');
          }
          else {
              this.setState({updateSuccessful: true});
              MixPanel.track('Update Profile', {
                  $name: this.state.username,
                  $avatar: this.uploadInput.files[0],
              });
          }
        })
    }
    render(){
        const { classes } = this.props;
        const buttonClassname = clsx({[classes.buttonSuccess]: this.state.updateSuccessful});
        return (
            <div>
             <AppBar position="static">
                 <h2> Profile </h2>
            </AppBar>
                <Container className={classes.profile}>
                    <form className={classes.form} noValidate>
                      <Grid container spacing={2}>
                          <Grid item xs={12}>
                          <IconButton
                              variant="contained"
                              component="label"
                              color="inherit"
                              className={classes.button}
                          >
                              <input
                                   accept="image/*"
                                   style={{ display: "none" }}
                                   type="file"
                                   onChange={this.handleAvatarChange}
                                   ref={(ref) => { this.uploadInput = ref; }}
                              />
                              <Avatar
                                alt={this.state.username.toUpperCase()}
                                src={this.state.file}
                                aria-label="open account menu"
                                className={classes.avatar}
                              >
                            </Avatar>
                          </IconButton>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              autoComplete="uname"
                              error={this.state.username === ''}
                              name="username"
                              variant="outlined"
                              required
                              fullWidth
                              id="username"
                              label="Username"
                              autoFocus
                              value={this.state.username}
                              onChange={this.handleInputChange}
                              helperText={this.state.username === '' ? "Username is required.": ""}
                            />
                          </Grid>
                    </Grid>
                    <div className={classes.wrapper}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={this.props.isFetching || this.state.username === ''}
                          className={buttonClassname}
                          onClick={this.handleSubmit}
                        >
                          Save
                        </Button>
                        {this.props.isFetching && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                 </form>
               </Container>
           </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
  return {
    update: profileInfo => dispatch(updateProfile(profileInfo)),
    read: userInfo => dispatch(readProfile(userInfo))
  };
}

const mapStateToProps = state => {
  return {
      username: state.profile.username !== undefined ? state.profile.username: "",
      userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
      accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
      isFetching: state.profile.isFetching,
      urlAvatar: state.profile.urlAvatar !== null ? state.profile.urlAvatar: "",
      isUpdated: state.profile.isUpdated
   }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Profile)));
