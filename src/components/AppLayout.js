import React from 'react';
import './AppLayout.scss';
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import Header from './Header';
import SideBar from './SideBar';
import ScrollToTop from './ScrollToTop';
import { ModalLink } from "react-router-modal-gallery";
import {withStyles} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { syncPlaylist } from '../actions/player';

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

class AppLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            open: false,
        }
    }

    handleSearch = async (event) => {
        if(event.key === 'Enter'){
            const escapedSearchQuery = encodeURI(this.state.searchValue);
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
            extendsContent: (
                <ModalLink to={this.props.isLoggedIn ? '/savePlaylist': '/login'}>
                    <IconButton
                        className={classes.saveIcon}
                        title="Save playlist"
                    >
                        <SaveIcon/>
                  </IconButton>
              </ModalLink>
          )
      }
      return (
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
                onAudioListsChange={this.props.syncPlaylist}
                {...initOptions}
            />
          </div>
        </ScrollToTop>
      );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    syncPlaylist: (currentPlayId, audioLists, audioInfo) => dispatch(syncPlaylist(currentPlayId, audioLists, audioInfo))
  };
}

function mapStateToProps(state, props) {
  return {
    audioLists: state.player.audioLists,
    isSearching: state.search.isSearching,
    isLoggedIn: state.auth.isLoggedIn,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(AppLayout)));
