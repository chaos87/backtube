import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import HomeIcon from '@material-ui/icons/Home';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import FlexiLink from "./FlexiLink";
import { hitApi } from '../actions/helloWorld';
import { enableHome } from '../actions/home';
import { resetTabs } from '../actions/nav';
import { getRecentPlaylists, resetMustReload } from '../actions/playlist';
import { getRecentThemes, resetMustReload as themeResetMustReload } from '../actions/theme';
import { withLastLocation } from 'react-router-last-location';
import { ModalLink } from "react-router-modal-gallery";
import GridPlaylists from "./GridPlaylists";
import GridThemes from "./GridThemes";


const styles = theme => ({
  root: {
    flexGrow: 1,
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
  subContainer: {
      padding: theme.spacing(3),
  },
  icon: {
      margin: theme.spacing(2),
  },
  container: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4)
  },
  link: {
      marginLeft: theme.spacing(0.5),
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      "&:hover": {
          textDecoration: 'underline'
      }
  },
  form: {
      paddingTop: theme.spacing(5)
  },
  title: {
      fontWeight: "bold",
      marginBottom: theme.spacing(4)
  },
  button: {
      color: 'white',
      minWidth: 200,
      margin: theme.spacing(2)
  },
  titleLink: {
      textDecoration: 'none'
  },
  cta: {
      paddingTop: theme.spacing(2)
  },
  boxButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      [theme.breakpoints.only('xs')]: {
          flexDirection: 'column',
      },
  }
});

class Home extends React.Component {
    componentDidMount() {
        this.props.resetTabs();
        if (this.props.isLoggedIn && this.props.accessToken !== null) {
            const token = this.props.accessToken
            this.props.hitApi(token)
        }
        if (this.props.refreshHome){
            this.props.getRecentPlaylists();
            this.props.getRecentThemes();
            this.props.resetMustReload();
            this.props.themeResetMustReload();
        } else {
            this.props.enableHome();
        }
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
                  <Grid
                      justify="center"
                      alignItems="center"
                      container
                    >
                <HomeIcon className={classes.icon} fontSize="large"/>
            </Grid>
              </AppBar>
            <Container maxWidth='md' className={classes.container}>
                <Container className={classes.subContainer}>
                    <Typography color="primary" gutterBottom variant="h4" component="h2" className={classes.title}>
                      Welcome
                    </Typography>
                    <Typography variant="body1" component="h2">
                        Search and listen to your favorite tracks from Youtube Music and Bandcamp.
                    </Typography>
                    <Typography gutterBottom variant="body1" component="h2">
                        Create playlist themes and contribute with your own playlists.
                    </Typography>
                    {!this.props.isLoggedIn && <Typography variant="h6" component="h2" className={classes.cta}>
                      Don't have an account yet?
                      <ModalLink className={classes.link} to='/register'>
                        {"Register"}
                      </ModalLink>
                      !
                  </Typography>}
                    <Typography className={classes.form} gutterBottom variant="subtitle2" component="h2">
                      Found a bug? Want to suggest a feature or simply give some feedback? Much appreciated if you could fill the
                      <a target={'_blank'} rel="noopener noreferrer" className={classes.link} href='https://forms.gle/NJNK7Y9JhXj8zWgL6'>
                        {"form"}
                    </a>
                      .
                    </Typography>
                </Container>
                <Box p={3} className={classes.boxButton}>
                     <FlexiLink
                         isLoggedIn={this.props.isLoggedIn}
                         to={{
                            pathname: '/theme/cannotShareUrl',
                            theme: {
                                title: "Untitled theme #" + (this.props.themes.length + 1),
                                creator: {username: this.props.profile.username, _id: this.props.userid, avatar: this.props.profile.avatar},
                                playlists: [],
                                description: '',
                            },
                            editing: true,
                          }}
                          className={classes.titleLink}
                         >
                         <Fab
                           variant="extended"
                           color="secondary"
                           className={classes.button}
                         >
                          <AddIcon /> Create Theme
                         </Fab>
                     </FlexiLink>
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
                </Box>
                <Box p={1} style={{paddingTop: 48}}>
                  <GridThemes
                      themeLists={{'New Themes': this.props.themes}}
                      loading={this.props.loading}
                      row={true}
                      loadThemeOnClick={false}
                    />
                </Box>
                <Box p={1} style={{paddingTop: 48, marginBottom: 72}}>
                  <GridPlaylists
                      playlistLists={{'New Playlists': this.props.playlists}}
                      loading={this.props.loading}
                      source="backtube"
                      row={true}
                    />
                </Box>
              </Container>
            </div>

        );
    }
}

const mapDispatchToProps = dispatch => {
  return {
    hitApi: token => dispatch(hitApi(token)),
    getRecentPlaylists: () => dispatch(getRecentPlaylists()),
    getRecentThemes: () => dispatch(getRecentThemes()),
    enableHome: () => dispatch(enableHome()),
    resetTabs: () => dispatch(resetTabs()),
    resetMustReload: () => dispatch(resetMustReload()),
    themeResetMustReload: () => dispatch(themeResetMustReload()),
  };
}

const mapStateToProps = state => {
  return {
      isLoggedIn: state.auth.isLoggedIn,
      owned: state.playlist.playlistsOwned ? state.playlist.playlistsOwned: [],
      profile: state.profile.profile ? state.profile.profile : {username: "", avatar: "/broken-image.jpg"},
      userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
      accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
      loading: state.playlist.isFetchingRecent,
      playlists: state.playlist.playlistsRecent ? state.playlist.playlistsRecent : [],
      themes: state.theme.themesRecent ? state.theme.themesRecent : [],
      refreshHome: state.home.refreshHome,
   }
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })((Home)))));
