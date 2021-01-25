import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { ModalLink } from "react-router-modal-gallery";
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import PauseIcon from '@material-ui/icons/Pause';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import Select from '@material-ui/core/Select';
import moment from 'moment';
import { addMultipleSong } from '../actions/player';
import { updatePlaylist, getCurrentPlaylist, addFollower, removeFollower, getPlaylists, enableCurrent, updateCurrent, createPlaylist, mustReload } from '../actions/playlist';
import { hitApi } from '../actions/helloWorld';
import { disableSearch } from '../actions/search';
import { disableHome } from '../actions/home';
import { disableLibrary } from '../actions/library';
import { getAllThemes } from '../actions/theme';
import { MixPanel } from './MixPanel';
import PlaylistBody from './PlaylistBody';
import { AudioContext } from './AppLayout';
import { Link } from 'react-router-dom';
import { withLastLocation } from 'react-router-last-location';
import { convertFromHTML, ContentState, convertToRaw } from "draft-js";
import md5 from 'md5';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    head: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'center',
        paddingTop: theme.spacing(4),
    },
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
    tracks: {
        display: 'flex',
        justifyContent:'center',
        alignItems: 'center',
    },
    container: {
        marginTop: theme.spacing(2),
    },
    tabsContainer: {
        position: 'sticky',
        background: '#e6e6e6',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        maxWidth: 700,
        padding: '0 10px',
        boxShadow: '0 3px 5px 2px rgba(230, 230, 230, .3)',
        top: 130,
        [theme.breakpoints.only('sm')]: {
            top: 140,
        },
        zIndex: 999
    },
    title: {
        margin: theme.spacing(2),
        overflowWrap: 'break-word',
        [theme.breakpoints.down('sm')]: {
            maxWidth: 360,
        },
    },
    titleEdit: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        [theme.breakpoints.only('xs')]: {
            width: 300,
        },
        [theme.breakpoints.only('sm')]: {
            width: 400,
        },
        [theme.breakpoints.only('md')]: {
            width: 600,
        },
        [theme.breakpoints.up('lg')]: {
            width: 900,
        },
    },
    subtitleCreator: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    subtitleDateTracks: {
        marginBottom: theme.spacing(2),
    },
    review: {
        minHeight: 800,
        [theme.breakpoints.up('md')]: {
            minWidth: '40%',
            maxWidth: '50%',
        },
        textAlign: 'left',
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(2)
    },
    gridInfo: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2),
    },
    gridTitle: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    gridList: {
        width: 240,
        display: 'flex',
        direction: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tracksCount: {
        marginBottom: theme.spacing(2)
    },
    editIcon: {
        margin: theme.spacing(3),
        backgroundColor: 'white',
    },
    playIcon: {
        margin: theme.spacing(3),
        backgroundColor: theme.palette.secondary.main,
        color: "white"
    },
    fabProgress: {
        color: 'secondary',
        position: 'absolute',
        zIndex: 1,
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
    cover: {
        height: 240
    },
    box: {
        height: '75vh',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center'
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
    formControl: {
        minWidth: 300,
        maxWidth: 330,
    },
    themeControl: {
        minWidth: 300,
        maxWidth: 330,
        outline: '1px solid #31c27c'
    },
    theme: {
        color: theme.palette.primary.main,
        fontWeight: 'bold',
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        "&:hover": {
            textDecoration: 'underline'
        }
    }
});


class PlaylistPage extends Component {
  constructor(props){
      super(props);
      this.state = {
          _id: '',
          review: '',
          loadedReview: '',
          title: '',
          tracks: [],
          source: '',
          creator : {},
          artist: '',
          date: '',
          mosaic: [],
          thumbnail: '',
          tabIndex: 0,
          swipeable: true,
          editing: false,
          fade: false,
          private: true,
          themes: [],
          open: false
      };
  }

  componentDidMount () {
      if (this.props.isLoggedIn && this.props.accessToken !== null) {
          const token = this.props.accessToken
          this.props.hitApi(token)
      }
      // fetch playlist
      this.fetchPlaylist();
      this.setState({ fade: true })
  }

  fetchPlaylist = () => {
      if (this.props.location.playlist && this.props.location.source) {
          // transform tracks such that _id matches with currently played _id from player
          const tracks = this.props.location.playlist.tracks;
          let newTracks;
          if (this.props.location.source === 'youtube'){
              newTracks = tracks.map(
                  ({ _id, title, artist, thumbnail, duration, videoId  }) => (
                      {
                          _id: md5('/youtube/stream?videoId=' + _id),
                          title: title, videoId: videoId,
                          source: 'youtube', artist: artist, thumbnail: thumbnail,
                          album: this.props.location.playlist.title,
                          duration: duration
                      }
                  )
              );
          } else if (this.props.location.source === 'bandcamp'){
              newTracks = tracks.map(
                  ({ _id, title, artist, thumbnail, duration, url  }) => (
                      {
                          _id: md5('/bandcamp/stream?url=' + url),
                          title: title, url: url,
                          source: 'bandcamp', artist: artist, thumbnail: thumbnail,
                          album: this.props.location.playlist.title,
                          duration: duration
                      }
                  )
              );
          } else {
              newTracks = tracks;
          }
          // description
          let description = 'description' in this.props.location.playlist ? this.props.location.playlist.description : '';
          const contentHTML = convertFromHTML(description);
          const state = ContentState.createFromBlockArray(
              contentHTML.contentBlocks,
              contentHTML.entityMap
            );
          description = JSON.stringify(convertToRaw(state));
          description = description === '{"blocks":[],"entityMap":{}}' ? '' : description;
          this.setState({
              _id: this.props.location.playlist._id,
              title: this.props.location.playlist.title,
              review: 'review' in this.props.location.playlist ? this.props.location.playlist.review
                      : 'description' in this.props.location.playlist ? this.props.location.playlist.description : null,
              loadedReview: 'review' in this.props.location.playlist ? this.props.location.playlist.review
                      : 'description' in this.props.location.playlist ? description : null,
              tracks: newTracks,
              themes: 'themes' in this.props.location.playlist ? this.props.location.playlist.themes : [],
              private: 'private' in this.props.location.playlist ? this.props.location.playlist.private : false,
              source: this.props.location.source,
              artist: 'artist' in this.props.location.playlist ? this.props.location.playlist.artist : null,
              mosaic: 'mosaic' in this.props.location.playlist ? this.props.location.playlist.mosaic : null,
              thumbnail: 'thumbnail' in this.props.location.playlist ? this.props.location.playlist.thumbnail : null,
              creator: 'creator' in this.props.location.playlist ? this.props.location.playlist.creator : {username: null, _id: null, avatar: null},
              date: 'updatedAt' in this.props.location.playlist ? this.props.location.playlist.updatedAt : this.props.location.playlist.releaseDate,
              editing: 'editing' in this.props.location ? this.props.location.editing : false,
          })
          this.props.setCurrentPlaylist({
              _id: this.props.location.playlist._id,
              title: this.props.location.playlist.title,
              review: 'review' in this.props.location.playlist ? this.props.location.playlist.review
                      : 'description' in this.props.location.playlist ? this.props.location.playlist.description : null,
              loadedReview: 'review' in this.props.location.playlist ? this.props.location.playlist.review
                      : 'description' in this.props.location.playlist ? this.props.location.playlist.description : null,
              tracks: newTracks,
              themes: 'themes' in this.props.location.playlist ? this.props.location.playlist.themes : [],
              private: 'private' in this.props.location.playlist ? this.props.location.playlist.private : false,
              source: this.props.location.source,
              artist: 'artist' in this.props.location.playlist ? this.props.location.playlist.artist : null,
              mosaic: 'mosaic' in this.props.location.playlist ? this.props.location.playlist.mosaic : null,
              thumbnail: 'thumbnail' in this.props.location.playlist ? this.props.location.playlist.thumbnail : null,
              creator: 'creator' in this.props.location.playlist ? this.props.location.playlist.creator : {username: null, _id: null, avatar: null},
              updatedAt: 'updatedAt' in this.props.location.playlist ? this.props.location.playlist.updatedAt : this.props.location.playlist.releaseDate,
          })
          // fetch themes if user is creator
          if (this.props.isLoggedIn && 'creator' in this.props.location.playlist && this.props.userid === this.props.location.playlist.creator._id){
              this.props.getAllThemes({ accessToken: this.props.accessToken });
          }
          if (['backtube', 'owned', 'followed'].includes(this.props.location.source)){
              MixPanel.track('View Playlist Page', {
                  'Playlist ID': this.props.location.playlist._id,
                  'Playlist Title': this.props.location.playlist.title,
                  'Playlist Tracks': newTracks,
                  'Playlist Themes': this.props.location.playlist.themes,
                  'Playlist Private': this.props.location.playlist.private,
                  'Playlist Last Update': this.props.location.playlist.updatedAt,
              })
          }
      } else {
          if (this.props.refreshCurrent) {
              const payload = {
                  playlistId: this.props.match.params.id,
                  accessToken: this.props.accessToken,
              }
              this.props.getCurrentPlaylist(payload).then(a => {

                  if (this.props.error){
                      this.props.history.push('/');
                  } else if (!('_id' in this.props.playlist)){
                      this.props.history.push('/');
                  } else {
                      this.setState({
                          _id: this.props.match.params.id,
                          title: this.props.playlist.title,
                          review: this.props.playlist.review,
                          loadedReview: this.props.playlist.review,
                          tracks: this.props.playlist.tracks,
                          private: this.props.playlist.private,
                          source: 'backtube',
                          creator: this.props.playlist.creator,
                          date: this.props.playlist.updatedAt,
                          mosaic: this.props.playlist.mosaic,
                          themes: this.props.playlist.themes,
                      })
                      MixPanel.track('View Playlist Page', {
                          'Playlist ID': this.props.match.params.id,
                          'Playlist Title': this.props.playlist.title,
                          'Playlist Tracks': this.props.playlist.tracks,
                          'Playlist Themes': this.props.playlist.themes,
                          'Playlist Private': this.props.playlist.private,
                          'Playlist Last Update': this.props.playlist.updatedAt,
                      })
                  }
                  // fetch themes if user is creator
                  if (this.props.isLoggedIn && this.props.playlist.creator && this.props.userid === this.props.playlist.creator._id){
                      this.props.getAllThemes({ accessToken: this.props.accessToken });
                  }
              });
          } else {
              this.props.enableCurrent();
              this.setState({
                  _id: this.props.match.params.id,
                  title: this.props.playlist.title,
                  review: this.props.playlist.review,
                  loadedReview: this.props.playlist.review,
                  tracks: this.props.playlist.tracks,
                  private: this.props.playlist.private,
                  source: this.props.playlist.source,
                  thumbnail: this.props.playlist.thumbnail,
                  creator: this.props.playlist.creator,
                  date: this.props.playlist.updatedAt,
                  mosaic: this.props.playlist.mosaic,
                  themes: this.props.playlist.themes,
              })
          }
      }
  }

  handleTabClick = (event, index) => {
      this.setState({ tabIndex: index})
  }

  toggleSwipeableViews = () => {
      this.setState({ swipeable: !this.state.swipeable })
  }

  handleTracks = tracks => {
      this.setState({ tracks: tracks })
  }

  toggleEditing = async () => {
      await this.setState({ editing: !this.state.editing })
      if (!this.state.editing){
          if (this.state._id){
              await this.props.updatePlaylist({
                  accessToken: this.props.accessToken,
                  id: this.state._id,
                  title:  this.state.title,
                  review: this.state.review,
                  playlist: this.state.tracks,
                  themes: this.state.themes,
                  private: this.state.private,
              }).then(res => {
                    if (this.props.isSaved) {
                        MixPanel.track('Update Playlist', {
                            'Playlist Title': this.state.title,
                            'Playlist ID': this.state._id,
                            'Playlist Tracks': this.state.tracks,
                            'Playlist Private': this.state.private,
                            'Playlist Themes': this.state.themes
                        });
                    }
                })
          } else {
              await this.props.createPlaylist({
                  accessToken: this.props.accessToken,
                  title:  this.state.title,
                  review: this.state.review,
                  playlist: this.state.tracks,
                  themes: this.state.themes,
                  private: this.state.private,
              }).then(res => {
                  let playlistDate = new Date().toISOString();
                  if (this.props.isSaved) {
                      MixPanel.track('Create Playlist', {
                          'Playlist Title': this.state.title,
                          'Playlist Tracks': this.state.tracks,
                          'Playlist Private': this.state.private,
                          'Playlist Themes': this.state.themes
                      });
                      MixPanel.people.set({
                          'Last Playlist Create': playlistDate
                      });
                      MixPanel.people.set_once({
                          'First Playlist Create': playlistDate
                      });
                      MixPanel.people.increment('Total Playlist Create');
                  }
              })
          }
          await this.props.mustReload();
          await this.props.getPlaylists({
              accessToken: this.props.accessToken,
              userSub: this.props.userid
          })
          await this.props.setCurrentPlaylist({
              _id: this.state._id,
              title: this.state.title,
              review: this.state.review,
              tracks: this.state.tracks,
              themes: this.state.themes,
              source: 'backtube',
              creator: this.state.creator,
              updatedAt: this.state.date,
              mosaic: this.state.mosaic,
              private: this.state.private,
          })
      }
  }

  handleInputChange = (event) => {
      const { value, name } = event.target;
      this.setState({
        [name]: value,
      });
  }

  handleFollow = async (event) => {
      // prompt sign in if not logged in
      this.setState({ isFollowing: true })
      if (!this.props.isLoggedIn) {
          this.props.history.push('/login');
          return;
      }
      if (this.props.followed.map(el => el._id).includes(this.state._id)) {
          await this.props.removeFollower(
              this.state._id,
              this.props.accessToken
          ).then(res =>{
              console.log('Playlist unfollowed')
              MixPanel.track('Unfollow Playlist', {
                  'Playlist Title': this.state.title,
                  'Playlist ID': this.state._id,
                  'Playlist Creator ID': this.state.creator._id,
              });
          })
      } else {
          await this.props.addFollower(
              this.state._id,
              this.props.accessToken
          ).then(res =>{
              console.log('Playlist followed')
              MixPanel.track('Follow Playlist', {
                  'Playlist Title': this.state.title,
                  'Playlist ID': this.state._id,
                  'Playlist Creator ID': this.state.creator._id,
              });
          })
    }
    await this.props.getPlaylists({
        accessToken: this.props.accessToken,
        userSub: this.props.userid
    })
    this.setState({ isFollowing: false })
  }

  handleCheckbox = () => {
      this.setState({
          private: !this.state.private,
          themes: !this.state.private ? [] : this.state.themes,
      })
  }

  handleChangeTheme = (event) => {
    this.setState({ themes: event.target.value });
  };

  handleOpenNested = () => {
      this.setState({
        open: !this.state.open
      });
  };

  handleRTEChange = (event) => {
      const content = JSON.stringify(convertToRaw(event.getCurrentContent()))
      this.setState({ review: content })
  }

  handlePlayFromTrack = (item) => {
      // add tracks to player
      const index = this.state.tracks.findIndex(x => x._id === item._id);
      const subPlaylist = {
          _id: this.state._id,
          title: this.state.title,
          creator: this.state.creator,
          tracks: this.state.tracks.slice(index),
      };
      this.props.multiAddToPlayer(subPlaylist, this.state.source, null, null, true);
  }

  handlePlayFromButton = () => {
      if (!(this.state.tracks.map(el => el._id).includes(this.props.currentTrack._id))){
          const playlist = {
              _id: this.state._id,
              title: this.state.title,
              creator: this.state.creator,
              tracks: this.state.tracks,
          };
          this.props.multiAddToPlayer(playlist, this.state.source, null, null, true);
      }
      let audio = this.context;
      if (this.props.currentTrack.playing){
          audio.pause();
      } else {
          audio.play();
      }
  }

  handleGoBack = () => {
      if (this.props.mustReloadprop) {
          this.props.history.goBack();
          return;
      } else {
          if (
              this.props.lastLocation.pathname.startsWith('/results')
            || (['youtube', 'bandcamp'].includes(this.state.source) && this.props.lastLocation.pathname.startsWith('/track/cannotShareUrl') )
            ) {
              this.props.disableSearch();
          }
          if (this.props.lastLocation.pathname === '/'
            || (this.state.source === 'backtube' && this.props.lastLocation.pathname.startsWith('/track/cannotShareUrl') )
            ){
              this.props.disableHome();
          }
          if (
              this.props.lastLocation.pathname === '/library'
              || (['owned', 'followed'].includes(this.state.source) && this.props.lastLocation.pathname.startsWith('/track/cannotShareUrl'))
              ){
                  this.props.disableLibrary();
              }
          this.props.history.goBack();
      }
  }

  render(){
      const { classes } = this.props;
      const MenuProps = {
          PaperProps: {
            style: {
              maxWidth: 330,
            },
          },
      };
      return (
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
                          <QueueMusicIcon fontSize="large" className={this.props.lastLocation ? classes.iconHistory: classes.icon}/>
                  {this.props.lastLocation && <ArrowBackIcon visibility="hidden"/>}
                  </Grid>
              </AppBar>
               {!this.props.loading &&
              <Fade in={this.state.fade}>
              <Grid container className={classes.head}>
                  <Box boxShadow={3}>
                      {this.state.mosaic && this.state.mosaic.length >= 4 ?
                          <GridList cellHeight={120} className={classes.gridList} cols={2}>
                             {this.state.mosaic.map(tile => (
                               <GridListTile key={tile._id} cols={1}>
                                 <img src={tile.thumbnail} alt={tile.title} />
                               </GridListTile>
                             ))}
                         </GridList>
                         : this.state.mosaic &&  this.state.mosaic.length !== 0 ?
                         <GridList cellHeight={240} className={classes.gridList} cols={1}>
                              <GridListTile key={this.state._id} cols={1}>
                                <img src={this.state.mosaic[0].thumbnail}
                                    alt={this.state.title}
                                />
                              </GridListTile>
                         </GridList>
                        : this.state.thumbnail ?
                        <GridList cellHeight={240} className={classes.gridList} cols={1}>
                             <GridListTile key={this.state._id} cols={1}>
                               <img src={this.state.thumbnail}
                                   alt={this.state.title}
                               />
                             </GridListTile>
                        </GridList>
                        : <Box style={{backgroundColor: 'rgba(0, 0, 0, 0.1)'}} className={classes.coverContainer}>
                              <QueueMusicIcon color="primary" className={classes.albumIcon}/>
                          </Box>
                      }
                  </Box>
                  <div>
                     <Grid container direction='column' justify='center' alignItems='center' className={classes.gridTitle}>
                      {this.state.editing ?
                          <TextField
                              name="title"
                              size="medium"
                              variant='outlined'
                              label='Title'
                              multiline={true}
                              value={this.state.title}
                              inputProps={{ maxLength: 120 }}
                              onChange={this.handleInputChange}
                              className={classes.titleEdit}
                          /> :
                          <Typography variant="h6" className={classes.title}>
                              {this.state.title}
                          </Typography>}
                          {!(['backtube', 'owned', 'followed'].includes(this.state.source)) &&
                          <Typography variant="subtitle1">
                              {this.state.artist}
                          </Typography>}
                      </Grid>
                      {['backtube', 'owned', 'followed'].includes(this.state.source) &&
                      <Grid container spacing={5} justify="center" direction="row" className={classes.gridInfo}>
                          <Link to={{ pathname: `/profile/${this.state.creator._id}`}} className={classes.link}>
                              <Typography variant="subtitle1" className={classes.subtitleCreator}>
                                by {this.state.creator.username}
                              </Typography>
                          </Link>
                          <Link to={{ pathname: `/profile/${this.state.creator._id}`}} className={classes.link}>
                              <Avatar
                                 alt={this.state.creator.username}
                                 src={this.state.creator.avatar}
                                 title={this.state.creator.username}
                                 aria-label="open account menu"
                                 className={classes.avatar}
                               >
                             </Avatar>
                         </Link>
                     </Grid>}
                     <Typography variant="subtitle2" className={classes.subtitleDateTracks}>
                       {moment(this.state.date).format("ll")} - [{this.state.tracks.length} tracks]
                     </Typography>

                         <Grid container alignItems="center" justify="center" direction="column">
                              {this.state.editing && this.state.tracks.length > 2 && <FormControlLabel
                                 control={
                                   <Checkbox
                                     checked={this.state.private}
                                     onChange={this.handleCheckbox}
                                     name="checkedB"
                                     color="secondary"
                                   />
                                 }
                                 label="Private"
                             />}
                            {this.state.editing && <FormControl className={classes.formControl}>
                                <InputLabel id="themes-label">Themes</InputLabel>
                                <Select
                                  label="Themes"
                                  id="themes"
                                  multiple
                                  value={this.props.themes.filter(e => this.state.themes.map(el => el._id).includes(e._id))}
                                  onChange={this.handleChangeTheme}
                                  input={<Input />}
                                  renderValue={(selected) => selected.map(e => e.title).join(', ')}
                                  MenuProps={MenuProps}
                                  disabled={this.state.private}
                                >
                                  {this.props.themes.map((theme) => (
                                    <MenuItem key={theme._id} value={theme}>
                                      <Checkbox checked={this.props.themes.filter(e => this.state.themes.map(el => el._id).includes(e._id)).map(t => t._id).indexOf(theme._id) > -1} />
                                      <Typography noWrap>
                                        {theme.title}
                                    </Typography>
                                    </MenuItem>
                                  ))}
                                </Select>
                            </FormControl>}
                            {!this.state.editing && ['backtube', 'owned', 'followed'].includes(this.state.source) &&
                                <ListItem
                                    button
                                    key={"Themes"}
                                    className={classes.themeControl}
                                    onClick={() => this.handleOpenNested()}
                                >
                                  <ListItemText primary={"Themes (" + this.state.themes.length + ")"} className={classes.theme}/>
                                  {this.state.open ? <ExpandLess color="secondary"/> : <ExpandMore color="secondary"/>}
                              </ListItem>}
                              {!this.state.editing && ['backtube', 'owned', 'followed'].includes(this.state.source) &&
                                  <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {this.state.themes.map(elem => (
                                            <ListItem
                                              key={elem._id}
                                              button
                                              component={Link}
                                              to={{
                                                  pathname: `/theme/${elem._id}`,
                                              }}
                                              >
                                                <Typography
                                                    noWrap
                                                    key={elem._id}
                                                    className={classes.theme}
                                                >
                                                    {elem.title}
                                                </Typography>
                                          </ListItem>)
                                    )}
                                    </List>
                                 </Collapse>}
                        </Grid>
                     </div>
                  <Grid
                      container
                      justify="center"
                      alignItems="center"
                      direction="row"
                   >
                      <Fab
                          aria-label="play"
                          className={classes.playIcon}
                          color="secondary"
                          onClick={this.handlePlayFromButton}
                          disabled={this.state.editing}
                      >
                          {this.props.currentTrack.playing && this.props.currentTrack.playlistId === this.state._id ?
                              <PauseIcon fontSize="large"/> : <PlayArrowIcon fontSize="large"/>}
                      </Fab>
                      {this.props.isLoggedIn && ['backtube', 'owned', 'followed'].includes(this.state.source) && this.props.userid === this.state.creator._id &&
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
                      {this.props.isLoggedIn && this.props.userid !== this.state.creator._id &&
                          ['backtube', 'owned', 'followed'].includes(this.state.source) &&
                          <Fab
                              aria-label="follow"
                              className={classes.editIcon}
                              onClick={this.handleFollow}
                              disabled={this.state.isFollowing}
                          >
                              {this.props.followed.map(el => el._id).includes(this.state._id) ? <StarIcon color="secondary"/>: <StarBorderIcon />}
                              {this.state.isFollowing &&
                                  <CircularProgress color="secondary" size={68} className={classes.fabProgress} />}
                          </Fab>}
                          {!this.props.isLoggedIn && ['backtube', 'owned', 'followed'].includes(this.state.source) &&
                              <ModalLink to='/login'>
                                  <Fab
                                      aria-label="follow"
                                      className={classes.editIcon}
                                  >
                                      <StarBorderIcon />
                                  </Fab>
                            </ModalLink>
                      }
                          {this.state.source === 'bandcamp' &&
                              <Fab
                                  aria-label="go to bandcamp"
                                  className={classes.editIcon}
                                  onClick={() => window.open(this.state._id, "_blank")}
                              >
                                  <ExitToAppIcon />
                              </Fab>}
                    </Grid>
              </Grid>
          </Fade>}
              <Box p={3}>
                {this.props.loading &&
                    <Container className={classes.box}>
                        <CircularProgress color="secondary" />
                    </Container>}
            {!this.props.loading &&
                <PlaylistBody
                    tracks={this.state.tracks}
                    playlistId={this.state._id}
                    creator={this.state.creator}
                    handleTracks={this.handleTracks}
                    isLoggedIn={this.props.isLoggedIn}
                    review={this.state.review}
                    loadedReview={this.state.loadedReview}
                    handleRTEChange={this.handleRTEChange}
                    tabIndex={this.state.tabIndex}
                    handleTabClick={this.handleTabClick}
                    swipeable={this.state.swipeable}
                    toggleSwipeableViews={this.toggleSwipeableViews}
                    source={this.state.source}
                    editing={this.state.editing}
                    handlePlay={this.handlePlayFromTrack}
                    currentTrack={this.props.currentTrack}
                    classes={classes}
                />}
             </Box>
        </div>
      );
    }
}
PlaylistPage.contextType = AudioContext;

function mapDispatchToProps(dispatch) {
  return {
    multiAddToPlayer: (event, source, cover, singer, clear) => dispatch(addMultipleSong(event, source, cover, singer, clear)),
    addFollower: (playlistId, token) => dispatch(addFollower(playlistId, token)),
    removeFollower: (playlistId, token) => dispatch(removeFollower(playlistId, token)),
    getCurrentPlaylist: (playlistInfo) => dispatch(getCurrentPlaylist(playlistInfo)),
    updatePlaylist: (playlistInfo) => dispatch(updatePlaylist(playlistInfo)),
    hitApi: token => dispatch(hitApi(token)),
    getPlaylists: (userInfo) => dispatch(getPlaylists(userInfo)),
    disableSearch: () => dispatch(disableSearch()),
    disableHome: () => dispatch(disableHome()),
    disableLibrary: () => dispatch(disableLibrary()),
    enableCurrent: () => dispatch(enableCurrent()),
    setCurrentPlaylist: (playlist) => dispatch(updateCurrent(playlist)),
    createPlaylist: (playlistInfo) => dispatch(createPlaylist(playlistInfo)),
    getAllThemes: (themeInfo) => dispatch(getAllThemes(themeInfo)),
    mustReload: () => dispatch(mustReload()),
  };
}

function mapStateToProps(state, props) {
  return {
    loading: state.playlist.isFetchingCurrent,
    isLoggedIn: state.auth.isLoggedIn,
    accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
    userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
    followed: state.playlist.playlistsFollowed ? state.playlist.playlistsFollowed: [],
    isFollowing: state.playlist.isFollowing,
    isSaving: state.playlist.isSaving,
    isSaved: state.playlist.isSaved,
    playlist: state.playlist.playlistCurrent ? state.playlist.playlistCurrent: {creator: {username: ""}, tracks: []},
    currentTrack: state.player.currentTrack ? state.player.currentTrack : '',
    error: state.playlist.error,
    refreshCurrent: state.playlist.refreshCurrent,
    mustReloadprop: state.playlist.mustReload,
    themes: state.theme.allThemes ? state.theme.allThemes : [],
  };
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(PlaylistPage))));
