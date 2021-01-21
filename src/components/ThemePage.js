import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import ForumIcon from '@material-ui/icons/Forum';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import { getCurrentTheme, updateTheme, createTheme, mustReload } from '../actions/theme';
import { hitApi } from '../actions/helloWorld';
import { disableSearch } from '../actions/search';
import { disableHome } from '../actions/home';
import { disableLibrary } from '../actions/library';
import { MixPanel } from './MixPanel';
import GridPlaylists from "./GridPlaylists";
import { withLastLocation } from 'react-router-last-location';
import { convertToRaw } from "draft-js";
import MUIRichTextEditor from "mui-rte";
import FlexiLink from "./FlexiLink";
import { Link } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input'

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
    title: {
        marginTop: theme.spacing(2),
        overflowWrap: 'break-word',
        [theme.breakpoints.down('sm')]: {
            maxWidth: 360,
        },
    },
    editIcon: {
        margin: theme.spacing(3),
        backgroundColor: 'white',
    },
    subtitleCreator: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    subtitleDateTracks: {
        marginBottom: theme.spacing(2),
    },
    gridInfo: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2),
        paddingRight: theme.spacing(7)
    },
    gridTags: {
        paddingTop: theme.spacing(3),
        paddingRight: theme.spacing(6),
        marginLeft: theme.spacing(1),
        paddingBottom: theme.spacing(4)
    },
    gridTitle: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    },
    fabProgress: {
        color: 'secondary',
        position: 'absolute',
        zIndex: 1,
    },
    icon: {
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
    box: {
        height: '75vh',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    editContainer: {
        marginTop: theme.spacing(2),
    },
    description: {
        textAlign: 'left',
        paddingTop: 0
    },
    titleContainer: {
        width: '80%',
        marginLeft: theme.spacing(2),
    },
    button: {
        color: 'white',
        marginBottom: theme.spacing(2),
    },
    titleLink: {
        textDecoration: 'none'
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        "&:hover": {
            textDecoration: 'underline'
        }
    }
});


class ThemePage extends Component {
  constructor(props){
      super(props);
      this.state = {
          _id: '',
          description: '',
          title: '',
          tags: [],
          creator : {},
          date: '',
          editing: false,
          fade: false,
      };
  }

  componentDidMount () {
      if (this.props.isLoggedIn && this.props.accessToken !== null) {
          const token = this.props.accessToken
          this.props.hitApi(token)
      }
      // fetch theme
      this.fetchTheme();
      this.setState({ fade: true })
  }

  fetchTheme = () => {
      if (this.props.location.theme) {

          this.setState({
              _id: this.props.location.theme._id,
              title: this.props.location.theme.title,
              description: this.props.location.theme.description,
              loadedDescription: this.props.location.theme.description,
              playlists: this.props.location.theme.playlists,
              tags: this.props.location.theme.tags,
              creator: this.props.location.theme.creator,
              date: this.props.location.theme.updatedAt,
              editing: 'editing' in this.props.location ? this.props.location.editing : false,
          })
          MixPanel.track('View Theme Page', {
              'Theme ID': this.props.location.theme._id,
              'Theme Title': this.props.location.theme.title,
              'Theme Tags': this.props.theme.tags,
              'Theme Playlists': this.props.location.theme.playlists,
              'Theme Last Update': this.props.location.theme.updatedAt,
          })
      } else {
          this.props.getCurrentTheme(this.props.match.params.id).then(a => {
              if (this.props.error){
                  this.props.history.push('/');
              } else if (!('_id' in this.props.theme)){
                  this.props.history.push('/');
              } else {
                  this.setState({
                      _id: this.props.match.params.id,
                      title: this.props.theme.title,
                      description: this.props.theme.description,
                      loadedDescription: this.props.theme.description,
                      creator: this.props.theme.creator,
                      date: this.props.theme.updatedAt,
                      playlists: this.props.theme.playlists,
                      tags: this.props.theme.tags,
                  })
                  MixPanel.track('View Theme Page', {
                      'Theme ID': this.props.match.params.id,
                      'Theme Title': this.props.theme.title,
                      'Theme Tags': this.props.theme.tags,
                      'Theme Playlists': this.props.theme.playlists,
                      'Theme Last Update': this.props.theme.updatedAt,
                  })
              }
          });
      }
  }

  toggleEditing = async () => {
      await this.setState({ editing: !this.state.editing })
      if (!this.state.editing){
          if (this.state._id){
              await this.props.updateTheme({
                  accessToken: this.props.accessToken,
                  id: this.state._id,
                  title:  this.state.title,
                  description: this.state.description,
                  tags: this.state.tags,
              })
          } else {
              await this.props.createTheme({
                  accessToken: this.props.accessToken,
                  title:  this.state.title,
                  description: this.state.description,
                  tags: this.state.tags,
              }).then(res => {
                  MixPanel.track('Create Theme', {
                      'Theme Title': this.state.title,
                      'Theme tags': this.state.tags,
                  })
              })

          }
          await this.props.mustReload();
      }
  }

  handleInputChange = (event) => {
      const { value, name } = event.target;
      this.setState({
        [name]: value,
      });
  }

