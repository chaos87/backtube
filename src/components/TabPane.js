import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import GridPlaylists from "./GridPlaylists"
import FlexiLink from "./FlexiLink";
import CircularProgress from '@material-ui/core/CircularProgress';
import { setTab } from '../actions/nav';
import { connect } from 'react-redux';

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

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  box: {
      marginLeft: theme.spacing(2),
      display: 'flex',
      justifyContent:'center',
      alignItems:'center'
  },
  label: {
      marginRight: theme.spacing(1)
  },
  appbar: {
      top: theme.spacing(8),
      [theme.breakpoints.only('sm')]: {
          top: theme.spacing(9),
      },
  },
  container: {
      marginTop: theme.spacing(2),
  },
  button: {
      color: 'white',
      marginBottom: theme.spacing(4),
      position: 'sticky',
      top: 120,
      zIndex: 1000
  },
  titleLink: {
      textDecoration: 'none'
  },
});

class TabPane extends Component {

  handleChange = (event, newValue) => {
    this.props.setTab(newValue)
  };

  render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <AppBar position="sticky" className={classes.appbar}>

            <Tabs
                value={this.props.tab}
                onChange={this.handleChange}
                aria-label="simple tabs example"
                variant="scrollable"
                scrollButtons="on"
                className={classes.tabs}
            >
                {Object.keys(this.props.data).map((item, i) => (
                    <Tab label={
                        <Box className={classes.box}>
                          <Box display="inline" className={classes.label}>{this.props.labels[item] ? this.props.labels[item]: 'playlists'}</Box>
                            {this.props.loadingIndicators[item] && <CircularProgress display="inline" color='inherit' size={20}/>}
                        </Box>} key={item}   {...a11yProps({i})}
                    />
                ))}
            </Tabs>
          </AppBar>
          <Container className={classes.container}>
              {Object.keys(this.props.data).map((item, i) => (
                  <TabPanel value={this.props.tab} index={i} key={item}>
                    {item === 'owned' &&
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
                    }
                    <GridPlaylists
                        playlistLists={this.props.data[item] instanceof Array? {playlists: this.props.data[item]}: this.props.data[item]}
                        loading={this.props.loadingIndicators[item]}
                        source={item}
                        row={false}
                    />
                  </TabPanel>
              ))}
          </Container>
        </div>);
    }
}

function mapDispatchToProps(dispatch) {
  return {
    setTab: (value) => dispatch(setTab(value)),
  };
}

function mapStateToProps(state, props) {
  return {
    tab: state.nav.tab,
    isLoggedIn: state.auth.isLoggedIn,
    owned: state.playlist.playlistsOwned ? state.playlist.playlistsOwned: [],
    profile: state.profile.profile !== null ? state.profile.profile : {username: "", avatar: "/broken-image.jpg"},
    userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TabPane))
