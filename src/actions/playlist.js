import {
    PLAYLIST_CREATE_STARTED,
    PLAYLIST_CREATE_FAILED,
    PLAYLIST_CREATE_SUCCESS,
    PLAYLIST_GET_STARTED,
    PLAYLIST_GET_FAILED,
    PLAYLIST_GET_SUCCESS,
    PLAYLIST_GET_RECENT_STARTED,
    PLAYLIST_GET_RECENT_FAILED,
    PLAYLIST_GET_RECENT_SUCCESS,
    PLAYLIST_GET_CURRENT_STARTED,
    PLAYLIST_GET_CURRENT_FAILED,
    PLAYLIST_GET_CURRENT_SUCCESS,
    PLAYLIST_UPDATE_SUCCESS,
    PLAYLIST_UPDATE_STARTED,
    PLAYLIST_UPDATE_FAILED,
    PLAYLIST_DELETE_STARTED,
    PLAYLIST_DELETE_FAILED,
    PLAYLIST_DELETE_SUCCESS,
    PLAYLIST_FOLLOW_STARTED,
    PLAYLIST_FOLLOW_FAILED,
    PLAYLIST_FOLLOW_SUCCESS,
    PLAYLIST_CLEAR,
    PLAYLIST_CURRENT_REFRESH,
    PLAYLIST_CURRENT_NO_REFRESH,
    PLAYLIST_CURRENT_SET,
    PLAYLIST_RESET_MUST_RELOAD,
    PLAYLIST_MUST_RELOAD
} from '../constants/actionTypes';
import {
    createPlaylistApi,
    updatePlaylistApi,
    getPlaylistsApi,
    getRecentPlaylistsApi,
    deletePlaylistApi,
    addFollowerApi,
    removeFollowerApi,
    getCurrentPlaylistApi
} from '../api/playlist';
import { checkAuth, refreshAuthTokenStarted } from './auth';


export function getPlaylists(userInfo) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(getPlaylistsStarted())
    return getPlaylistsApi(userInfo)
      .then(data => {
          dispatch(getPlaylistsSuccess(data));
      })
      .catch(err => {
          console.log(err.message)
          dispatch(getPlaylistsFailed(err.message));
      });
  }
}

export function getRecentPlaylists() {
  return function(dispatch) {
    dispatch(getRecentPlaylistsStarted())
    return getRecentPlaylistsApi()
      .then(data => {
          dispatch(getRecentPlaylistsSuccess(data));
      })
      .catch(err => {
          console.log(err.message)
          dispatch(getRecentPlaylistsFailed(err.message));
      });
  }
}

export function getCurrentPlaylist(playlistInfo) {
  return function(dispatch) {
    dispatch(getCurrentPlaylistStarted())
    return getCurrentPlaylistApi(playlistInfo)
      .then(data => {
          if('message' in data){
              dispatch(getCurrentPlaylistFailed(data.message));
          } else {
              dispatch(getCurrentPlaylistSuccess(data));
          }
      })
      .catch(err => {
          console.log(err.message)
          dispatch(getCurrentPlaylistFailed(err.message));
      });
  }
}

export function updatePlaylist(userInfo) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(updatePlaylistStarted())
    return updatePlaylistApi(userInfo)
      .then(data => {
          dispatch(updatePlaylistSuccess(data));
      })
      .catch(err => {
          dispatch(updatePlaylistFailed(err.message));
      });
  }
}

export function createPlaylist(userInfo) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(createPlaylistStarted())
    return createPlaylistApi(userInfo)
      .then(data => {
          dispatch(createPlaylistSuccess(data));
      })
      .catch(err => {
          dispatch(createPlaylistFailed(err.message));
      });
  }
}

export function deletePlaylist(id, token) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(deletePlaylistStarted())
    return deletePlaylistApi(id, token)
      .then(data => {
          dispatch(deletePlaylistSuccess(data));
      })
      .catch(err => {
          console.log(err.message)
          dispatch(deletePlaylistFailed(err.message));
      });
  }
}

const updatePlaylistSuccess = (data) => ({
  type: PLAYLIST_UPDATE_SUCCESS,
});

