import React from 'react';
import TabPane from './TabPane';
import {withStyles} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { getPlaylists, resetMustReload } from '../actions/playlist';
import { startSearch, endSearch } from '../actions/search';
import { resetTabs } from '../actions/nav';
import { enableLibrary } from '../actions/library';
import { withLastLocation } from 'react-router-last-location';
import { MixPanel } from './MixPanel';

const styles = theme => ({
  panel: {
    position: 'absolute',
  }
});

class UserLibrary extends React.Component {
    componentDidMount() {
        if (this.props.accessToken){
            if (this.props.refreshLibrary){
                this.props.resetTabs();
                this.props.resetMustReload();
                this.fetchPlaylists();
            } else {
                this.props.enableLibrary();
            }
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
        else if (
                nextProps.lastLocation.pathname.startsWith("/deletePlaylist")
                && nextProps.location.pathname === '/library'
                && !nextProps.isDeleted
                && nextProps.owned.length === this.props.owned.length
            ){
                return false
            }
        else if (
                nextProps.lastLocation.pathname === '/library'
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
        MixPanel.track('View My Library', {
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
    endSearch: () => dispatch(endSearch()),
    resetTabs: () => dispatch(resetTabs()),
    enableLibrary: () => dispatch(enableLibrary()),
    resetMustReload: () => dispatch(resetMustReload()),
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
    refreshLibrary: state.library.refreshLibrary,
  };
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(UserLibrary))));
