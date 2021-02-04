import { baseURL, streamingURL } from '../config/urls';
import { addMosaicToObject } from '../services/utils';
import { prepareAudioList } from '../actions/player';

export const updatePlaylistApi = async (playlistInfo) => {
    const accessToken = playlistInfo.accessToken;
    const playlistId = playlistInfo.id;
    const title = playlistInfo.title;
    const tracks = playlistInfo.playlist;
    const themes = playlistInfo.themes;
    const review = 'review' in playlistInfo ? playlistInfo.review : '';
    const privacy = playlistInfo.private;
    const tags = 'tags' in playlistInfo ? playlistInfo.tags : [];
    const newTracks = tracks.map(
        ({ _id, name, musicSrc, source, singer, cover, album, duration, playlistId  }) => (
            {
                _id: _id, title: name,
                musicSrc: musicSrc.replace(streamingURL, '').split('&')[0],
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
        body: JSON.stringify({"title": title, "tracks": newTracks, "review": review, "private": privacy, "tags": tags, "themes": themes})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        return err
    })
    return playlist;
};

export const createPlaylistApi = async (playlistInfo) => {
    const accessToken = playlistInfo.accessToken;
    const title = playlistInfo.title;
    let tracks = playlistInfo.playlist;
    const themes = playlistInfo.themes;
    const review = 'review' in playlistInfo ? playlistInfo.review : '';
    const tags = 'tags' in playlistInfo ? playlistInfo.tags : [];
    const privacy = playlistInfo.private;
    if (!('musicSrc' in tracks[0])) {
        tracks = tracks.map( track => prepareAudioList(track, track.source, null, null, track.album, null) )
    }
    const newTracks = tracks.map(
        ({ _id, name, musicSrc, source, singer, cover, album, duration, playlistId  }) => (
            {
                _id: _id, title: name,
                musicSrc: musicSrc.replace(streamingURL, '').split('&')[0],
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
        body: JSON.stringify({"title": title, "tracks": newTracks, "review": review, "tags": tags, "private": privacy, "themes": themes})
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
    .then(res => {
        // Add field for covers mosaic
        if (res) {
            return Object.assign(
                res,
                {playlistsOwned: res.playlistsOwned.map(el => addMosaicToObject(el))},
                {playlistsFollowed: res.playlistsFollowed.map(el => addMosaicToObject(el))},
            )
        } else { return res; }
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
    .then(res => {
        // Add field for covers mosaic
        if (res) {
            return res.map(el => addMosaicToObject(el))
        } else { return res; }
    })
    .catch(err => {
        return err
    })
    return playlists;
}

export const getCurrentPlaylistApi = async (playlistInfo) => {
    const accessToken = playlistInfo.accessToken;
    const getUrl = baseURL + `/public/playlist/` + playlistInfo.playlistId;
    let playlist = await fetch(getUrl, { method: 'GET',
        headers: {
          'accessToken': accessToken,
          'Content-Type': 'application/json'
        },
    })
    .then(res => {
        return res.json();
    })
    .then(res => {
        // Add field for covers mosaic
        if ('tracks' in res) {
            return addMosaicToObject(res)
        } else { return res; }
    })
    .catch(err => {
        return err
    })
    return playlist;
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
