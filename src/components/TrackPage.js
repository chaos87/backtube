import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import IconButton from '@material-ui/core/IconButton';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import QueueIcon from '@material-ui/icons/Queue';
import List from '@material-ui/core/List';
import Fade from '@material-ui/core/Fade';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { hitApi } from '../actions/helloWorld';
import { queueSong, syncCurrentTrack, prepareAudioList } from '../actions/player';
import { disableCurrent, updatePlaylist, getPlaylists, mustReload } from '../actions/playlist';
import { withLastLocation } from 'react-router-last-location';
import { MixPanel } from './MixPanel';
import ModalVideo from 'react-modal-video';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import FlexiLink from "./FlexiLink";

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
  head: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent:'center',
      alignItems: 'center',
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
  },
  gridList: {
      width: 240
  },
  listItem: {
      display: 'flex',
      justify:'center',
      alignItems: 'center',
  },
  artist: {
      marginBottom: theme.spacing(2),
      color: theme.palette.primary.main
  },
  title: {
      paddingTop: theme.spacing(4),
      margin: theme.spacing(2),
      fontWeight: 'bold',
  },
  arrow: {
      marginLeft: theme.spacing(1),
      color: 'white'
  },
  icon: {
      margin: theme.spacing(2),
  },
  iconHistory : {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      marginRight: theme.spacing(4),
  },
  loopProgress: {
    color: theme.palette.secondary.main,
    marginLeft: theme.spacing(1.35),
    position: 'absolute',
    zIndex: 9,
  },
  nested: {
    paddingLeft: theme.spacing(2)
  },
  nestedButton: {
    display: 'flex',
    justifyContent: 'center'
  },
  playlistTitle: {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      overflow: "hidden",
      textOverflow: "ellipsis",
  },
  playlistTitleAdded: {
      color: theme.palette.primary.secondary,
      fontWeight: 'bold',
      overflow: "hidden",
      textOverflow: "ellipsis",
  },
  albumIcon: {
      fontSize: 60,
  },
  coverContainer: {
      height: 240,
      width: 240,
      display: 'flex',
      direction: 'column',
      justifyContent: 'center',
      alignItems: 'center',
  },
  button: {
      color: 'white',
      minWidth: 200,
      margin: theme.spacing(2)
  },
  titleLink: {
      textDecoration: 'none'
  },
});

class TrackPage extends Component {

  constructor(props) {
      super(props)
      this.state = {
        songRemoved : false,
        isModalOpen: false,
        modalVideoId: null,
        fade: false,
        songQueued: false,
        songAdded: false,
        addingSongToPlaylist: false,
        removingSong: false,
        open: false,
        playlistIdAddedTo: ''
      };
  }

  componentDidMount () {
      if (this.props.isLoggedIn && this.props.accessToken !== null) {
          const token = this.props.accessToken
          this.props.hitApi(token)
      }
      if (this.props.match.params.id === 'cannotShareUrl' && !this.props.location.track){
          this.props.history.push('/')
      }
      this.setState({ fade: true })
  }

  handleInputChange = (event) => {
      const { value, name } = event.target;
      this.setState({
        [name]: value
      });
  }

  handleOpenNested = () => {
      this.setState({
        open: !this.state.open
      });
  };

  handleRemoveTrack = async (track) => {
      this.setState({ removingSong: true });
      const newTracks = this.props.playlist.tracks.filter(el => el._id !== track._id);
      await this.props.updatePlaylist({
          accessToken: this.props.accessToken,
          id: this.props.playlist._id,
          title:  this.props.playlist.title,
          review: this.props.playlist.review,
          themes: this.props.playlist.themes.map(({ _id, title }) => ({ _id, title })),
          private: this.props.playlist.private,
          playlist: newTracks,
      }).then(res => {
            if (this.props.isSaved) {
                MixPanel.track('Update Playlist', {
                    'Playlist Title': this.props.playlist.title,
                    'Playlist ID': this.props.playlist._id,
                    'Playlist Tracks': newTracks,
                    'Playlist Private': this.props.playlist.private,
                    'Playlist Themes': this.props.playlist.themes.map(({ _id, title }) => ({ _id, title })),
                });
            }
        });
      await this.props.mustReload();
      await this.props.getPlaylists({
          accessToken: this.props.accessToken,
          userSub: this.props.userid
      })
      await this.props.syncCurrentTrack(Object.assign(track, {playlistId: ''}))
      await this.setState({ songRemoved: true, removingSong: false });
      setTimeout(function () { this.handleGoBack(); }.bind(this), 1000);

  }

  handleAddToQueue = async (track, source, cover, singer, album) => {
      const index = this.props.playlist.tracks.findIndex(x => x._id === track._id);
      await this.props.addToPlayer(track, source, cover, singer, album, index);
      this.setState({ songQueued: true })
  }

