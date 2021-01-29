import React from 'react';
import './AppLayout.scss';
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import Header from './Header';
import SideBar from './SideBar';
import ScrollToTop from './ScrollToTop';
import {withStyles} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { syncPlaylist, syncCurrentTrack } from '../actions/player';
import { resetTabs } from '../actions/nav';
import { MixPanel } from './MixPanel';

const styles = theme => ({
  player: {
    position: 'absolute',
    zIndex: 2000,
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    cursor: 'move',
  },
  saveIcon: {
      color: 'white',
      "&:hover": {color: 'secondary'}
  }
});

export const AudioContext = React.createContext(null);

class AppLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            open: false,

        }
        this.audio = {}
    }

    componentDidMount(){
        this.props.resetTabs()
        if (this.props.currentTrack && !this.props.audioLists.map(el => el._id).includes(this.props.currentTrack._id)){
            this.props.syncCurrentTrack({})
        }
    }

    handleSearch = async (event) => {
        if(event.key === 'Enter'){
            const escapedSearchQuery = encodeURIComponent(this.state.searchValue);
            this.props.history.push(`/results?search_query=${escapedSearchQuery}`);
        }
    };

    handleOnChange = newValue => {
      this.setState({ searchValue: newValue });
    };

    handleOpenSideBar = event => {
        this.setState({open: true})
    };

    handleCloseSideBar = event => {
        this.setState({open: false})
    };

    handleOnAudioPlay = event => {
        if (event._id === this.props.currentTrack._id) {
            event.playlistId = this.props.currentTrack.playlistId
        }
        console.log(event)
        this.props.syncCurrentTrack(Object.assign(event, {playing: true}))
    }

    handleOnAudioPause = event => {
        if (event._id === this.props.currentTrack._id) {
            event.playlistId = this.props.currentTrack.playlistId
        }
        this.props.syncCurrentTrack(Object.assign(event, {playing: false}))
    }

    handleOnAudioListsChange = (currentPlayId, audioLists, audioInfo) => {
        this.props.syncCurrentTrack(Object.assign(audioInfo, {playing: true}))
        this.props.syncPlaylist(currentPlayId, audioLists, audioInfo)
    }

    handleOnAudioEnded = (currentPlayId, audioLists, audioInfo) => {
        let songPlayedDate = new Date().toISOString();
        MixPanel.track('Play Song', {
            'Song ID': audioInfo._id,
            'Song Artist': audioInfo.singer,
            'Song Album': audioInfo.album,
            'Song Source': audioInfo.source,
            'Song Cover': audioInfo.cover,
            'Song URL': audioInfo.musicSrc,
            'Song Duration': audioInfo.duration,
            'Song Title': audioInfo.name,
        });
        MixPanel.people.set_once({
            'First Song Play': songPlayedDate,
        });
        MixPanel.people.set({
            'Last Song Play': songPlayedDate,
        });
        MixPanel.people.increment('Total Song Plays');
    }

  render() {
      const { classes } = this.props;
      const initOptions = {
            //audio lists model
            clearPriorAudioLists: true,
            toggleMode: true,
            preload: false,
            autoPlay: true,
            showDownload: false,
            showThemeSwitch: false,
            showPlayMode: true,
            spaceBar: true,
            showMediaSession: true,
            loadAudioErrorPlayNext: false,
            autoPlayInitLoadPlayList: true,
            quietUpdate: true,
            seeked: true,
            defaultPosition: {bottom:0,right:0},
            getAudioInstance: (audio) => {
                this.audio = audio
            },
      }
      return (
          <AudioContext.Provider value={this.audio}>
            <ScrollToTop>
              <div className="App">
                  <Header
                      onSearch={this.handleSearch}
                      onChange={this.handleOnChange}
                      searchValue={this.state.searchValue}
                      isSearching={this.props.isSearching}
                      openSideBar={this.handleOpenSideBar}
                  />
                  <SideBar
                      open={this.state.open}
                      handleCloseSideBar={this.handleCloseSideBar}
                  />
                {this.props.children}
                <ReactJkMusicPlayer
                    className={classes.player}
                    audioLists={this.props.audioLists}
                    onAudioListsChange={this.handleOnAudioListsChange}
                    onAudioEnded={this.handleOnAudioEnded}
                    onAudioPlay={this.handleOnAudioPlay}
                    onAudioPause={this.handleOnAudioPause}
                    {...initOptions}
                />
              </div>
            </ScrollToTop>
          </AudioContext.Provider>
      );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    syncPlaylist: (currentPlayId, audioLists, audioInfo) => dispatch(syncPlaylist(currentPlayId, audioLists, audioInfo)),
    syncCurrentTrack: audioInfo => dispatch(syncCurrentTrack(audioInfo)),
    resetTabs: () => dispatch(resetTabs()),
  };
}

function mapStateToProps(state, props) {
  return {
    audioLists: state.player.audioLists ? state.player.audioLists : [],
    clearPriorAudioLists: state.player.clearPriorAudioLists,
    isSearching: state.search.isSearching,
    isLoggedIn: state.auth.isLoggedIn,
    currentTrack: state.player.currentTrack,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AppLayout)));
