import { baseURL } from '../config/urls';

export const updatePlaylistApi = async (userInfo) => {
    const accessToken = userInfo.accessToken;
    const playlistId = userInfo.id;
    const title = userInfo.title;
    const tracks = userInfo.playlist;
    const newTracks = tracks.map(
        ({ key, name, musicSrc, source, singer, cover, album, duration  }) => (
            {
                _id: key, title: name,
                musicSrc: '/' + source + '/' + musicSrc.split('/').pop(),
                source: source, artist: singer, thumbnail: cover, album: album, duration: duration
            }
        )
    );
    const putUrl = baseURL + `/api/playlist/` + playlistId;
    let playlist = await fetch(putUrl, { method: 'PUT',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"title": title, "tracks": newTracks})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return playlist;
};

export const createPlaylistApi = async (userInfo) => {
    const accessToken = userInfo.accessToken;
    const title = userInfo.title;
    const tracks = userInfo.playlist;
    const newTracks = tracks.map(
        ({ key, name, musicSrc, source, singer, cover, album, duration  }) => (
            {
                _id: key, title: name,
                musicSrc: '/' + source + '/' + musicSrc.split('/').pop(),
                source: source, artist: singer, thumbnail: cover, album: album, duration: duration
            }
        )
    );
    const postUrl = baseURL + `/api/playlist/`;
    let playlist = await fetch(postUrl, { method: 'POST',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"title": title, "tracks": newTracks})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return playlist;
}

export const getPlaylistsApi = async (userInfo) => {
    const accessToken = userInfo.accessToken;
    const userSub = userInfo.userSub;
    const getUrl = baseURL + `/api/profile/` + userSub + `/playlists`;
    let playlists = await fetch(getUrl, { method: 'GET',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return playlists;
}

export const getRecentPlaylistsApi = async () => {
    const getUrl = baseURL + `/public/playlists/recent`;
    let playlists = await fetch(getUrl, { method: 'GET'})
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return playlists;
}

export const getPlaylistsIdAndTitleApi = async (userInfo) => {
    const accessToken = userInfo.accessToken;
    const userSub = userInfo.userSub;
    const getUrl = baseURL + `/api/profile/` + userSub + `/playlistsNoTracks`;
    let playlists = await fetch(getUrl, { method: 'GET',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return playlists;
}

export const deletePlaylistApi = async (id, token) => {
    const postUrl = baseURL + `/api/playlist/` + id;
    let playlist = await fetch(postUrl, { method: 'DELETE',
        headers: {
          'accessToken': token,
          'Content-Type': 'application/json'
        },
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return playlist;
}

export const addFollowerApi = async (id, token) => {
    const postUrl = baseURL + `/api/playlist/` + id + `/addFollower`;
    let playlist = await fetch(postUrl, { method: 'PUT',
        headers: {
          'accessToken': token,
          'Content-Type': 'application/json'
        },
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return playlist;
}

export const removeFollowerApi = async (id, token) => {
    const postUrl = baseURL + `/api/playlist/` + id + `/removeFollower`;
    let playlist = await fetch(postUrl, { method: 'PUT',
        headers: {
          'accessToken': token,
          'Content-Type': 'application/json'
        },
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return playlist;
}