  handleAddToPlaylist = async (track, source, cover, singer, album, playlist) => {
      let formattedTrack;
      let origin;
      if (!('musicSrc' in track)){
          origin = 'search';
          formattedTrack = await prepareAudioList(track, source, cover, singer, album, playlist._id);
      } else {
          origin = 'playlist';
          formattedTrack = track;
      }
      await this.setState({ addingSongToPlaylist: true, playlistIdAddedTo: playlist._id})
      await this.props.updatePlaylist({
          accessToken: this.props.accessToken,
          id: playlist._id,
          title:  playlist.title,
          review: playlist.review,
          themes: playlist.themes.map(({ _id, title }) => ({ _id, title })),
          private: playlist.private,
          playlist: [...playlist.tracks, formattedTrack],
      });
      if (origin === 'playlist'){
          await this.props.mustReload();
      }
      await this.props.getPlaylists({
          accessToken: this.props.accessToken,
          userSub: this.props.userid
      })
      this.setState({ songAdded: true, addingSongToPlaylist: false, playlistIdAddedTo: '' })
  }

  handleWatchVideo = (id) => {
    this.setState({
        isModalOpen: true,
        modalVideoId: id
    })
  }

  handleGoBack = () => {
      if (!this.state.songRemoved){
          this.props.disableCurrent();
      }
      this.props.history.goBack();
  }

