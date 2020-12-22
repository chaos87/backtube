import React, { Component } from "react";
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import SaveIcon from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { getPlaylistsIdAndTitle, updatePlaylist, createPlaylist } from '../actions/playlist';
import { withLastLocation } from 'react-router-last-location';
import { MixPanel } from './MixPanel';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paperTab: {
      marginTop: theme.spacing(2),
      background: '#e6e6e6',
      borderRadius: 3,
      border: 0,
      color: 'white',
      height: 48,
      padding: '0 30px',
      boxShadow: '0 3px 5px 2px rgba(230, 230, 230, .3)',
  },
  title: {
      marginBottom: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  wrapper: {
    margin: theme.spacing(6, 0, 3),
    position: 'relative',
  },
  formSelect: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    fullWidth: true,
    wrap: 'nowrap',
    minWidth: 220,
  },
  formText: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    fullWidth: true,
    wrap: 'nowrap',
    minWidth: 220,
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
  updateTitleDiv: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent:'center',
      alignItems: 'center',
      marginTop: theme.spacing(2)
  }

});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

class SavePlaylist extends Component {

  constructor(props) {
      super(props)
      this.state = {
        title : '',
        updateTitle: '',
        playlistId: null,
        value: 0,
        hasError: false,
        checked: false
      };
  }

  componentDidMount() {
      if (this.props.accessToken){
          this.fetchPlaylists();
      } else {
          this.props.history.push('/login');
      }
  }

  fetchPlaylists = async () => {
      await this.props.getPlaylistsIdAndTitle({
          accessToken: this.props.accessToken,
          userSub: this.props.userid
      });
      if (this.props.playlists.length !== 0) {
          this.setState({
              playlistId: this.props.playlists[0]["_id"],
              updateTitle: this.props.playlists.filter(playlist => playlist._id === this.props.playlists[0]["_id"])[0].title
          })
      }
  }

  handleChange = (event, newValue) => {
      this.setState({ value: newValue})
  }

  handleTitleChange = (event) => {
      this.setState({
          title: event.target.value
      })
  }

  handleUpdateTitleChange = (event) => {
      this.setState({
          updateTitle: event.target.value
      })
  }

  handleDropdownChange = (event) => {
    this.setState({
        playlistId: event.target.value,
        updateTitle: this.props.playlists.filter(playlist => playlist._id === event.target.value)[0].title
    });
  };

  handleCheckChange = (event) => {
      this.setState({
          checked: !this.state.checked
      })
  }

  handleSubmit = (event) => {
      event.preventDefault();
      if (this.state.value === 0){
          // new playlist
          if (this.state.title === '') {
              this.setState({hasError: true})
              return;
          }
          this.props.createPlaylist({
              accessToken: this.props.accessToken,
              title: this.state.title,
              playlist: this.props.playerList
          })
          .then(res => {
              let playlistDate = new Date().toISOString();
              if (this.props.isSaved) {
                  console.log('Playlist created!')
                  MixPanel.track('Create Playlist', {
                      'Playlist Title': this.state.title,
                      'Playlist ID': res._id,
                      'Playlist Tracks': this.props.playerList
                  });
                  MixPanel.people.set({
                      'Last Playlist Create': playlistDate
                  });
                  MixPanel.people.set_once({
                      'First Playlist Create': playlistDate
                  });
                  MixPanel.people.increment('Total Playlist Create');
                  setTimeout(function () { this.props.history.push(this.props.lastLocation.pathname); }.bind(this), 1000);
              }
          })
      } else {
          // replace
          this.props.updatePlaylist({
              accessToken: this.props.accessToken,
              id: this.state.playlistId,
              title:  this.state.updateTitle,
              playlist: this.props.playerList
          })
          .then(res => {
              if (this.props.isSaved) {
                  MixPanel.track('Update Playlist', {
                      'Playlist Title': this.state.updateTitle,
                      'Playlist ID': res._id,
                      'Playlist Tracks': this.props.playerList
                  });
                  setTimeout(function () { this.props.history.push(this.props.lastLocation.pathname); }.bind(this), 1000);
              }

          })
      }
  };

  render(){
      const { classes } = this.props;
      const buttonClassname = clsx({[classes.buttonSuccess]: this.props.isSaved});
      return(
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <SaveIcon />
                </Avatar>
                <Typography className={classes.title} component="h1" variant="h5">
                  Save playlist
                </Typography>
                <Paper square className={classes.paperTab}>
                  <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="icon label tabs example"
                  >
                    <Tab label="As new" {...a11yProps(0)} />
                    <Tab label="Replace" {...a11yProps(1)} />
                  </Tabs>
                </Paper>
                <TabPanel value={this.state.value} index={0}>
                    <form className={classes.formText} noValidate>
                      <TextField
                        error={this.state.hasError}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Playlist name"
                        name="title"
                        autoComplete="title"
                        autoFocus
                        onChange={this.handleTitleChange}
                      />

                      <div className={classes.wrapper}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={this.props.loading}
                            className={buttonClassname}
                            onClick={this.handleSubmit}
                          >
                            Save
                          </Button>
                          {this.props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                      </div>
                    </form>
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <FormControl variant="outlined" className={classes.formSelect}>
                      <InputLabel htmlFor="outlined-age-native-simple">Playlist name</InputLabel>
                      <Select
                        value={this.state.playlistId}
                        onChange={this.handleDropdownChange}
                        label="Playlist name"
                      >
                        {this.props.playlists.map(playlist => (
                            <MenuItem key={playlist._id} value={playlist._id}>{playlist.title}</MenuItem>
                        ))}
                      </Select>
                      <div className={classes.updateTitleDiv}>
                          <Checkbox
                            checked={this.state.checked}
                            onChange={this.handleCheckChange}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                          />
                          <TextField
                            error={this.state.hasError}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="Change playlist name"
                            name="title"
                            autoComplete="title"
                            autoFocus
                            value={this.state.updateTitle}
                            onChange={this.handleUpdateTitleChange}
                            disabled={!this.state.checked}
                          />
                      </div>
                      <div className={classes.wrapper}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={this.props.loading}
                            className={buttonClassname}
                            onClick={this.handleSubmit}
                          >
                            Save
                          </Button>
                          {this.props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                      </div>
                    </FormControl>

                </TabPanel>
              </div>
            </Container>
        );
  }
}

function mapStateToProps(state, props) {
  return {
      playlists: state.playlist.playlistsOwnedIdTitle ? state.playlist.playlistsOwnedIdTitle: [],
      isSaved: state.playlist.isSaved,
      loading: state.playlist.isSaving,
      userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
      accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
      playerList: state.player.audioLists
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPlaylistsIdAndTitle: (userInfo) => dispatch(getPlaylistsIdAndTitle(userInfo)),
    updatePlaylist: (id, playlist) => dispatch(updatePlaylist(id, playlist)),
    createPlaylist: (title, playlist) => dispatch(createPlaylist(title, playlist)),
  };
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(SavePlaylist))));