  handleRTEChange = (event) => {
      const content = JSON.stringify(convertToRaw(event.getCurrentContent()))
      this.setState({ description: content })
  }

  handleAddTag = (chip) => {
    this.setState({
      tags: [...this.state.tags, chip]
    })
  }

  handleDeleteTag = (deletedChip) => {
      this.setState({
        tags: this.state.tags.filter((c) => c !== deletedChip)
    })
  }

  handleGoBack = () => {
      if (this.props.mustReloadValue) {
          this.props.history.goBack();
          return;
      } else {
          if (this.props.lastLocation.pathname === '/')
            {
              this.props.disableHome();
          }
          this.props.history.goBack();
      }
  }

  render(){
      const { classes } = this.props;
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
                          <ForumIcon fontSize="large" className={this.props.lastLocation ? classes.iconHistory: classes.icon}/>
                  {this.props.lastLocation && <ArrowBackIcon visibility="hidden"/>}
                  </Grid>
              </AppBar>
               {!this.props.loading &&
              <Fade in={this.state.fade}>
                <Container maxWidth='md'>
                  <Grid container spacing={2} className={classes.head}>
                      {this.state.editing ?
                          <TextField
                              multiline={true}
                              name="title"
                              fullWidth
                              label="Title"
                              variant="outlined"
                              size="medium"
                              value={this.state.title}
                              inputProps={{ maxLength: 160 }}
                              onChange={this.handleInputChange}
                              className={classes.titleContainer}
                          /> :
                          <Typography variant="h6" className={classes.title}>
                              {this.state.title}
                          </Typography>}
                       <Grid
                           container
                           justify="center"
                           alignItems="center"
                           direction="row"
                           className={classes.editContainer}
                        >
                           {this.props.isLoggedIn && this.props.userid === this.state.creator._id &&
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
                         </Grid>
                    </Grid>
                       <Box p={3} className={classes.description}>
                           <MUIRichTextEditor
                                name="description"
                                label="Explain what this theme is about. Add numbered/bullet point rules so that other users understand your theme."
                                defaultValue={this.state.loadedDescription}
                                controls={["bold", "italic", "underline", "strikethrough", "link", "media","numberList", "bulletList", "quote", "clear"]}
                                inlineToolbar={true}
                                toolbar={this.state.editing}
                                maxLength={2000}
                                onChange={this.handleRTEChange}
                                readOnly={!this.state.editing}
                           />
                       </Box>
                       <Box p={3} className={classes.gridTags}>
                           <ChipInput
                              label={this.state.editing ? 'Tags' : ''}
                              value={this.state.tags}
                              onAdd={(chip) => this.handleAddTag(chip)}
                              onDelete={(chip) => this.handleDeleteTag(chip)}
                              readOnly={!this.state.editing}
                              disableUnderline={!this.state.editing}
                            />
                        </Box>
                       <Grid container spacing={5} justify="flex-end" direction="row" className={classes.gridInfo}>
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
                        </Grid>
                {!this.props.loading &&
                    <Box p={3}>
                        <FlexiLink
                            isLoggedIn={this.props.isLoggedIn}
                            to={{
                               pathname: '/playlist/cannotShareUrl',
                               playlist: {
                                   title: "Untitled playlist #" + (this.props.owned.length + 1),
                                   creator: {username: this.props.profile.username, _id: this.props.userid, avatar: this.props.profile.avatar},
                                   tracks: [],
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
                          <GridPlaylists
                              playlistLists={{'': this.state.playlists }}
                              loading={this.props.loading}
                              source="backtube"
                              row={true}
                            />
                    </Box>}
             </Container>
              </Fade>}
              {this.props.loading &&
                  <Box p={3}>
                  <Container className={classes.box}>
                      <CircularProgress color="secondary" />
                  </Container>
               </Box>}
        </div>
      );
    }
}

function mapDispatchToProps(dispatch) {
  return {
    getCurrentTheme: (playlistId) => dispatch(getCurrentTheme(playlistId)),
    updateTheme: (playlistInfo) => dispatch(updateTheme(playlistInfo)),
    hitApi: token => dispatch(hitApi(token)),
    disableSearch: () => dispatch(disableSearch()),
    disableHome: () => dispatch(disableHome()),
    disableLibrary: () => dispatch(disableLibrary()),
    createTheme: (playlistInfo) => dispatch(createTheme(playlistInfo)),
    mustReload: () => dispatch(mustReload()),
  };
}

function mapStateToProps(state, props) {
  return {
    loading: state.theme.isFetchingCurrent,
    isLoggedIn: state.auth.isLoggedIn,
    accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
    profile: state.profile.profile !== null ? state.profile.profile : {username: "", avatar: ""},
    userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
    isSaving: state.theme.isSaving,
    theme: state.theme.themeCurrent ? state.theme.themeCurrent: {creator: {username: ""}, playlists: [], title: "", description: ""},
    owned: state.playlist.playlistsOwned ? state.playlist.playlistsOwned: [],
    error: state.theme.error,
    mustReloadValue: state.theme.mustReload,
  };
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(ThemePage))));
