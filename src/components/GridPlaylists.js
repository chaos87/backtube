import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { ModalLink } from "react-router-modal-gallery";
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import PauseIcon from '@material-ui/icons/Pause';
import IconButton from '@material-ui/core/IconButton';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import { Link } from 'react-router-dom';
import { AudioContext } from './AppLayout';
import { addMultipleSong } from '../actions/player';
import { setSubTab } from '../actions/nav';

const styles = theme => ({
    root: {
          padding: theme.spacing(2),
    },
    rootRow: {
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          overflowY: 'hidden',
          overflowX: 'scroll',
    },
    gridList: {
        marginRight: theme.spacing(1),
    },
    gridListRow: {
        flexWrap: 'nowrap',
    },
    paper: {
        background: '#e6e6e6',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 10px',
        boxShadow: '0 3px 5px 2px rgba(230, 230, 230, .3)',
    },
    media: {
      height: 240,
    },
    cardClass: {
        height: "100%",
        width: "100%"
    },
    cardClassRow: {
        height: "100%",
        width: 240
    },
    cardActionArea: {
        position: "relative",
        zIndex: 1,
        "&:hover $iconPlay, & .Mui-focused $iconPlay": {
            visibility: "visible"
        },
    },
    cardFocus: {
        opacity: 0.1
    },
    iconPlay: {
        position: "absolute",
        bottom: '20px',
        right: '20px',
        color: 'white',
        visibility: 'hidden',
        zIndex: 1000,
    },
    iconPlayVisible: {
        position: "absolute",
        bottom: '20px',
        right: '20px',
        color: 'white',
        zIndex: 1000,
    },
    box: {
        height: '25vh',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    content: {
         overflow: "hidden",
         textOverflow: "ellipsis",
         width: "100%"
    },
    fabProgress: {
        color: 'secondary',
        position: 'absolute',
        zIndex: 1,
    },
    avatar: {
        marginBottom: theme.spacing(2)
    },
    fab: {
        backgroundColor: 'white',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    fabModal: {
        backgroundColor: 'white',
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    title: {
        fontWeight: 'bold'
    },
    cardBottom: {
        display: 'flex',
        direction: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    albumIcon: {
      height: 240,
      fontSize: 60
    },
    titleSection: {
        fontWeight: 'bold',
    },
    gridInfo: {
        paddingTop: theme.spacing(3),
        paddingLeft: theme.spacing(3),
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    subtitleCreator: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    creatorContainer: {
        maxWidth: 160
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        "&:hover": {
            textDecoration: 'underline'
        }
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
        <Box width="100%">
          {children}
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


class GridPlaylists extends Component {
  constructor(props){
      super(props);
      this.state = {
          open: false,
          tracks: [],
          album: null,
          cover: null,
          disabled: false,
      };
  }

  handleChange = (event, newValue) => {
      this.props.setSubTab(newValue)
  }

  handlePlayFromButton = (e, elem, source) => {
      e.preventDefault();
      e.stopPropagation();
      if (
            !(elem.tracks.map(el => el._id).includes(this.props.currentTrack._id))
          && !('musicSrc' in this.props.currentTrack && elem.tracks.map(el => el._id).includes(this.props.currentTrack.musicSrc.split('&key')[0].split('=')[1]))
         ){
          const playlist = {
              _id: elem._id,
              title: elem.title,
              creator: elem.creator,
              tracks: elem.tracks,
          };
          this.props.multiAddToPlayer(playlist, source, null, null, true);
      }
      let audio = this.context;
      if (this.props.currentTrack.playing){
          audio.pause();
      } else {
          audio.play();
      }
  }

  onMouseEnter = () => {
      this.setState({
          disabled: true,
      })
  }

  onMouseLeave = () => {
      this.setState({
          disabled: false,
      })
  }

  render(){
      const { classes } = this.props;
      return (
          <React.Fragment>
                {!this.props.row ? <Paper square className={classes.paper}>
                  <Tabs
                    value={this.props.subTab}
                    onChange={this.handleChange}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="icon label tabs example"
                  >
                    {Object.keys(this.props.playlistLists).map((item, i) => (
                    <Tab key={item}
                        label={this.props.playlistLists[item] === undefined ? item + ' (0)' : item + ' (' + this.props.playlistLists[item].length + ')'}
                             {...a11yProps({i})} />
                     ))}
                  </Tabs>
              </Paper> :
              <Typography
                  variant={Object.keys(this.props.playlistLists)[0] === 'Playlists' ? 'h5' : 'h4'}
                  color="primary"
                  component="h1"
                  align="left"
                  className={classes.titleSection}
              >
                {Object.keys(this.props.playlistLists)[0]}
                {Object.keys(this.props.playlistLists)[0] === 'Playlists' ? ('(' + this.props.playlistLists[Object.keys(this.props.playlistLists)[0]].length + ')') : ''}
            </Typography>}
                {this.props.loading && <Container className={classes.box}>
                <CircularProgress color="secondary" />
            </Container>}
            {!this.props.loading && Object.keys(this.props.playlistLists).map((item, i) => (
                <TabPanel value={this.props.subTab} className={this.props.row ? classes.rootRow : classes.root} index={i} key={item}>
                    <Grid container direction="row" className={this.props.row ? classes.gridListRow : classes.gridList} spacing={2}>
                       {item in this.props.playlistLists && this.props.playlistLists[item] && this.props.playlistLists[item].map(elem => (
                                 <Grid item xs={12} sm={6} md={this.props.row ? 12 : 3} key={elem._id}>
                                     <Card className={this.props.row ? classes.cardClassRow : classes.cardClass}>
                                         <CardActionArea
                                             component={Link}
                                             to={{
                                                pathname: ['backtube', 'owned', 'followed'].includes(this.props.source) ? `/playlist/${elem._id}` : `/playlist/cannotShareUrl`,
                                                playlist: elem,
                                                source: this.props.source,
                                            }}
                                            disableRipple={this.state.disabled}
                                            classes={{
                                              root: classes.cardActionArea,
                                              focusHighlight: classes.cardFocus
                                            }}
                                         >
                                          {elem.thumbnail ? <CardMedia
                                             className={classes.media}
                                             image={elem.thumbnail}
                                             title={elem.title}
                                         /> : 'mosaic' in elem && elem.mosaic.length < 4 && elem.mosaic.length > 0 ?
                                         <CardMedia
                                            className={classes.media}
                                            image={elem.mosaic[0].thumbnail}
                                            title={elem.title}
                                        /> : 'mosaic' in elem && elem.mosaic.length > 0 ?
                                           <GridList cellHeight={120} cols={2}>
                                              {elem.mosaic.map(tile => (
                                                <GridListTile key={tile._id} cols={1}>
                                                  <img src={tile.thumbnail} alt={tile.title} />
                                                </GridListTile>
                                              ))}
                                          </GridList>
                                        : <QueueMusicIcon color="primary" className={classes.albumIcon}/>}
                                          <Fab
                                              size="medium"
                                              color="secondary"
                                              className={this.props.currentTrack.playing && this.props.currentTrack.playlistId === elem._id ? classes.iconPlayVisible : classes.iconPlay}
                                              name="playIcon"
                                              onClick={(e) => this.handlePlayFromButton(e, elem, this.props.source)}
                                              onMouseEnter={this.onMouseEnter}
                                              onMouseLeave={this.onMouseLeave}
                                          >
                                              {this.props.currentTrack.playing && this.props.currentTrack.playlistId === elem._id ?
                                                  <PauseIcon fontSize="default"/> : <PlayArrowIcon fontSize="default"/>}
                                          </Fab>
                                          </CardActionArea>
                                          <div className={classes.cardBottom}>
                                               <CardContent className={classes.content}>
                                                   <Typography noWrap variant="subtitle1" component="h1" align="left" className={classes.title}>
                                                     {elem.title}
                                                   </Typography>
                                                   {elem.artist ?
                                                       <Typography noWrap variant="body1" align="left" component="h2">
                                                         {elem.artist}
                                                       </Typography>
                                                      :
                                                       <Grid container spacing={5} justify="flex-start" direction="row" className={classes.gridInfo}>
                                                           <div className={classes.creatorContainer}>
                                                               <Link to={{ pathname: `/profile/${elem.creator._id}`}} className={classes.link}>
                                                                   <Typography noWrap variant="subtitle1" className={classes.subtitleCreator}>
                                                                     by {elem.creator.username}
                                                                   </Typography>
                                                               </Link>
                                                           </div>
                                                           <Link to={{ pathname: `/profile/${elem.creator._id}`}} className={classes.link}>
                                                               <Avatar
                                                                  alt={elem.creator.username}
                                                                  src={elem.creator.avatar}
                                                                  title={elem.creator.username}
                                                                  aria-label="open account menu"
                                                                  className={classes.avatar}
                                                                >
                                                              </Avatar>
                                                          </Link>
                                                      </Grid>
                                                     }
                                               </CardContent>
                                               {this.props.source === 'owned' && <CardActions>
                                                   <ModalLink to={this.props.isLoggedIn ? `/deletePlaylist/${elem._id}`: '/login'}>
                                                       <IconButton title="Delete playlist">
                                                           <DeleteIcon />
                                                       </IconButton>
                                                   </ModalLink>
                                               </CardActions>}
                                          </div>
                                     </Card>
                                  </Grid>
                             ))}
                   </Grid>
             </TabPanel>)
             )}
    </React.Fragment>
      );
    }
}
GridPlaylists.contextType = AudioContext;

function mapDispatchToProps(dispatch) {
  return {
    multiAddToPlayer: (event, source, cover, singer, clear) => dispatch(addMultipleSong(event, source, cover, singer, clear)),
    setSubTab: (value) => dispatch(setSubTab(value))
  };
}

function mapStateToProps(state, props) {
  return {
    addLoading: state.player.addLoading,
    itemAddedId: state.player.itemAddedId,
    isLoggedIn: state.auth.isLoggedIn,
    accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
    userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
    currentTrack: state.player.currentTrack ? state.player.currentTrack : '',
    subTab: state.nav.subTab ? state.nav.subTab : 0,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(GridPlaylists)));
