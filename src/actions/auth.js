import {
    CLEAR_SESSION,
    SET_SESSION_STARTED,
    SET_SESSION_SUCCESS,
    SET_SESSION_FAILED,
    CHECK_AUTH_TOKEN,
    REFRESH_AUTH_TOKEN_STARTED,
    REFRESH_AUTH_TOKEN_SUCCESS,
    REFRESH_AUTH_TOKEN_FAILED,
} from '../constants/actionTypes'
import { login, refresh } from '../api/auth'

export const clearSession = () => ({
  type: CLEAR_SESSION
})

export function loginUser(username, password) {
  return function (dispatch) {
    dispatch(setSessionStarted())
    return login(username, password)
      .then((session) => {
        if (!('accessToken' in session)) {
            dispatch(setSessionFailed(session.error))
        }
        else {
            dispatch(setSessionSuccess(session))
        }
      })
      .catch(err => {
          dispatch(setSessionFailed(err.message))
      });
  }
}

export function refreshAuthToken(username, token) {
  return function (dispatch) {
    return refresh(username, token)
      .then((session) => {
        if (!('accessToken' in session)) {
            dispatch(refreshAuthTokenFailed(session))
        }
        else {
            dispatch(refreshAuthTokenSuccess(session))
        }
      })
      .catch(err => {
          dispatch(refreshAuthTokenFailed(err.message))
      });
  }
}

const setSessionSuccess = session => ({
  type: SET_SESSION_SUCCESS,
  payload: {
      session
  }
});

const setSessionStarted = () => ({
  type: SET_SESSION_STARTED
});

const setSessionFailed = error => ({
  type: SET_SESSION_FAILED,
  payload: {
    error
  }
});

export const refreshAuthTokenStarted = () => ({
    type: REFRESH_AUTH_TOKEN_STARTED
})

const refreshAuthTokenSuccess = session => ({
  type: REFRESH_AUTH_TOKEN_SUCCESS,
  payload: {
      session
  }
});

const refreshAuthTokenFailed = error => ({
  type: REFRESH_AUTH_TOKEN_FAILED,
  payload: {
    error
  }
});

export const checkAuth = () => ({
  type: CHECK_AUTH_TOKEN
});