const updatePlaylistStarted = () => ({
  type: PLAYLIST_UPDATE_STARTED
});

const updatePlaylistFailed = error => ({
  type: PLAYLIST_UPDATE_FAILED,
  payload: {
    error
  }
});

const deletePlaylistSuccess = (data) => ({
  type: PLAYLIST_DELETE_SUCCESS,
});

const deletePlaylistStarted = () => ({
  type: PLAYLIST_DELETE_STARTED
});

const deletePlaylistFailed = error => ({
  type: PLAYLIST_DELETE_FAILED,
  payload: {
    error
  }
});

const createPlaylistSuccess = (data) => ({
  type: PLAYLIST_CREATE_SUCCESS,
});

const createPlaylistStarted = () => ({
  type: PLAYLIST_CREATE_STARTED
});

const createPlaylistFailed = error => ({
  type: PLAYLIST_CREATE_FAILED,
  payload: {
    error
  }
});

const getPlaylistsStarted = () => ({
  type: PLAYLIST_GET_STARTED
});

const getPlaylistsFailed = error => ({
  type: PLAYLIST_GET_FAILED,
  payload: {
    error
  }
});

const getRecentPlaylistsSuccess = (data) => ({
  type: PLAYLIST_GET_RECENT_SUCCESS,
  payload: data
});

const getRecentPlaylistsStarted = () => ({
  type: PLAYLIST_GET_RECENT_STARTED
});

const getRecentPlaylistsFailed = error => ({
  type: PLAYLIST_GET_RECENT_FAILED,
  payload: {
    error
  }
});

const getCurrentPlaylistSuccess = (data) => ({
  type: PLAYLIST_GET_CURRENT_SUCCESS,
  payload: data
});

const getCurrentPlaylistStarted = () => ({
  type: PLAYLIST_GET_CURRENT_STARTED
});

const getCurrentPlaylistFailed = error => ({
  type: PLAYLIST_GET_CURRENT_FAILED,
  payload: {
    error
  }
});

const getPlaylistsSuccess = (data) => ({
  type: PLAYLIST_GET_SUCCESS,
  payload: data
});

export function addFollower(playlistId, token) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(addFollowerStarted(playlistId))
    return addFollowerApi(playlistId, token)
      .then(data => {
          dispatch(addFollowerSuccess(data));
      })
      .catch(err => {
          console.log(err.message)
          dispatch(addFollowerFailed(err.message));
      });
  }
}

const addFollowerStarted = (playlistId) => ({
  type: PLAYLIST_FOLLOW_STARTED,
  payload: playlistId
});

const addFollowerFailed = error => ({
  type: PLAYLIST_FOLLOW_FAILED,
  payload: {
    error
  }
});

const addFollowerSuccess = (data) => ({
  type: PLAYLIST_FOLLOW_SUCCESS,
  payload: data
});

export function removeFollower(playlistId, token) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(removeFollowerStarted(playlistId))
    return removeFollowerApi(playlistId, token)
      .then(data => {
          dispatch(removeFollowerSuccess(data));
      })
      .catch(err => {
          console.log(err.message)
          dispatch(removeFollowerFailed(err.message));
      });
  }
}

const removeFollowerStarted = (playlistId) => ({
  type: PLAYLIST_FOLLOW_STARTED,
  payload: playlistId
});

const removeFollowerFailed = error => ({
  type: PLAYLIST_FOLLOW_FAILED,
  payload: {
    error
  }
});

const removeFollowerSuccess = (data) => ({
  type: PLAYLIST_FOLLOW_SUCCESS,
  payload: data
});

export const clearPlaylists = () => ({
  type: PLAYLIST_CLEAR
});

export const disableCurrent = () => ({
  type: PLAYLIST_CURRENT_NO_REFRESH
})

export const enableCurrent = () => ({
  type: PLAYLIST_CURRENT_REFRESH
})

export const updateCurrent = (playlist) => ({
    type: PLAYLIST_CURRENT_SET, payload: playlist
})

export const resetMustReload = () => ({
    type: PLAYLIST_RESET_MUST_RELOAD
})

export const mustReload = () => ({
    type: PLAYLIST_MUST_RELOAD
})
