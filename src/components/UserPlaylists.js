import React from 'react';
import TabPane from './TabPane';
import {withStyles} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { getPlaylists } from '../actions/playlist';
import { startSearch, endSearch } from '../actions/search';
import { withLastLocation } from 'react-router-last-location';
import { MixPanel } from './MixPanel';

const styles = theme => ({
  panel: {
    position: 'absolute',
  }
});

class UserPlaylists extends React.Component {
    componentDidMount() {
        if (this.props.accessToken){
            this.fetchPlaylists();
        } else {
            this.props.history.push('/login');
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken
            && prevProps.location !== this.props.location
        ){
            this.fetchPlaylists();
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if (!nextProps.lastLocation) {
            return true
        }
        else if (nextProps.lastLocation.pathname === '/playlists'
            && nextProps.location.pathname === '/savePlaylist'){
                return false
            }
        else if (
                nextProps.lastLocation.pathname === '/savePlaylist'
                && nextProps.location.pathname === '/playlists'
                && !nextProps.isSaved
                && nextProps.owned.length === this.props.owned.length
                && JSON.stringify(nextProps.owned) === JSON.stringify(this.props.owned)
            ){
                return false
            }
        else if (
                nextProps.lastLocation.pathname.startsWith("/deletePlaylist")
                && nextProps.location.pathname === '/playlists'
                && !nextProps.isDeleted
                && nextProps.owned.length === this.props.owned.length
            ){
                return false
            }
        else if (
                nextProps.lastLocation.pathname === '/playlists'
                && nextProps.location.pathname.startsWith("/deletePlaylist")
            )
             {
                 return false
        } else {
            return true
        }
    }

    fetchPlaylists = async () => {
        this.props.startSearch();

        await this.props.getPlaylists({
            accessToken: this.props.accessToken,
            userSub: this.props.userid
        });
        MixPanel.track('View My Playlists', {
            'Total Playlist Owned': this.props.owned.length,
            'Total Playlist Followed': this.props.followed.length,
        })
        this.props.endSearch();
    }

    render() {
        const { classes } = this.props;
        return(
            <TabPane
                className={classes.panel}
                data={{
                    owned: this.props.owned,
                    followed: this.props.followed,
                }}
                labels={{owned: 'My Playlists', followed: 'Followed'}}
                loadingIndicators={{owned: this.props.loading, followed: this.props.loading}}
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
  return {
    getPlaylists: (userInfo) => dispatch(getPlaylists(userInfo)),
    startSearch: () => dispatch(startSearch()),
    endSearch: () => dispatch(endSearch())
  };
}

function mapStateToProps(state, props) {
  return {
    owned: state.playlist.playlistsOwned ? state.playlist.playlistsOwned: [],
    followed: state.playlist.playlistsFollowed ? state.playlist.playlistsFollowed: [],
    loading: state.playlist.isFetching,
    isDeleted: state.playlist.isDeleted,
    isSaved: state.playlist.isSaved,
    userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
    accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
  };
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(UserPlaylists))));
