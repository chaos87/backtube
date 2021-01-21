import {
    THEME_CREATE_STARTED,
    THEME_CREATE_FAILED,
    THEME_CREATE_SUCCESS,
    THEME_GET_RECENT_STARTED,
    THEME_GET_RECENT_FAILED,
    THEME_GET_RECENT_SUCCESS,
    THEME_GET_CURRENT_STARTED,
    THEME_GET_CURRENT_FAILED,
    THEME_GET_CURRENT_SUCCESS,
    THEME_GET_ALL_STARTED,
    THEME_GET_ALL_FAILED,
    THEME_GET_ALL_SUCCESS,
    THEME_UPDATE_SUCCESS,
    THEME_UPDATE_STARTED,
    THEME_UPDATE_FAILED,
    THEME_RESET_MUST_RELOAD,
    THEME_MUST_RELOAD
} from '../constants/actionTypes';
import {
    createThemeApi,
    updateThemeApi,
    getRecentThemesApi,
    getCurrentThemeApi,
    getAllThemesApi
} from '../api/theme';
import { checkAuth, refreshAuthTokenStarted } from './auth';


export function getRecentThemes() {
  return function(dispatch) {
    dispatch(getRecentThemesStarted())
    return getRecentThemesApi()
      .then(data => {
          dispatch(getRecentThemesSuccess(data));
      })
      .catch(err => {
          console.log(err.message)
          dispatch(getRecentThemesFailed(err.message));
      });
  }
}

export function getAllThemes(themeInfo) {
  return function(dispatch) {
    dispatch(getAllThemesStarted())
    return getAllThemesApi(themeInfo)
      .then(data => {
          dispatch(getAllThemesSuccess(data));
      })
      .catch(err => {
          console.log(err.message)
          dispatch(getAllThemesFailed(err.message));
      });
  }
}

export function getCurrentTheme(playlistId) {
  return function(dispatch) {
    dispatch(getCurrentThemeStarted())
    return getCurrentThemeApi(playlistId)
      .then(data => {
          if('message' in data){
              dispatch(getCurrentThemeFailed(data.message));
          } else {
              dispatch(getCurrentThemeSuccess(data));
          }
      })
      .catch(err => {
          console.log(err.message)
          dispatch(getCurrentThemeFailed(err.message));
      });
  }
}

export function updateTheme(userInfo) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(updateThemeStarted())
    return updateThemeApi(userInfo)
      .then(data => {
          dispatch(updateThemeSuccess(data));
      })
      .catch(err => {
          dispatch(updateThemeFailed(err.message));
      });
  }
}

export function createTheme(userInfo) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    dispatch(createThemeStarted())
    return createThemeApi(userInfo)
      .then(data => {
          dispatch(createThemeSuccess(data));
      })
      .catch(err => {
          dispatch(createThemeFailed(err.message));
      });
  }
}

const updateThemeSuccess = (data) => ({
  type: THEME_UPDATE_SUCCESS,
});

const updateThemeStarted = () => ({
  type: THEME_UPDATE_STARTED
});

const updateThemeFailed = error => ({
  type: THEME_UPDATE_FAILED,
  payload: {
    error
  }
});

const createThemeSuccess = (data) => ({
  type: THEME_CREATE_SUCCESS,
});

const createThemeStarted = () => ({
  type: THEME_CREATE_STARTED
});

const createThemeFailed = error => ({
  type: THEME_CREATE_FAILED,
  payload: {
    error
  }
});

const getRecentThemesSuccess = (data) => ({
  type: THEME_GET_RECENT_SUCCESS,
  payload: data
});

const getRecentThemesStarted = () => ({
  type: THEME_GET_RECENT_STARTED
});

const getRecentThemesFailed = error => ({
  type: THEME_GET_RECENT_FAILED,
  payload: {
    error
  }
});

const getCurrentThemeSuccess = (data) => ({
  type: THEME_GET_CURRENT_SUCCESS,
  payload: data
});

const getCurrentThemeStarted = () => ({
  type: THEME_GET_CURRENT_STARTED
});

const getCurrentThemeFailed = error => ({
  type: THEME_GET_CURRENT_FAILED,
  payload: {
    error
  }
});

const getAllThemesSuccess = (data) => ({
  type: THEME_GET_ALL_SUCCESS,
  payload: data
});

const getAllThemesStarted = () => ({
  type: THEME_GET_ALL_STARTED
});

const getAllThemesFailed = error => ({
  type: THEME_GET_ALL_FAILED,
  payload: {
    error
  }
});

export const resetMustReload = () => ({
    type: THEME_RESET_MUST_RELOAD
})

export const mustReload = () => ({
    type: THEME_MUST_RELOAD
})
