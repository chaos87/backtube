import {
     FETCH_YT_SONGS_STARTED,
     FETCH_YT_SONGS_FAILED,
     FETCH_YT_SONGS_SUCCESS,
     FETCH_BC_SONGS_STARTED,
     FETCH_BC_SONGS_FAILED,
     FETCH_BC_SONGS_SUCCESS,
     FETCH_BT_SONGS_STARTED,
     FETCH_BT_SONGS_FAILED,
     FETCH_BT_SONGS_SUCCESS,
} from '../constants/actionTypes';
import {
    makeYoutubeSearchApiCall,
    makeBandcampSearchApiCall,
    searchPlaylistsApi
} from '../api/fetch';
import { checkAuth, refreshAuthTokenStarted } from './auth';

export function fetchYTsongs(searchQuery) {
  return function(dispatch) {
    dispatch(fetchYTsongsStarted());
    return makeYoutubeSearchApiCall(searchQuery)
      .then(data => {
          dispatch(fetchYTsongsSuccess(data));
      })
      .catch(err => {
          dispatch(fetchYTsongsFailed(err.message))
      });
  }
}

const fetchYTsongsSuccess = songs => ({
  type: FETCH_YT_SONGS_SUCCESS,
  payload: songs
});

const fetchYTsongsStarted = () => ({
  type: FETCH_YT_SONGS_STARTED
});

const fetchYTsongsFailed = error => ({
  type: FETCH_YT_SONGS_FAILED,
  payload: {
    error
  }
});

export function fetchBCsongs(searchQuery) {
  return function(dispatch) {
    dispatch(fetchBCsongsStarted());
    return makeBandcampSearchApiCall(searchQuery)
      .then(data => {
          dispatch(fetchBCsongsSuccess(data));
      })
      .catch(err => {
          dispatch(fetchBCsongsFailed(err.message))
      });
  }
}

const fetchBCsongsSuccess = songs => ({
  type: FETCH_BC_SONGS_SUCCESS,
  payload: songs
});

const fetchBCsongsStarted = () => ({
  type: FETCH_BC_SONGS_STARTED
});

const fetchBCsongsFailed = error => ({
  type: FETCH_BC_SONGS_FAILED,
  payload: {
    error
  }
});

export function fetchBTsongs(searchQuery) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(fetchBTsongsStarted());
    return searchPlaylistsApi(searchQuery)
      .then(data => {
          dispatch(fetchBTsongsSuccess(data));
      })
      .catch(err => {
          dispatch(fetchBTsongsFailed(err.message))
      });
  }
}

const fetchBTsongsSuccess = songs => ({
  type: FETCH_BT_SONGS_SUCCESS,
  payload: songs
});

const fetchBTsongsStarted = () => ({
  type: FETCH_BT_SONGS_STARTED
});

const fetchBTsongsFailed = error => ({
  type: FETCH_BT_SONGS_FAILED,
  payload: {
    error
  }
});
