import { baseURL } from '../config/urls';


export const register = async (userInfo) => {
    let response = await fetch(baseURL + '/auth/register', {
      method: 'POST',
      body: JSON.stringify({
          "username": userInfo['username'],
          "email": userInfo['email'],
          "password": userInfo['password'],
          "preferred_username": userInfo['username']
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

export const confirm = async (username, code) => {
    let response = await fetch(baseURL + '/auth/confirm', {
      method: 'POST',
      body: JSON.stringify({
          "username": username,
          "code": code
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

export const resendCode = async (username) => {
    let response = await fetch(baseURL + '/auth/sendConfirmCode', {
      method: 'POST',
      body: JSON.stringify({
          "username": username
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
