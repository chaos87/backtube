import { baseURL } from '../config/urls';
import { uploadImageToS3 } from '../services/s3';
import { addMosaicToObject } from '../services/utils';

export const updateThemeApi = async (themeInfo) => {
    const accessToken = themeInfo.accessToken;
    const themeId = themeInfo.id;
    const title = themeInfo.title;
    const description = 'description' in themeInfo ? themeInfo.description : '';
    const tags = 'tags' in themeInfo ? themeInfo.tags : [];
    let imageResponse = await uploadImageToS3(themeInfo);
    const putUrl = baseURL + `/api/theme/` + themeId;
    let theme = await fetch(putUrl, { method: 'PUT',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"title": title, "description": description, "tags": tags, "thumbnail": imageResponse})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return theme;
};

export const createThemeApi = async (themeInfo) => {
    const accessToken = themeInfo.accessToken;
    const title = themeInfo.title;
    const description = 'description' in themeInfo ? themeInfo.review : '';
    const tags = 'tags' in themeInfo ? themeInfo.tags : [];
    const postUrl = baseURL + `/api/theme/`;
    // upload image to S3
    let imageResponse = await uploadImageToS3(themeInfo);
    let theme = await fetch(postUrl, { method: 'POST',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"title": title, "description": description, "tags": tags, "thumbnail": imageResponse})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return theme;
}

export const getRecentThemesApi = async () => {
    const getUrl = baseURL + `/public/themes/recent`;
    let themes = await fetch(getUrl, { method: 'GET'})
    .then(res => {
        return res.json();
    })
    .then(res => {
        // Add field for covers mosaic
        if (res) {
            return res.map(el => Object.assign(
                el,
                {playlists: el.playlists.map(elt => addMosaicToObject(elt))},
            ))
        } else { return res; }
    })
    .catch(err => {
        return err
    })
    return themes;
}

export const getCurrentThemeApi = async (themeId) => {
    const getUrl = baseURL + `/public/theme/` + themeId;
    let theme = await fetch(getUrl, { method: 'GET'})
    .then(res => {
        return res.json();
    })
    .then(res => {
        // Add field for covers mosaic
        if ('playlists' in res) {
            return Object.assign(
                res,
                {playlists: res.playlists.map(el => addMosaicToObject(el))},
            )
        } else { return res; }
    })
    .catch(err => {
        return err
    })
    return theme;
}

export const getAllThemesApi = async (themeInfo) => {
    const accessToken = themeInfo.accessToken;
    const getUrl = baseURL + `/api/themes`;
    let themes = await fetch(getUrl, { method: 'GET',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        },
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return themes;
}
