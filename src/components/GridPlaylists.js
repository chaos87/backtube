import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { ModalLink } from "react-router-modal-gallery";
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import FolderIcon from '@material-ui/icons/Folder';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
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
import Playlist from './Playlist';
import { addSingleSong, addMultipleSong } from '../actions/player';
import { getPlaylists, addFollower, removeFollower } from '../actions/playlist';
import { MixPanel } from './MixPanel';

const styles = theme => ({
    root: {
          padding: theme.spacing(2)
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
      height: 180,
    },
    cardClass: {
        height: "100%",
    },
    box: {
        height: '75vh',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    cardcontent: {
        minHeight: 125.19,
    },
    content: {
         display: 'flex',
         flexDirection: 'column',
         justifyContent:'center',
         alignItems: 'center',
    },
    actions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
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
        <Box>
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


class GridPlaylists extends Component {
  constructor(props){
      super(props);
      this.state = {
          open: false,
          value: 0,
          tracks: [],
          album: null,
          cover: null,
      };
  }

  handleChange = (event, newValue) => {
      this.setState({ value: newValue})
  }

  handleOpen = (event) => {
      this.setState({
          open: true,
          tracks: event.tracks,
          album: event.title,
          cover: event.cover
      })
  }

  handleClose = (event) => {
      this.setState({open: false})
  }

  handleFollow = (event) => {
      // prompt sign in if not logged in
      if (!this.props.isLoggedIn) {
          this.props.history.push('/login');
          return;
      }
      // add follower
      this.props.addFollower(
          event._id,
          this.props.accessToken
      ).then(res =>{
          console.log('Playlist followed')
          MixPanel.track('Follow Playlist', {
              'Playlist Title': event.title,
              'Playlist ID': event._id,
              'Playlist Creator ID': event.creator._id,
          });
          this.props.getPlaylists({
              accessToken: this.props.accessToken,
              userSub: this.props.userid
          })
      })
  }

  handleUnfollow = (event) => {
      // prompt sign in if not logged in
      if (!this.props.isLoggedIn) {
          this.props.history.push('/login');
          return;
      }
      // remove follower
      this.props.removeFollower(
          event._id,
          this.props.accessToken
      ).then(res =>{
          console.log('Playlist unfollowed')
          MixPanel.track('Unfollow Playlist', {
              'Playlist Title': event.title,
              'Playlist ID': event._id,
              'Playlist Creator ID': event.creator._id,
          });
          this.props.getPlaylists({
              accessToken: this.props.accessToken,
              userSub: this.props.userid
          })
      })
  }

  render(){
      const { classes } = this.props;
      return (
          <React.Fragment>
                <Paper square className={classes.paper}>
                  <Tabs
                    value={this.state.value}
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
                </Paper>
                {this.props.loading && <Container className={classes.box}>
                <CircularProgress color="secondary" />
            </Container>}
            {!this.props.loading && Object.keys(this.props.playlistLists).map((item, i) => (
                <TabPanel value={this.state.value} index={i} key={item}>
                    <Grid container direction="row" className={classes.root} spacing={2}>
                       {item in this.props.playlistLists && this.props.playlistLists[item] && this.props.playlistLists[item].map(elem => (
                                 <Grid item xs={12} sm={6} md={3} key={elem._id}>
                                     <Card className={classes.cardClass}>
                                         <CardActionArea>
                                          {elem.thumbnail ? <CardMedia
                                             className={classes.media}
                                             image={elem.thumbnail}
                                             title={elem.title}
                                         /> :
                                           <GridList cellHeight={120} className={classes.gridList} cols={2}>
                                              {'mosaic' in elem && elem.mosaic.map(tile => (
                                                <GridListTile key={tile._id} cols={1}>
                                                  <img src={tile.thumbnail} alt={tile.title} />
                                                </GridListTile>
                                              ))}
                                          </GridList>}
                                          {!elem.thumbnail && elem.tracks.filter((v,i,a)=>a.findIndex(t=>(t.thumbnail === v.thumbnail))===i).length <= 2 &&
                                              <CardContent className={classes.cardcontent}></CardContent>
                                          }
                                           <CardContent className={classes.content}>
                                               <Typography gutterBottom variant="body1" component="h2">
                                                 {elem.artist}
                                               </Typography>
                                               {elem.creator && <Avatar
                                                  alt={elem.creator.username}
                                                  src={elem.creator.avatar}
                                                  title={elem.creator.username}
                                                  aria-label="open account menu"
                                                  className={classes.avatar}
                                                >
                                              </Avatar>}
                                             <Typography gutterBottom variant="h6" component="h2">
                                               {elem.title}
                                             </Typography>
                                             {elem.releaseDate !== undefined && <Typography gutterBottom variant="subtitle1" component="h3">
                                               {elem.releaseDate}
                                                </Typography>}
                                             <Typography gutterBottom variant="subtitle1" component="h3">
                                               {"[" + elem.tracks.length + " tracks]"}
                                             </Typography>
                                           </CardContent>
                                         </CardActionArea>
                                         <CardActions className={classes.actions}>
                                           <Fab
                                               size="small"
                                               title="See tracks"
                                               onClick={() => this.handleOpen(elem)}
                                               className={classes.fab}
                                           >
                                               <FolderIcon/>
                                         </Fab>
                                         <Fab
                                             size="small"
                                             title="Add to player"
                                             disabled={this.props.addLoading && elem._id === this.props.itemAddedId}
                                             onClick={() => this.props.multiAddToPlaylist(elem, this.props.source, elem.thumbnail, elem.artist)}
                                             className={classes.fab}
                                         >
                                             <PlaylistAddIcon/>
                                             {this.props.addLoading && elem._id === this.props.itemAddedId &&
                                                 <CircularProgress color="secondary" className={classes.fabProgress} />}
                                       </Fab>
                                           {'url' in elem &&
                                           <Fab
                                               size="small"
                                               title="Buy"
                                               onClick={() => window.open(elem.url, "_blank")}
                                               className={classes.fab}
                                           >
                                               <ShoppingBasketIcon/>
                                         </Fab>}
                                         {this.props.source === 'owned' &&
                                         <ModalLink to={this.props.isLoggedIn ? '/deletePlaylist/' + elem._id : '/login'}>
                                             <Fab
                                                 title="Delete playlist"
                                                 size="small"
                                                 className={classes.fabModal}
                                             >
                                                 <DeleteIcon/>
                                           </Fab>
                                       </ModalLink>}
                                       {this.props.source === 'backtube'
                                        && this.props.userid !== elem.creator._id
                                        && !this.props.followed.includes(elem._id)
                                        && !this.props.isLoggedIn
                                        && <ModalLink to='/login'>
                                               <Fab
                                                   size="small"
                                                   title="Follow playlist"
                                                   className={classes.fabModal}
                                               >
                                                   <StarBorderIcon/>
                                             </Fab>
                                         </ModalLink>}
                                       {this.props.source === 'backtube'
                                        && this.props.userid !== elem.creator._id
                                        && !this.props.followed.includes(elem._id)
                                        && this.props.isLoggedIn
                                        &&
                                           <Fab
                                               size="small"
                                               title="Follow playlist"
                                               disabled={this.props.isFollowing && elem._id === this.props.playlistFollowing}
                                               onClick={() => this.handleFollow(elem)}
                                               className={classes.fab}
                                           >
                                               <StarBorderIcon/>
                                               {this.props.isFollowing && elem._id === this.props.playlistFollowing &&
                                                   <CircularProgress color="secondary" className={classes.fabProgress} />}
                                         </Fab>}
                                       {((this.props.source === 'backtube'
                                            && this.props.userid !== elem.creator._id
                                            && this.props.followed.includes(elem._id)
                                            && this.props.isLoggedIn)
                                        || (this.props.source === 'followed'
                                            && this.props.isLoggedIn))
                                        &&
                                           <Fab
                                             size="small"
                                             title="Unfollow playlist"
                                             disabled={this.props.isFollowing && elem._id.toString() === this.props.playlistFollowing}
                                             onClick={() => this.handleUnfollow(elem)}
                                             className={classes.fab}
                                           >
                                               <StarIcon color="secondary"/>
                                               {this.props.isFollowing && elem._id === this.props.playlistFollowing &&
                                                    <CircularProgress color="secondary" className={classes.fabProgress} />}
                                         </Fab>}
                                         </CardActions>
                                     </Card>
                                  </Grid>
                             ))}
                   </Grid>
             <Playlist
                 open={this.state.open}
                 onClose={this.handleClose}
                 title={this.state.album}
                 tracks={this.state.tracks}
                 thumbnail={this.state.cover}
                 addToPlaylist={this.props.addToPlaylist}
                 itemAddedId={this.props.itemAddedId}
                 addLoading={this.props.addLoading}
                 source={this.props.source}
             />
             </TabPanel>)
             )}
    </React.Fragment>
      );
    }
}

function mapDispatchToProps(dispatch) {
  return {
    addToPlaylist: (event, source, cover, singer, album, index) => dispatch(addSingleSong(event, source, cover, singer, album, index)),
    multiAddToPlaylist: (event, source, cover, singer) => dispatch(addMultipleSong(event, source, cover, singer)),
    addFollower: (playlistId, token) => dispatch(addFollower(playlistId, token)),
    removeFollower: (playlistId, token) => dispatch(removeFollower(playlistId, token)),
    getPlaylists: (userInfo) => dispatch(getPlaylists(userInfo)),
  };
}

function mapStateToProps(state, props) {
  return {
    addLoading: state.player.addLoading,
    itemAddedId: state.player.itemAddedId,
    isLoggedIn: state.auth.isLoggedIn,
    accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
    userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
    followed: state.playlist.playlistsFollowedIdTitle ? state.playlist.playlistsFollowedIdTitle: [],
    isFollowing: state.playlist.isFollowing,
    playlistFollowing: state.playlist.playlistFollowing
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(GridPlaylists)));
