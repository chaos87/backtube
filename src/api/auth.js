import { baseURL } from '../config/urls';

// Need to implement calls to noisedge auth api

export const login = async (username, password) => {
    let response = await fetch(baseURL + '/auth/login', {
      method: 'POST',
      body: JSON.stringify({"username": username, "password": password}),
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

export const refresh = async (username, token) => {
    let response = await fetch(baseURL + '/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({"username": username, "refreshToken": token}),
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