  render(){
      const { classes } = this.props;
      const track = 'track' in this.props.location ? this.props.location.track : null;
      const thumbnail = 'track' in this.props.location ? this.props.location.track.thumbnail : this.props.playlist.thumbnail;
      const videoId = 'track' in this.props.location && 'videoId' in this.props.location.track ?
        this.props.location.track.videoId : 'track' in this.props.location && 'musicSrc' in this.props.location.track ?
        this.props.location.track.musicSrc.split('&key')[0].split('=')[1] : null
      const title = 'track' in this.props.location ? this.props.location.track.title : '';
      const artist = 'track' in this.props.location ? this.props.location.track.artist : this.props.playlist.artist;
      const source = 'track' in this.props.location ? this.props.location.track.source : this.props.playlist.source;
      const creator = 'creator' in this.props.location ? this.props.location.creator : {_id: ''};
      const album = 'track' in this.props.location ? this.props.location.track.album : this.props.playlist.title;

      return(
          <div className={classes.root}>
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
                          <AudiotrackIcon fontSize="large" className={classes.icon}/>
                  {this.props.lastLocation && <ArrowBackIcon visibility="hidden"/>}
                  </Grid>
              </AppBar>
              <Fade in={this.state.fade}>
              <div>
              <Grid container className={classes.head}>
                  <Box boxShadow={3}>
                      {thumbnail ?
                      <GridList cellHeight={240} className={classes.gridList} cols={1}>
                           <GridListTile cols={1}>
                             <img src={thumbnail} alt={title} />
                           </GridListTile>
                      </GridList>
                      : <Box style={{backgroundColor: 'rgba(0, 0, 0, 0.1)'}} className={classes.coverContainer}>
                            <QueueMusicIcon color="primary" className={classes.albumIcon}/>
                        </Box>}
                  </Box>
                <Typography className={classes.title} component="h1" variant="h6">
                  {title}
                </Typography>
                <Typography className={classes.artist} component="h1" variant="h6">
                  {artist}
                </Typography>
            </Grid>
            <Container maxWidth="xs" className={classes.container}>
                <List>
                    <ListItem
                        button
                        key="Add to Queue"
                        onClick={() => this.handleAddToQueue(track, source, thumbnail, artist, album)}
                        disabled={this.props.queueLoading}
                    >
                      <ListItemIcon className={classes.icon}>
                          <QueueIcon color={this.state.songQueued ? "secondary" : "action"}/>
                      </ListItemIcon>
                      <ListItemText
                          primary={this.state.songQueued ? "Added to Queue" : "Add to Queue"}
                      />
                      {this.props.queueLoading && <CircularProgress size={36} className={classes.loopProgress} />}
                    </ListItem>
                    {this.props.isLoggedIn &&
                            <ListItem
                                button
                                key={"Add to Playlist"}
                                onClick={() => this.handleOpenNested()}
                            >
                              <ListItemIcon className={classes.icon}>
                                  <PlaylistAddIcon color={this.state.songAdded ? "secondary" : "action"}/>
                              </ListItemIcon>
                              <ListItemText primary={
                                  this.props.playlists.map(el => el._id).includes(this.props.playlist._id) ?
                                  "Add to other Playlist" : "Add to Playlist"
                              } />
                              {this.state.open ? <ExpandLess /> : <ExpandMore />}
                              {this.state.addingSongToPlaylist && <CircularProgress size={36} className={classes.loopProgress} />}
                          </ListItem>}
                          {this.props.isLoggedIn &&
                              <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem
                                      button
                                      className={classes.nestedButton}
                                      >
                                          <FlexiLink
                                              isLoggedIn={this.props.isLoggedIn}
                                              to={{
                                                 pathname: '/playlist/cannotShareUrl',
                                                 playlist: {
                                                     title: "Untitled playlist #" + (this.props.owned.length + 1),
                                                     creator: {username: this.props.profile.username, _id: this.props.userid, avatar: this.props.profile.avatar},
                                                     tracks: [track],
                                                     review: '',
                                                 },
                                                 source: 'owned',
                                                 editing: true,
                                             }}
                                             className={classes.titleLink}
                                              >
                                              <Fab
                                                variant="extended"
                                                color="secondary"
                                                className={classes.button}
                                              >
                                               <AddIcon /> Create Playlist
                                           </Fab>
                                       </FlexiLink>
                                  </ListItem>
                                    {this.props.playlists.filter(el => el._id !== this.props.playlist._id).map(elem => (
                                        <ListItem
                                          key={elem._id}
                                          button
                                          className={classes.nested}
                                          onClick={() => this.handleAddToPlaylist(track, source, thumbnail, artist, album, elem)}
                                          disabled={this.state.addingSongToPlaylist}
                                          >
                                            <Typography
                                                noWrap
                                                key={elem._id}
                                                className={elem._id === this.state.playlistIdAddedTo && this.state.songAdded ?
                                                    classes.playlistTitleAdded : classes.playlistTitle}
                                            >
                                                {elem.title}
                                            </Typography>
                                      </ListItem>)
                                )}
                                </List>
                             </Collapse>}
                    {this.props.isLoggedIn && creator._id === this.props.userid &&
                            <ListItem
                                button
                                key="Remove from this Playlist"
                                onClick={() => this.handleRemoveTrack(track)}
                            >
                              <ListItemIcon className={classes.icon}>
                                  <RemoveCircleIcon color={this.state.songRemoved ? "secondary" : "action"}/>
                              </ListItemIcon>
                              <ListItemText primary={this.state.songRemoved ? "Removed from this Playlist" : "Remove from this Playlist"} />
                              {this.state.removingSong && <CircularProgress size={36} className={classes.loopProgress} />}
                            </ListItem>}
                    {source === 'youtube' &&
                        <ListItem
                            button
                            key="Watch Video"
                            onClick={() => this.handleWatchVideo(videoId)}
                        >
                          <ListItemIcon className={classes.icon}><VisibilityIcon /></ListItemIcon>
                          <ListItemText primary="Watch Video"/>
                      </ListItem>}
                    {source === 'bandcamp' &&
                        <ListItem
                            button
                            key="Go to Bandcamp page"
                            onClick={() => window.open(track.musicSrc.split('&key')[0].split('=')[1], "_blank")}
                        >
                          <ListItemIcon className={classes.icon}><ExitToAppIcon /></ListItemIcon>
                          <ListItemText primary="Go to Bandcamp page"/>
                      </ListItem>}
                </List>
            </Container>
        </div>
            </Fade>
            <ModalVideo
                   channel='youtube'
                   isOpen={this.state.isModalOpen}
                   videoId={this.state.modalVideoId}
                   onClose={() => this.setState({isModalOpen: false})}
               />
        </div>
        );
  }
}

function mapStateToProps(state, props) {
  return {
      playlists: state.playlist.playlistsOwned ? state.playlist.playlistsOwned: [],
      isLoggedIn: state.auth.isLoggedIn,
      isSaved: state.playlist.isSaved,
      loading: state.playlist.isSaving,
      userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
      accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
      playlist: state.playlist.playlistCurrent ? state.playlist.playlistCurrent: {creator: {username: ""}, tracks: []},
      queueLoading: state.player.addLoading,
      currentTrack: state.player.currentTrack ? state.player.currentTrack : '',
      profile: state.profile.profile ? state.profile.profile : {username: "", avatar: "/broken-image.jpg"},
      owned: state.playlist.playlistsOwned ? state.playlist.playlistsOwned: [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hitApi: token => dispatch(hitApi(token)),
    disableCurrent: () => dispatch(disableCurrent()),
    addToPlayer: (event, source, cover, singer, album, index) => dispatch(queueSong(event, source, cover, singer, album, index)),
    updatePlaylist: (playlistInfo) => dispatch(updatePlaylist(playlistInfo)),
    getPlaylists: (userInfo) => dispatch(getPlaylists(userInfo)),
    syncCurrentTrack: audioInfo => dispatch(syncCurrentTrack(audioInfo)),
    mustReload: () => dispatch(mustReload()),
  };
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(TrackPage))));
