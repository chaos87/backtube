import {
    REGISTER_FAILED,
    REGISTER_STARTED,
    REGISTER_SUCCESS,
    CONFIRMATION_STARTED,
    CONFIRMATION_SUCCESS,
    CONFIRMATION_FAILED,
    RESEND_CODE_FAILED,
    RESEND_CODE_STARTED,
    RESEND_CODE_SUCCESS
} from '../constants/actionTypes';

const initialState = {
  isRegistered: false,
  isConfirmed: false,
  isResent: false,
  isFetching: false,
  isConfirmFetching: false,
  isResendFetching: false,
  error: null,
  username: null
}

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_STARTED:
      return {
        ...state,
        isFetching: true,
        isRegistered: false,
        isConfirmed: false,
        error: null
    }
    case REGISTER_FAILED:
      return {
           ...state,
          error: action.payload.error,
          isFetching: false,
          isRegistered: false,
          isConfirmed: false,
          username: action.payload.username
    }
    case REGISTER_SUCCESS:
      return {
         ...state,
        username: action.payload.registration.user.username,
        isFetching: false,
        isRegistered: true,
        isConfirmed: false,
        error: null
    }
    case CONFIRMATION_STARTED:
      return {
        ...state,
        isConfirmFetching: true,
        isConfirmed: false,
        error: null
    }
    case CONFIRMATION_SUCCESS:
      return {
        ...state,
        isConfirmFetching: false,
        isConfirmed: true,
        error: null
    }
    case CONFIRMATION_FAILED:
      return {
        ...state,
        isConfirmFetching: false,
        isConfirmed: false,
        error: action.payload.error
    }
    case RESEND_CODE_STARTED:
      return {
        ...state,
        isResendFetching: true,
        isResent: false,
        error: null
    }
    case RESEND_CODE_SUCCESS:
      return {
        ...state,
        isResendFetching: false,
        isResent: true,
        error: null
    }
    case RESEND_CODE_FAILED:
      return {
        ...state,
        isResendFetching: false,
        isResent: false,
        error: action.payload.error
    }

    default:
      return state
  }
}

export default registerReducer
