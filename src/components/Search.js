import React from 'react';
import TabPane from './TabPane';
import {withStyles} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { fetchYTsongs, fetchBCsongs, fetchBTsongs } from '../actions/fetch';
import { startSearch, endSearch, enableSearch } from '../actions/search';
import { getPlaylists } from '../actions/playlist';
import {getSearchParam} from '../services/url';
import { withLastLocation } from 'react-router-last-location';
import { resetTabs } from '../actions/nav';
import { MixPanel } from './MixPanel';

const styles = theme => ({
  panel: {
    position: 'absolute',
  }
});

class Search extends React.Component {
    getSearchQuery() {
        return getSearchParam(this.props.location, 'search_query');
    }

    componentDidMount() {
        if (!this.getSearchQuery()) {
          // redirect to home component if search query is not there
          this.props.history.push('/');
          return;
        }
        // if coming from login or register, dont fire search
        if (this.props.refreshSearch){
            this.props.resetTabs();
            this.fetchSongs();
        } else {
            this.props.enableSearch();
        }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.location !== this.props.location
          && this.props.lastLocation.pathname !== "/login"
          && this.props.lastLocation.pathname !==  "/register"
          && this.props.lastLocation.pathname !==  "/savePlaylist"
          && this.props.refreshSearch) {
        this.fetchSongs();
      }
    }

    fetchSongs = async () => {
        const searchQuery = this.getSearchQuery()
        this.props.startSearch();
        if (this.props.accessToken) {
            this.props.getPlaylists({
                accessToken: this.props.accessToken,
                userSub: this.props.userid
            });
            await Promise.all([
                this.props.fetchYTsongs(searchQuery),
                this.props.fetchBCsongs(searchQuery),
                this.props.fetchBTsongs({
                    searchString: searchQuery,
                    accessToken: this.props.accessToken
                }),
            ]);
        } else {
            await Promise.all([
                this.props.fetchYTsongs(searchQuery),
                this.props.fetchBCsongs(searchQuery),
            ]);
        }
        await this.props.endSearch();
        MixPanel.track('Search Song', {
            'Search Query': searchQuery,
        });
    }

    render() {
        const { classes } = this.props;
        let data = {}
        let labels = {}
        let loadingIndicators = {}
        if (this.props.accessToken && this.props.backtube) {
            data = {
                'youtube': this.props.youtube,
                'bandcamp': this.props.bandcamp,
                'backtube': this.props.backtube,
            }
            labels = {
                'youtube': 'Youtube Music',
                'bandcamp': 'Bandcamp',
                'backtube': 'Backtube',
            }
            loadingIndicators = {
                'youtube': this.props.YTloading,
                'bandcamp': this.props.BCloading,
                'backtube': this.props.BTloading,
            }
        } else {
            data = {
                'youtube': this.props.youtube,
                'bandcamp': this.props.bandcamp,
            }
            labels = {
                'youtube': 'Youtube Music',
                'bandcamp': 'Bandcamp',
            }
            loadingIndicators = {
                'youtube': this.props.YTloading,
                'bandcamp': this.props.BCloading,
            }
        }
        return(
            <TabPane
                className={classes.panel}
                data={data}
                labels={labels}
                loadingIndicators={loadingIndicators}
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchYTsongs: searchQuery => dispatch(fetchYTsongs(searchQuery)),
    fetchBCsongs: searchQuery => dispatch(fetchBCsongs(searchQuery)),
    fetchBTsongs: searchQuery => dispatch(fetchBTsongs(searchQuery)),
    startSearch: () => dispatch(startSearch()),
    endSearch: () => dispatch(endSearch()),
    getPlaylists: (userInfo) => dispatch(getPlaylists(userInfo)),
    enableSearch: () => dispatch(enableSearch()),
    resetTabs: () => dispatch(resetTabs()),
  };
}

function mapStateToProps(state, props) {
  return {
    youtube: state.fetchYT.data,
    bandcamp: state.fetchBC.data,
    backtube: state.fetchBT.data ? state.fetchBT.data : [],
    YTloading: state.fetchYT.loading,
    BCloading: state.fetchBC.loading,
    BTloading: state.fetchBT.loading,
    accessToken: state.auth.session !== null ? state.auth.session.accessToken.jwtToken: null,
    userid: state.auth.session !== null ? state.auth.session.accessToken.payload.sub: null,
    followed: state.playlist.playlistsFollowedIdTitle ? state.playlist.playlistsFollowedIdTitle: [],
    refreshSearch: state.search.refreshSearch,
  };
}

export default withLastLocation(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Search))));
