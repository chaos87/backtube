import { baseURL } from '../config/urls';


export const forgotPassword = async email => {
    let response = await fetch(baseURL + '/auth/forgotPassword', {
      method: 'POST',
      body: JSON.stringify({
          "username": email
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err;
    })
    return response;
}

export const resetPassword = async userInfo => {
    let response = await fetch(baseURL + '/auth/resetPassword', {
      method: 'POST',
      body: JSON.stringify({
          "username": userInfo.username,
          "password": userInfo.password,
          "code": userInfo.code
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err;
    })
    return response;
}
