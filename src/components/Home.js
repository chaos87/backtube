import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import HomeIcon from '@material-ui/icons/Home';
import SaveIcon from '@material-ui/icons/Save';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { ModalLink } from "react-router-modal-gallery";
import { hitApi } from '../actions/helloWorld';
import { getRecentPlaylists } from '../actions/playlist';
import { withLastLocation } from 'react-router-last-location';
import GridPlaylists from "./GridPlaylists";


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  bar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent:'center',
      alignItems: 'center',
      top: theme.spacing(7)
  },
  subContainer: {
      padding: theme.spacing(3),
  },
  icon: {
      margin: theme.spacing(2),
  },
  container: {
      marginTop: theme.spacing(2),
  },
  link: {
      marginLeft: theme.spacing(0.5)
  },
  form: {
      paddingTop: theme.spacing(5)
  },
});

class Home extends React.Component {
    componentDidMount() {
        if (this.props.isLoggedIn && this.props.accessToken !== null) {
            const token = this.props.accessToken
            this.props.hitApi(token)
        }
        this.props.getRecentPlaylists();
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken
            && prevProps.location !== this.props.location
        ){
            this.props.getRecentPlaylists();
        }
    }

    render(){
        const { classes } = this.props;
        return (
            <div>
              <AppBar className={classes.bar} position="sticky">
                 <HomeIcon className={classes.icon} fontSize="large"/>
              </AppBar>
            <Container className={classes.container}>
                <Container className={classes.subContainer}>
                <Typography gutterBottom variant="h4" component="h2">
                  Welcome!
                </Typography>
                <Typography gutterBottom variant="body1" component="h2">
                  Backtube is a streaming app for music lovers who can create and follow playlists of their favorite songs from Youtube or Bandcamp.
                </Typography>
                <Typography gutterBottom variant="body1" component="h2">
                  Don't have an account yet?
                  <ModalLink className={classes.link} to='/register'>
                    {"Register"}
                  </ModalLink>
                  !
                </Typography>
                <Box display="flex" justifyContent="center">
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <SearchIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Search music from Youtube, Bandcamp or playlists created by other backtubers." />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <PlaylistAddIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Add tracks to the player." />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <SaveIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Create a playlist by saving the tracks queued in the player." />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <StarBorderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Follow playlists created by other backtubers." />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <QueueMusicIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Access your saved and followed playlists." />
                      </ListItem>
                    </List>
                </Box>
                <Typography className={classes.form} gutterBottom variant="body1" component="h2">
                  Found a bug? Want to suggest a feature or simply give some feedback? Much appreciated if you could fill the
                  <a target={'_blank'} rel="noopener noreferrer" className={classes.link} href='https://forms.gle/NJNK7Y9JhXj8zWgL6'>
                    {"form"}
                </a>
                  .
                </Typography>
            </Container>
                <Box p={3}>
                    <Typography component={'span'}>
                      <GridPlaylists
                          playlistLists={{'New Playlists': this.props.backtube}}
                          loading={this.props.loading}
                          source="backtube"
                        />
                    </Typography>
                </Box>
              </Container>
            </div>

        );
    }
}

const mapDispatchToProps = dispatch => {
  return {
    hitApi: token => dispatch(hitApi(token)),
    getRecentPlaylists: () => dispatch(getRecentPlaylists())
  };
}

const mapStateToProps = state => {
  return {
      isLoggedIn: state.auth.isLoggedIn,
      username: state.profile.username,
      userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
      accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
      loading: state.playlist.isFetchingRecent,
      backtube: state.playlist.playlistsRecent ? state.playlist.playlistsRecent : [],
   }
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })((Home)))));
