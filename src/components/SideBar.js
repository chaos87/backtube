import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withRouter } from "react-router-dom";
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import HomeIcon from '@material-ui/icons/Home';
import { MixPanel } from './MixPanel';

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
  }
});

class SideBar extends Component {

 handleClick = (item) => {
        if (item === "Home") {
            this.props.history.push('/')
        }
        if (item === "My Playlists") {
            this.props.history.push('/playlists')
        }
        if (item === "Give Feedback") {
            MixPanel.track('View Give Feedback')
            window.open('https://forms.gle/NJNK7Y9JhXj8zWgL6');
        }
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
              {['Home', 'My Playlists'].map((text, index) => (
                <ListItem
                    button
                    key={text}
                    onClick={() => this.handleClick(text)}
                >
                  <ListItemIcon className={classes.icon}>{index % 2 === 0 ? <HomeIcon /> : <QueueMusicIcon />}</ListItemIcon>
                  <ListItemText primary={text} className={classes.text} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {['Give Feedback'].map((text, index) => (
                <ListItem
                    button
                    key={text}
                    onClick={() => this.handleClick(text)}
                >
                  <ListItemIcon className={classes.icon}>{<FeedbackIcon />}</ListItemIcon>
                  <ListItemText primary={text} className={classes.text} />
                </ListItem>
              ))}
            </List>
          </SwipeableDrawer>
      );
  }
}
export default withRouter((withStyles(styles, { withTheme: true })(SideBar)));
