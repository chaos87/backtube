import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { ModalLink } from "react-router-modal-gallery";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { clearSession } from '../actions/auth';

const styles = theme => ({
  accountButtonClass: {
    marginLeft: 'auto',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
      width: 170,
    },
  },
  accountIconClass: {
      marginLeft: 'auto',
      textDecoration: 'none',
      [theme.breakpoints.down('sm')]: {
        marginLeft: theme.spacing(1),
        padding: 0
      },
  },
  wrapper: {
      marginLeft: 'auto'
  }
});

class UserIcon extends Component {
    constructor(props) {
        super(props)
        this.state = {
          anchorEl : null
        };
    }

    handleClick = (event) => {
      this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
      this.setState({anchorEl: null});
    };

    goToProfile = () => {
      this.setState({anchorEl: null});
      this.props.history.push('/profile');
    };

    handleLogout = () => {
      this.setState({anchorEl: null});
      this.props.logout();
    };
    render () {
        const { classes } = this.props;
        if (!this.props.isLoggedIn) {
            if (!this.props.isSearching) {
                return <ModalLink to='/login' className={classes.accountButtonClass}>
                  <Button
                      variant="outlined"
                      color="secondary"
                      disabled={false}
                   >
                      Sign In
                    </Button>
                </ModalLink>
            }
            else {
                return <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.accountButtonClass}
                    disabled={true}
                 >
                    Sign In
                  </Button>
            }
        }
        else {
            return <div className={classes.wrapper}>
            <IconButton
                disabled={this.props.isSearching}
                className={classes.accountIconClass}
                onClick={this.handleClick}
            >
              <Avatar
                alt={this.props.username.toUpperCase()}
                src={this.props.urlAvatar}
                aria-label="open account menu"
              >
            </Avatar>
           </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.goToProfile}>Profile</MenuItem>
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
              </Menu>
          </div>
        }
    }
}

function mapStateToProps(state, props) {
  return {
    username: state.profile.username ? state.profile.username : "",
    urlAvatar: state.profile.urlAvatar ? state.profile.urlAvatar : "/broken-image.jpg",
    isSearching: state.search.isSearching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(clearSession())
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(UserIcon)));
