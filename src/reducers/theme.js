import {
    THEME_UPDATE_STARTED,
    THEME_UPDATE_FAILED,
    THEME_UPDATE_SUCCESS,
    THEME_CREATE_STARTED,
    THEME_CREATE_FAILED,
    THEME_CREATE_SUCCESS,
    THEME_GET_RECENT_STARTED,
    THEME_GET_RECENT_SUCCESS,
    THEME_GET_RECENT_FAILED,
    THEME_GET_CURRENT_STARTED,
    THEME_GET_CURRENT_SUCCESS,
    THEME_GET_CURRENT_FAILED,
    THEME_GET_ALL_STARTED,
    THEME_GET_ALL_SUCCESS,
    THEME_GET_ALL_FAILED,
    THEME_MUST_RELOAD,
    THEME_RESET_MUST_RELOAD,
} from '../constants/actionTypes'

const initialState = {
  isFetching: false,
  isFetchingRecent: false,
  isFetchingCurrent: false,
  isSaving: false,
  isSaved: false,
  error: null,
  mustReload: false
}

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case THEME_UPDATE_STARTED:
      return {
          ...state,
          isSaving: true,
          isSaved: false,
          error: null
      }
    case THEME_UPDATE_SUCCESS:
      return {
          ...state,
          isSaving: false,
          error: null,
          isSaved: true,
      }
    case THEME_UPDATE_FAILED:
      return {
        ...state,
        isSaving: false,
        isSaved: false,
        error: action.payload.error,
      }
    case THEME_CREATE_STARTED:
        return {
            ...state,
            isSaved: false,
            isSaving: true,
            error: null,
        }
    case THEME_CREATE_SUCCESS:
        return {
            ...state,
            isSaved: true,
            isSaving: false,
            error: null,
        }
    case THEME_CREATE_FAILED:
        return {
          ...state,
          isSaved: false,
          isSaving: false,
          error: action.payload.error,
        }
    case THEME_GET_RECENT_STARTED:
        return {
            ...state,
            error: null,
            isFetchingRecent: true,
        }
    case THEME_GET_RECENT_SUCCESS:
        return {
            ...state,
            error: null,
            isFetchingRecent: false,
            themesRecent: action.payload
        }
    case THEME_GET_RECENT_FAILED:
        return {
          ...state,
          isFetchingRecent: false,
          error: action.payload.error,
        }
    case THEME_GET_CURRENT_STARTED:
        return {
            ...state,
            error: null,
            isFetchingCurrent: true,
        }
    case THEME_GET_CURRENT_SUCCESS:
        return {
            ...state,
            error: null,
            isFetchingCurrent: false,
            themeCurrent: action.payload
        }
    case THEME_GET_CURRENT_FAILED:
        return {
          ...state,
          isFetchingCurrent: false,
          error: action.payload.error,
        }
    case THEME_GET_ALL_STARTED:
        return {
            ...state,
            error: null,
            isFetching: true,
        }
    case THEME_GET_ALL_SUCCESS:
        return {
            ...state,
            error: null,
            isFetching: false,
            allThemes: action.payload
        }
    case THEME_GET_ALL_FAILED:
        return {
          ...state,
          isFetching: false,
          error: action.payload.error,
        }
    case THEME_MUST_RELOAD:
        return { ...state, mustReload: true }

    case THEME_RESET_MUST_RELOAD:
        return { ...state, mustReload: false }

    default:
      return state
  }
}

export default themeReducer
