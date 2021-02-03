import {
    PROFILE_UPDATE_STARTED,
    PROFILE_UPDATE_FAILED,
    PROFILE_UPDATE_SUCCESS,
    PROFILE_CREATE_STARTED,
    PROFILE_CREATE_FAILED,
    PROFILE_CREATE_SUCCESS,
    PROFILE_READ_STARTED,
    PROFILE_READ_FAILED,
    PROFILE_READ_SUCCESS,
    PROFILE_GET_CURRENT_STARTED,
    PROFILE_GET_CURRENT_FAILED,
    PROFILE_GET_CURRENT_SUCCESS
} from '../constants/actionTypes'

const initialState = {
  isFetching: false,
  isSaving: false,
  isUpdated: false,
  error: null,
  profile: null,
  profileCurrent: null,
}

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_UPDATE_STARTED:
      return {
          ...state,
          isSaving: true,
          isUpdated: false,
          error: null
      }
    case PROFILE_UPDATE_SUCCESS:
      return {
          ...state,
          isSaving: false,
          error: null,
          isUpdated: true,
      }
    case PROFILE_UPDATE_FAILED:
      return {
        ...state,
        isSaving: false,
        isUpdated: false,
        error: action.payload.error,
      }
      case PROFILE_CREATE_STARTED:
        return {
            ...state,
            isSaving: true,
            isUpdated: false,
            error: null
        }
      case PROFILE_CREATE_SUCCESS:
        return {
            ...state,
            isSaving: false,
            error: null,
            isUpdated: true,
        }
      case PROFILE_CREATE_FAILED:
        return {
          ...state,
          isSaving: false,
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
            profile: action.payload
        }
    case PROFILE_READ_FAILED:
        return {
          ...state,
          isFetching: false,
          error: action.payload.error,
        }
    case PROFILE_GET_CURRENT_STARTED:
        return {
            ...state,
            isFetching: true,
            isUpdated: false,
            error: null,
        }
    case PROFILE_GET_CURRENT_SUCCESS:
        return {
            ...state,
            isFetching: false,
            error: null,
            profileCurrent: action.payload
        }
    case PROFILE_GET_CURRENT_FAILED:
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
