import {
    CLEAR_SESSION,
    SET_SESSION_STARTED,
    SET_SESSION_FAILED,
    SET_SESSION_SUCCESS,
    REFRESH_AUTH_TOKEN_STARTED,
    REFRESH_AUTH_TOKEN_SUCCESS,
    REFRESH_AUTH_TOKEN_FAILED
} from '../constants/actionTypes';

const initialState = {
  isLoggedIn: false,
  isFetching: false,
  error: null,
  session: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION_STARTED:
      return {
        ...state,
        isLoggedIn: false,
        isFetching: true,
        error: null,
    }
    case SET_SESSION_FAILED:
      return {
           ...state,
          error: action.payload.error,
          isLoggedIn: false,
          isFetching: false,
    }
    case SET_SESSION_SUCCESS:
      return {
         ...state,
        session: action.payload.session,
        isLoggedIn: true,
        isFetching: false,
        error: null
    }
    case REFRESH_AUTH_TOKEN_STARTED:
      return {
        ...state,
        error: null
    }
    case REFRESH_AUTH_TOKEN_SUCCESS:
      return {
        ...state,
        session: action.payload.session,
        isLoggedIn: true,
        error: null
    }
    case REFRESH_AUTH_TOKEN_FAILED:
      return {
        ...state,
        isLoggedIn: false,
        error: action.payload.error
    }
    case CLEAR_SESSION:
      return initialState

    default:
      return state
  }
}

export default authReducer
