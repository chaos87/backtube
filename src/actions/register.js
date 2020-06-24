import {
    REGISTER_FAILED,
    REGISTER_STARTED,
    REGISTER_SUCCESS,
    CONFIRMATION_SUCCESS,
    CONFIRMATION_STARTED,
    CONFIRMATION_FAILED,
    RESEND_CODE_FAILED,
    RESEND_CODE_STARTED,
    RESEND_CODE_SUCCESS
} from '../constants/actionTypes'
import { register, confirm, resendCode } from '../api/register'

export function registerUser(userInfo) {
  return async function (dispatch) {
    dispatch(registrationStarted())
    return register(userInfo)
    .then(registration => {
        if (registration.error) {
            let username = registration.error === "User already exists" ? userInfo["username"] : null
            dispatch(registrationFailed(registration.error, username))
        }
        else {
            dispatch(registrationSuccess(registration))
        }
    })
    .catch(err => {
        dispatch(registrationFailed(err.message, null))
    });
  }
}

export function confirmUser(username, code) {
  return function (dispatch) {
    dispatch(confirmationStarted())
    return confirm(username, code)
    .then(confirmation => {
        if (confirmation !== "SUCCESS") {
            dispatch(confirmationFailed(confirmation.error))
        }
        else {
            dispatch(confirmationSuccess())
        }
    })
    .catch(err => {
        dispatch(confirmationFailed(err.message))
    });
  }
}

export function resendConfirmationCode(username) {
  return function (dispatch) {
    dispatch(resendCodeStarted())
    return resendCode(username)
    .then(result => {
        if (!('CodeDeliveryDetails' in result)) {
            dispatch(resendCodeFailed(result.error))
        }
        else {
            dispatch(resendCodeSuccess())
        }
    })
    .catch(err => {
        dispatch(resendCodeFailed(err.message))
    });
  }
}

const registrationSuccess = registration => ({
  type: REGISTER_SUCCESS,
  payload: {
      registration
  }
});

const registrationStarted = () => ({
  type: REGISTER_STARTED
});

const registrationFailed = (error, username) => ({
  type: REGISTER_FAILED,
  payload: {
    error,
    username
  }
});

const confirmationSuccess = () => ({
  type: CONFIRMATION_SUCCESS
});

const confirmationStarted = () => ({
  type: CONFIRMATION_STARTED
});

const confirmationFailed = error => ({
  type: CONFIRMATION_FAILED,
  payload: {
    error
  }
});

const resendCodeSuccess = () => ({
  type: RESEND_CODE_SUCCESS
});

const resendCodeStarted = () => ({
  type: RESEND_CODE_STARTED
});

const resendCodeFailed = error => ({
  type: RESEND_CODE_FAILED,
  payload: {
    error
  }
});
