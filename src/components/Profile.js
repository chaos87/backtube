import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import moment from 'moment';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { updateProfile, readProfile, getCurrentProfile } from '../actions/profile';
import { hitApi } from '../actions/helloWorld';
import { MixPanel } from './MixPanel';
import { withLastLocation } from 'react-router-last-location';
import GridPlaylists from "./GridPlaylists";
import GridThemes from "./GridThemes";

const styles = theme => ({
    bar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        top: theme.spacing(8),
        [theme.breakpoints.only('sm')]: {
            top: theme.spacing(9),
        },
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
    marginBottom: theme.spacing(3),
  },
  icon : {
      margin: theme.spacing(2),
  },
  iconHistory : {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginRight: theme.spacing(4),
  },
  arrow: {
      marginLeft: theme.spacing(1),
      color: 'white'
  },
  editIcon: {
      marginTop: theme.spacing(4),
      backgroundColor: 'white',
  },
  container: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4)
  },
  box: {
      height: '75vh',
      display: 'flex',
      justifyContent:'center',
      alignItems:'center'
  },
  userNameEdit: {
      [theme.breakpoints.only('xs')]: {
          width: 300,
      },
      [theme.breakpoints.only('sm')]: {
          width: 400,
      },
      [theme.breakpoints.up('md')]: {
          width: 600,
      },
  },
  fabProgress: {
      color: 'secondary',
      position: 'absolute',
      zIndex: 1,
  },
});

class Profile extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          file: '',
          username: '',
          themes: [],
          playlists: [],
          joined: '',
          hasError: false,
          error: null,
          updateSuccessful: false,
          editing: false,
        }
    }

    componentDidMount() {
        if (this.props.isLoggedIn && this.props.accessToken !== null) {
            const token = this.props.accessToken
            this.props.hitApi(token)
        }

        this.fetchProfile();
    }

    fetchProfile = async () => {
        await this.props.getCurrentProfile({
            userSub: this.props.match.params.id,
        }).then(res => {
            this.setState({
                file: this.props.profile.avatar,
                username: this.props.profile.username,
                joined: this.props.profile.createdAt,
                themes: this.props.profile.themesCreated,
                playlists: this.props.profile.playlistsOwned,
            })
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

    toggleEditing = async () => {
        await this.setState({ editing: !this.state.editing, error: null })
        if (!this.state.editing){
            let avatar = this.uploadInput.files.length > 0 ? this.uploadInput.files[0] : this.state.file;
            await this.props.update({
                'username': this.state.username,
                'file': avatar,
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
                      $avatar: avatar,
                  });
              }
            })
        await this.props.getCurrentProfile({
            userSub: this.props.match.params.id,
        }).then(res => {
            this.setState({
                file: this.props.profile.avatar,
                username: this.props.profile.username,
                joined: this.props.profile.createdAt,
                themes: this.props.profile.themesCreated,
                playlists: this.props.profile.playlistsOwned,
            })
        });
        this.props.read({
            'accessToken': this.props.accessToken,
            'userSub': this.props.userid
        })
      }
    }

    handleGoBack = () => {
        this.props.history.goBack();
    }

    render(){
        const { classes } = this.props;
        return (
            <div>
                <AppBar className={classes.bar} position="sticky">
                    <Grid
                        justify={this.props.lastLocation ? "space-between" : "center"}
                        alignItems="center"
                        container
                      >
                    {this.props.lastLocation &&
                            <IconButton
                                edge="start"
                                onClick={() => this.handleGoBack()}
                                className={classes.arrow}
                            >
                                <ArrowBackIcon/>
                            </IconButton>
                        }
                            <PersonIcon fontSize="large" className={this.props.lastLocation ? classes.iconHistory : classes.icon}/>
                    {this.props.lastLocation && <ArrowBackIcon visibility="hidden"/>}
                    </Grid>
                </AppBar>
                {!this.props.isFetching && <Container maxWidth='md' className={classes.profile}>
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
                                   disabled={!this.state.editing}
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
                            {this.state.editing ? <TextField
                              autoComplete="uname"
                              error={this.state.username === ''}
                              name="username"
                              variant="outlined"
                              required
                              fullWidth
                              id="username"
                              label="Username"
                              autoFocus
                              inputProps={{ maxLength: 100 }}
                              value={this.state.username}
                              onChange={this.handleInputChange}
                              helperText={this.state.username === '' ? "Username is required.": ""}
                              className={classes.userNameEdit}
                          /> : <Typography variant="h6">
                                {this.state.username}
                            </Typography>}
                          </Grid>
                          <Grid item xs={12}>
                              <Typography variant="subtitle2">
                                joined on {moment(this.state.joined).format("ll")}
                              </Typography>
                          </Grid>
                    </Grid>
                    {this.props.isLoggedIn && this.props.userid === this.props.match.params.id &&
                        <Fab
                            aria-label="edit"
                            className={classes.editIcon}
                            onClick={this.toggleEditing}
                            disabled={this.props.isSaving}
                        >
                            {this.state.editing ? <DoneIcon />: <EditIcon />}
                            {this.props.isSaving &&
                                <CircularProgress color="secondary" size={68} className={classes.fabProgress} />}
                        </Fab>
                    }
                 </form>
                 <Box p={3}>
                       <GridThemes
                           themeLists={{'Themes': this.state.themes}}
                           loading={this.props.loading}
                           row={true}
                           loadThemeOnClick={true}
                         />
                 </Box>
                 <Box p={3}>
                       <GridPlaylists
                           playlistLists={{'Playlists': this.state.playlists}}
                           loading={this.props.loading}
                           source="backtube"
                           row={true}
                         />
                 </Box>
             </Container>}
             {this.props.isFetching &&
                 <Container className={classes.box}>
                     <CircularProgress color="secondary" />
                 </Container>}
           </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
  return {
    update: profileInfo => dispatch(updateProfile(profileInfo)),
    read: userInfo => dispatch(readProfile(userInfo)),
    getCurrentProfile: userInfo => dispatch(getCurrentProfile(userInfo)),
    hitApi: token => dispatch(hitApi(token)),
  };
}

const mapStateToProps = state => {
  return {
      profile: state.profile.profileCurrent !== null ? state.profile.profileCurrent : {username: "", avatar: "/broken-image.jpg"},
      userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
      accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
      isFetching: state.profile.isFetching,
      isUpdated: state.profile.isUpdated,
      isLoggedIn: state.auth.isLoggedIn,
      isSaving: state.profile.isSaving,
      error: state.profile.error
   }
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Profile))));
