import {
    PROFILE_UPDATE_STARTED,
    PROFILE_UPDATE_FAILED,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_READ_STARTED,
    PROFILE_READ_FAILED,
    PROFILE_READ_SUCCESS,
    PROFILE_GET_CURRENT_STARTED,
    PROFILE_GET_CURRENT_FAILED,
    PROFILE_GET_CURRENT_SUCCESS
} from '../constants/actionTypes';
import { updateProfileApi, readProfileApi, getCurrentProfileApi } from '../api/profile';
import { checkAuth, refreshAuthTokenStarted } from './auth';


export function readProfile(userInfo) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(readProfileStarted())
    return readProfileApi(userInfo)
      .then(data => {
          dispatch(readProfileSuccess(data));
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
          dispatch(updateProfileSuccess(data));
      })
      .catch(err => {
          dispatch(updateProfileFailed(err.message));
      });
  }
}

const updateProfileSuccess = (data) => ({
  type: PROFILE_UPDATE_SUCCESS,
  payload: data
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

const readProfileSuccess = (data) => ({
  type: PROFILE_READ_SUCCESS,
  payload: data
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

export function getCurrentProfile(userInfo) {
  return function(dispatch) {
    dispatch(getCurrentProfileStarted())
    return getCurrentProfileApi(userInfo)
      .then(data => {
          dispatch(getCurrentProfileSuccess(data));
      })
      .catch(err => {
          dispatch(getCurrentProfileFailed(err.message));
      });
  }
}

const getCurrentProfileSuccess = (data) => ({
  type: PROFILE_GET_CURRENT_SUCCESS,
  payload: data
});

const getCurrentProfileStarted = () => ({
  type: PROFILE_GET_CURRENT_STARTED
});

const getCurrentProfileFailed = error => ({
  type: PROFILE_GET_CURRENT_FAILED,
  payload: {
    error
  }
});
