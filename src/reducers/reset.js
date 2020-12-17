import {
    FORGOT_PASSWORD_FAILED,
    FORGOT_PASSWORD_STARTED,
    FORGOT_PASSWORD_SUCCESS,
    RESET_PASSWORD_STARTED,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILED,
} from '../constants/actionTypes';

const initialState = {
  isEmailSent: false,
  isPasswordReset: false,
  isForgotFetching: false,
  isResetFetching: false,
  error: null,
  email: null
}

const resetReducer = (state = initialState, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD_STARTED:
      return {
        ...state,
        isForgotFetching: true,
        isEmailSent: false,
        isPasswordReset: false,
        error: null
    }
    case FORGOT_PASSWORD_FAILED:
      return {
           ...state,
          error: action.payload.error,
          isForgotFetching: false,
          isEmailSent: false,
          isPasswordReset: false,
          email: null
    }
    case FORGOT_PASSWORD_SUCCESS:
      return {
         ...state,
        email: action.payload.email,
        isForgotFetching: false,
        isEmailSent: true,
        isPasswordReset: false,
        error: null
    }
    case RESET_PASSWORD_STARTED:
      return {
        ...state,
        isResetFetching: true,
        isPasswordReset: false,
        error: null
    }
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isResetFetching: false,
        isPasswordReset: true,
        error: null
    }
    case RESET_PASSWORD_FAILED:
      return {
        ...state,
        isResetFetching: false,
        isPasswordReset: false,
        error: action.payload.error
    }
    default:
      return state
  }
}

export default resetReducer
