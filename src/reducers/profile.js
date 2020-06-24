import {
    PROFILE_UPDATE_STARTED,
    PROFILE_UPDATE_FAILED,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_READ_STARTED,
    PROFILE_READ_FAILED,
    PROFILE_READ_SUCCESS
} from '../constants/actionTypes'

const initialState = {
  isFetching: false,
  isUpdated: false,
  error: null,
  username: null,
  urlAvatar: null
}

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_UPDATE_STARTED:
      return {
          ...state,
          isFetching: true,
          isUpdated: false,
          error: null
      }
    case PROFILE_UPDATE_SUCCESS:
      return {
          ...state,
          isFetching: false,
          error: null,
          isUpdated: true,
          urlAvatar: action.payload.url,
          username: action.payload.username
      }
    case PROFILE_UPDATE_FAILED:
      return {
        ...state,
        isFetching: false,
        isUpdated: false,
        error: action.payload.error,
      }
    case PROFILE_READ_STARTED:
        return {
            ...state,
            isFetching: true,
            isUpdated: false,
            error: null,
        }
    case PROFILE_READ_SUCCESS:
        return {
            ...state,
            isFetching: false,
            error: null,
            urlAvatar: action.payload.url,
            username: action.payload.username
        }
    case PROFILE_READ_FAILED:
        return {
          ...state,
          isFetching: false,
          error: action.payload.error,
        }
    default:
      return state
  }
}

export default profileReducer
