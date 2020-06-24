import {
    PROFILE_UPDATE_STARTED,
    PROFILE_UPDATE_FAILED,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_READ_STARTED,
    PROFILE_READ_FAILED,
    PROFILE_READ_SUCCESS
} from '../constants/actionTypes';
import { updateProfileApi, readProfileApi } from '../api/profile';
import { checkAuth, refreshAuthTokenStarted } from './auth';


export function readProfile(userInfo) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(readProfileStarted())
    return readProfileApi(userInfo)
      .then(data => {
          dispatch(readProfileSuccess(data.username, data.avatar));
      })
      .catch(err => {
          dispatch(readProfileFailed(err.message));
      });
  }
}


export function updateProfile(profileInfo) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(updateProfileStarted())
    return updateProfileApi(profileInfo)
      .then(data => {
          dispatch(updateProfileSuccess(data.username, data.url));
      })
      .catch(err => {
          dispatch(updateProfileFailed(err.message));
      });
  }
}

const updateProfileSuccess = (username, url) => ({
  type: PROFILE_UPDATE_SUCCESS,
  payload: {
      url,
      username
  }
});

const updateProfileStarted = () => ({
  type: PROFILE_UPDATE_STARTED
});

const updateProfileFailed = error => ({
  type: PROFILE_UPDATE_FAILED,
  payload: {
    error
  }
});

const readProfileSuccess = (username, url) => ({
  type: PROFILE_READ_SUCCESS,
  payload: {
      url,
      username
  }
});

const readProfileStarted = () => ({
  type: PROFILE_READ_STARTED
});

const readProfileFailed = error => ({
  type: PROFILE_READ_FAILED,
  payload: {
    error
  }
});
