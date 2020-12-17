import {
    FORGOT_PASSWORD_FAILED,
    FORGOT_PASSWORD_STARTED,
    FORGOT_PASSWORD_SUCCESS,
    RESET_PASSWORD_STARTED,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILED,
} from '../constants/actionTypes';
import { forgotPassword, resetPassword } from '../api/reset'

export function sendForgotPasswordEmail(email) {
  return async function (dispatch) {
    dispatch(forgotPasswordStarted())
    return forgotPassword(email)
    .then(res => {
        if (res.error) {
            dispatch(forgotPasswordFailed(res.error))
        }
        else {
            dispatch(forgotPasswordSuccess(email))
        }
    })
    .catch(err => {
        dispatch(forgotPasswordFailed(err.message))
    });
  }
}

export function resetUserPassword(userInfo) {
  return function (dispatch) {
    dispatch(resetPasswordStarted())
    return resetPassword(userInfo)
    .then(res => {
        if (Object.keys(res).length === 0 && res.constructor === Object) {
            dispatch(resetPasswordSuccess())
        }
        else {
            dispatch(resetPasswordFailed(res.error))
        }
    })
    .catch(err => {
        dispatch(resetPasswordFailed(err.message))
    });
  }
}

const forgotPasswordSuccess = email => ({
  type: FORGOT_PASSWORD_SUCCESS,
  payload: {
      email
  }
});

const forgotPasswordStarted = () => ({
  type: FORGOT_PASSWORD_STARTED
});

const forgotPasswordFailed = error => ({
  type: FORGOT_PASSWORD_FAILED,
  payload: {
    error
  }
});

const resetPasswordSuccess = () => ({
  type: RESET_PASSWORD_SUCCESS
});

const resetPasswordStarted = () => ({
  type: RESET_PASSWORD_STARTED
});

const resetPasswordFailed = error => ({
  type: RESET_PASSWORD_FAILED,
  payload: {
    error
  }
});
