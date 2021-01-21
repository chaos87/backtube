import {
    PLAYLIST_GET_STARTED,
    PLAYLIST_GET_FAILED,
    PLAYLIST_GET_SUCCESS,
    PLAYLIST_UPDATE_STARTED,
    PLAYLIST_UPDATE_FAILED,
    PLAYLIST_UPDATE_SUCCESS,
    PLAYLIST_CREATE_STARTED,
    PLAYLIST_CREATE_FAILED,
    PLAYLIST_CREATE_SUCCESS,
    PLAYLIST_DELETE_STARTED,
    PLAYLIST_DELETE_FAILED,
    PLAYLIST_DELETE_SUCCESS,
    PLAYLIST_FOLLOW_STARTED,
    PLAYLIST_FOLLOW_FAILED,
    PLAYLIST_FOLLOW_SUCCESS,
    PLAYLIST_GET_RECENT_STARTED,
    PLAYLIST_GET_RECENT_SUCCESS,
    PLAYLIST_GET_RECENT_FAILED,
    PLAYLIST_GET_CURRENT_STARTED,
    PLAYLIST_GET_CURRENT_SUCCESS,
    PLAYLIST_GET_CURRENT_FAILED,
    PLAYLIST_CLEAR,
    PLAYLIST_CURRENT_REFRESH,
    PLAYLIST_CURRENT_NO_REFRESH,
    PLAYLIST_CURRENT_SET,
    PLAYLIST_RESET_MUST_RELOAD,
    PLAYLIST_MUST_RELOAD
} from '../constants/actionTypes'

const initialState = {
  isFetching: false,
  isFetchingRecent: false,
  isFetchingCurrent: false,
  isSaving: false,
  isDeleting: false,
  isSaved: false,
  isDeleted: false,
  isFollowing: false,
  playlistFollowing: null,
  error: null,
  refreshCurrent: true,
  mustReload: false
}

const playlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLAYLIST_UPDATE_STARTED:
      return {
          ...state,
          isSaving: true,
          isSaved: false,
          error: null
      }
    case PLAYLIST_UPDATE_SUCCESS:
      return {
          ...state,
          isSaving: false,
          error: null,
          isSaved: true,
      }
    case PLAYLIST_UPDATE_FAILED:
      return {
        ...state,
        isSaving: false,
        isSaved: false,
        error: action.payload.error,
      }
    case PLAYLIST_GET_STARTED:
        return {
            ...state,
            isFetching: true,
            isSaved: false,
            isDeleted: false,
            error: null,
        }
    case PLAYLIST_GET_SUCCESS:
        return {
            ...state,
            isFetching: false,
            error: null,
            playlistsOwned: action.payload.playlistsOwned,
            playlistsFollowed: action.payload.playlistsFollowed
        }
    case PLAYLIST_GET_FAILED:
        return {
          ...state,
          isFetching: false,
          error: action.payload.error,
        }
    case PLAYLIST_CREATE_STARTED:
        return {
            ...state,
            isSaved: false,
            isDeleted: false,
            isSaving: true,
            error: null,
        }
    case PLAYLIST_CREATE_SUCCESS:
        return {
            ...state,
            isSaved: true,
            isSaving: false,
            error: null,
        }
    case PLAYLIST_CREATE_FAILED:
        return {
          ...state,
          isSaved: false,
          isSaving: false,
          error: action.payload.error,
        }
    case PLAYLIST_DELETE_STARTED:
        return {
            ...state,
            isDeleted: false,
            isSaved: false,
            isDeleting: true,
            error: null,
        }
    case PLAYLIST_DELETE_SUCCESS:
        return {
            ...state,
            isDeleted: true,
            isDeleting: false,
            error: null,
        }
    case PLAYLIST_DELETE_FAILED:
        return {
          ...state,
          isDeleted: false,
          isDeleting: false,
          error: action.payload.error,
        }
    case PLAYLIST_FOLLOW_STARTED:
        return {
            ...state,
            error: null,
            isFollowing: true,
            playlistFollowing: action.payload
        }
    case PLAYLIST_FOLLOW_SUCCESS:
        return {
            ...state,
            error: null,
            isFollowing: false,
            playlistFollowing: null,
        }
    case PLAYLIST_FOLLOW_FAILED:
        return {
          ...state,
          isFollowing: false,
          playlistFollowing: null,
          error: action.payload.error,
        }
    case PLAYLIST_GET_RECENT_STARTED:
        return {
            ...state,
            error: null,
            isFetchingRecent: true,
        }
    case PLAYLIST_GET_RECENT_SUCCESS:
        return {
            ...state,
            error: null,
            isFetchingRecent: false,
            playlistsRecent: action.payload
        }
    case PLAYLIST_GET_RECENT_FAILED:
        return {
          ...state,
          isFetchingRecent: false,
          error: action.payload.error,
        }
    case PLAYLIST_GET_CURRENT_STARTED:
        return {
            ...state,
            error: null,
            isFetchingCurrent: true,
        }
    case PLAYLIST_GET_CURRENT_SUCCESS:
        return {
            ...state,
            error: null,
            isFetchingCurrent: false,
            playlistCurrent: action.payload
        }
    case PLAYLIST_GET_CURRENT_FAILED:
        return {
          ...state,
          isFetchingCurrent: false,
          error: action.payload.error,
        }
    case PLAYLIST_CLEAR:
        return {
          ...state,
          playlistsFollowed: [],
          playlistsOwned: [],
        }
    case PLAYLIST_CURRENT_NO_REFRESH:
        return { ...state, refreshCurrent: false }

    case PLAYLIST_CURRENT_REFRESH:
        return { ...state, refreshCurrent: true }

    case PLAYLIST_CURRENT_SET:
        return { ...state, playlistCurrent: action.payload }

    case PLAYLIST_MUST_RELOAD:
        return { ...state, mustReload: true }

    case PLAYLIST_RESET_MUST_RELOAD:
        return { ...state, mustReload: false }

    default:
      return state
  }
}

export default playlistReducer
