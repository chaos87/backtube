import React, { Component } from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SearchBar from "material-ui-search-bar";
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import UserIcon from './UserIcon'


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(1),
    },
  },
  title: {
    flexGrow: 0.3,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
        display: 'flex',
        justifyContent:'left',
        alignItems:'center'
    },
  },
  titleLink: {
      color: '#FFF',
      textDecoration: 'none'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
      flexGrow: 0.3,
    },
  },
  inputRoot: {
    padding: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    "&:hover": {   // this works
     backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
  },
  inputInput: {
      color: 'white'
  },
  inputIcon: {
      color: 'white'
  },
  searchIcon: {
      flexGrow: 0,
  },
  accountButton: {
    marginLeft: 'auto',
    textDecoration: 'none'
  },
  bar: {
      [theme.breakpoints.down('sm')]: {
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(0.5),
      }
  }
});


class Header extends Component {
    render() {
        const { classes } = this.props;
        return (
            <AppBar position="sticky" className={classes.bar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.props.openSideBar}
                      >
                        <MenuIcon />
                  </IconButton>
                  <div className={classes.title}>
                      <Link to={this.props.isSearching ? this.props.history.location.pathname + this.props.history.location.search: "/"} className={classes.titleLink}>
                          <Typography  display="inline" variant="h6" noWrap>
                            BackTube
                          </Typography>
                      </Link>
                  </div>
                  <div className={classes.search}>
                    <SearchBar
                      placeholder="Search…"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                        icon: classes.inputIcon,
                      }}
                      searchIcon=<SearchIcon className={classes.searchIcon}/>
                      inputProps={{
                          'aria-label': 'search'
                      }}
                      onChange={this.props.onChange}
                      onRequestSearch={() =>
                        this.props.onSearch(this.props.searchValue)
                      }
                      value={this.props.searchValue}
                      onKeyPress={event => this.props.onSearch(event)}
                    />
                </div>
                <UserIcon
                    isLoggedIn={this.props.isLoggedIn}
                    className={classes.accountButton}
                />
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = state => {
  return {
      isLoggedIn: state.auth.isLoggedIn
   }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Header)));
