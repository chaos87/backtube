import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { ModalLink } from "react-router-modal-gallery";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withRouter } from "react-router-dom";
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import HomeIcon from '@material-ui/icons/Home';
import { MixPanel } from './MixPanel';
import { connect } from 'react-redux';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.paper
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  text: {
      color: 'white'
  },
  icon: {
      color: 'white'
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#444'
  },
  titleLink: {
    textDecoration: 'none'
  },
});

class SideBar extends Component {

 handleClick = (item) => {
        if (item === "Home") {
            this.props.history.push('/')
        }
        if (item === "My Library") {
            this.props.history.push('/library')
        }
        if (item === "Give Feedback") {
            MixPanel.track('View Give Feedback')
            window.open('https://forms.gle/NJNK7Y9JhXj8zWgL6');
        }
        this.props.handleCloseSideBar()
    }
render(){
    const { classes } = this.props;
    return (
          <SwipeableDrawer
            className={classes.drawer}
            anchor="left"
            open={this.props.open}
            classes={{
              paper: classes.drawerPaper,
            }}
            onClose={this.props.handleCloseSideBar}
            onOpen={this.props.handleCloseSideBar}
          >
            <List>
                <ListItem
                    button
                    key='Home'
                    onClick={() => this.handleClick('Home')}
                >
                  <ListItemIcon className={classes.icon}><HomeIcon /></ListItemIcon>
                  <ListItemText primary='Home' className={classes.text} />
                </ListItem>
                {this.props.isLoggedIn ?
                <ListItem
                    button
                    key='My Library'
                    onClick={() => this.handleClick('My Library')}
                >
                  <ListItemIcon className={classes.icon}><LibraryMusicIcon /></ListItemIcon>
                  <ListItemText primary='My Library' className={classes.text} />
              </ListItem>
                :
                <ModalLink to='/login' className={classes.titleLink}>
                    <ListItem
                        button
                        key='My Library'
                    >
                      <ListItemIcon className={classes.icon}><LibraryMusicIcon /></ListItemIcon>
                      <ListItemText primary='My Library' className={classes.text} />
                  </ListItem>
                </ModalLink>}
            </List>
            <Divider />
            <List>
                <ListItem
                    button
                    key='Give Feedback'
                    onClick={() => this.handleClick('Give Feedback')}
                >
                  <ListItemIcon className={classes.icon}>{<FeedbackIcon />}</ListItemIcon>
                  <ListItemText primary='Give Feedback' className={classes.text} />
                </ListItem>
            </List>
          </SwipeableDrawer>
      );
  }
}

function mapStateToProps(state, props) {
  return {
    isLoggedIn: state.auth.isLoggedIn,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(SideBar)));
