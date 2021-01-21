import { baseURL } from '../config/urls';
import { addMosaicToObject } from '../services/utils';

export const updateProfileApi = async profile => {
  // Store avatar file in S3
  let avatarResponse = profile.file;
  const accessToken = profile.accessToken;
  if (profile.file !== null && profile.file !== undefined
      && profile.file instanceof Object && profile.file.constructor === Object) {
      let fileParts = profile.file.name.split('.');
      let fileName = 'avatars/' + profile.userSub;
      let fileType = fileParts[1];

      const uploadUrl = baseURL + `/api/uploadAvatar`;
      avatarResponse = await fetch(uploadUrl, {method: 'POST',
          body: JSON.stringify({
              fileName: fileName,
              fileType: fileType
          }),
          headers: {
            'Content-Type': 'application/json',
            'accessToken': accessToken
          }
      })
      .then(response => {
          return response.json()
      })
      .then(response => {
        const signedRequest = response.signedRequest;
        const url = response.url;
        console.log("Received a signed request " + signedRequest);
        let putResult = fetch(signedRequest,{method: 'PUT',
            body: profile.file,
            headers: {
              'Content-Type': fileType
            }
          })
          .then(result => {
            return url
          })
          .catch(error => {
            return error
          })
          return putResult;
      });
  }
  // Update username in Cognito
  const username = profile.username;
  const userSub = profile.userSub;
  const userUrl = baseURL + `/auth/user`;
  await fetch(userUrl, {method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "username": username,
          "accessToken": accessToken
      })
  })
  .then(response => {
      return response.json()
  })
  .catch(error => {
    return error
  })
  // Update url and username in mongodb
  const updateUrl = baseURL + `/api/profile/` + userSub;
  await fetch(updateUrl, {method: 'PUT',
      body: JSON.stringify({
          "username": username,
          "avatar": avatarResponse
      }),
      headers: {
        'Content-Type': 'application/json',
        'accessToken': accessToken
      }
  })
  .then(response => {
      return response.json();
  })
  .catch(error => {
    return error
  })
  return {
      "avatar": avatarResponse,
      "username": username
  };
};

export const readProfileApi = async userInfo => {
    const accessToken = userInfo.accessToken;
    const userSub = userInfo.userSub;
    const getUrl = baseURL + `/api/profile/` + userSub;
    let profile = await fetch(getUrl, { method: 'GET',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        }
    })
    .then(res => {
        return res.json();
    })
    .then(res => {
        // Add field for covers mosaic
        if ('playlistsOwned' in res) {
            return Object.assign(
                res,
                {playlistsOwned: res.playlistsOwned.map(el => addMosaicToObject(el))},
            )
        } else { return res; }
    })
    .catch(err => {
        return err
    })
    return profile;
}

export const getCurrentProfileApi = async userInfo => {
    const userSub = userInfo.userSub;
    const getUrl = baseURL + `/public/profile/` + userSub;
    let profile = await fetch(getUrl, { method: 'GET' })
    .then(res => {
        return res.json();
    })
    .then(res => {
        // Add field for covers mosaic
        if ('playlistsOwned' in res) {
            return Object.assign(
                res,
                {playlistsOwned: res.playlistsOwned.map(el => addMosaicToObject(el))},
            )
        } else { return res; }
    })
    .catch(err => {
        return err
    })
    return profile;
}
