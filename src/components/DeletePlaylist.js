import React, { Component } from "react";
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { getPlaylistsIdAndTitle, deletePlaylist } from '../actions/playlist';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 200
  },
  title: {
      marginBottom: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  wrapper: {
    margin: theme.spacing(1, 1, 1),
    position: 'relative',
  },
  form: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
});

class DeletePlaylist extends Component {

    componentDidMount() {
        if (this.props.accessToken){
            this.fetchPlaylists();
        } else {
            this.props.history.push('/login');
        }
    }

    fetchPlaylists = async () => {
        await this.props.getPlaylistsIdAndTitle({
            accessToken: this.props.accessToken,
            userSub: this.props.userid
        });
    }

  handleSubmit = (event) => {
      event.preventDefault();
      this.props.deletePlaylist(this.props.match.params.id, this.props.accessToken)
      .then(res => {
          if (this.props.isDeleted) {
              console.log('Playlist deleted!')
              setTimeout(function () { this.props.history.push('/playlists'); }.bind(this), 1000);
          }
      })
  };

  render(){
      const { classes } = this.props;
      const buttonClassname = clsx({[classes.buttonSuccess]: this.props.isDeleted});
      return(
            <Container component="main" maxWidth="sm">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <DeleteIcon />
                </Avatar>
                <Typography className={classes.title} component="h1" variant="h5">
                  Delete playlist
                </Typography>
                <Typography className={classes.title} component="h1" variant="h6">
                    {this.props.playlists.filter(el => el._id === this.props.match.params.id)[0] ?
                         this.props.playlists.filter(el => el._id === this.props.match.params.id)[0].title: ''}
                </Typography>
                <Typography className={classes.title} component="h1" variant="h6">
                  Are you sure?
                </Typography>
                <FormControl variant="outlined" className={classes.form}>
                  <div className={classes.wrapper}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={this.props.loading}
                        className={buttonClassname}
                        onClick={this.handleSubmit}
                      >
                        Delete
                      </Button>
                      {this.props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </div>
                </FormControl>
              </div>
            </Container>
        );
  }
}

function mapStateToProps(state, props) {
  return {
      isDeleted: state.playlist.isDeleted,
      loading: state.playlist.isDeleting,
      accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
      userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
      playlists: state.playlist.playlistsOwnedIdTitle ? state.playlist.playlistsOwnedIdTitle: [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deletePlaylist: (id, token) => dispatch(deletePlaylist(id, token)),
    getPlaylistsIdAndTitle: (userInfo) => dispatch(getPlaylistsIdAndTitle(userInfo)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(DeletePlaylist)));
