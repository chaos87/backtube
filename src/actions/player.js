import {
    PLAYER_ADD_SINGLE_SONG_BEFORE,
    PLAYER_ADD_SONG,
    PLAYER_ADD_SINGLE_SONG_AFTER,
    PLAYER_ADD_MULTI_SONG_BEFORE,
    PLAYER_ADD_MULTI_SONG_AFTER,
    PLAYER_SYNC_PLAYLIST
} from '../constants/actionTypes';
import { delay } from '../services/utils';
import { streamingURL } from '../config/urls';
import { sources } from '../config/sources';
import md5 from 'md5';

export function addSingleSong(event, source, cover, singer, album) {
  return async function(dispatch) {
      // before
      await dispatch({type: PLAYER_ADD_SINGLE_SONG_BEFORE, source: source, payload: event});
      // doing
      delay(100).then(res => {
          const audioList = prepareAudioList(event, source, cover, singer, album);
          dispatch({type: PLAYER_ADD_SONG, payload: audioList})
      });
      // after
      return delay(100).then(res => {
          dispatch({type: PLAYER_ADD_SINGLE_SONG_AFTER})
      })
  }
}

export function addMultipleSong(event, source, cover, singer) {
    return async function(dispatch) {
        // before
        await dispatch({type: PLAYER_ADD_MULTI_SONG_BEFORE, source: source, payload: event});
        // doing
        const items = event.tracks
        const promises = [];
        for (let i = 0; i < items.length; i++) {
            let actualSource = sources.indexOf(source) > -1 ? source : items[i].source;
            let album = items[i].album ? items[i].album : event.title
            promises.push(await delay(100).then(res => {
                    const audioList = prepareAudioList(items[i], actualSource, cover, singer, album);
                    dispatch({type: PLAYER_ADD_SONG, payload: audioList})
                })
            )
        }
        // after
        return Promise.all(promises)
        .then(() => {
            dispatch({type: PLAYER_ADD_MULTI_SONG_AFTER})
        })
    }
}

export function syncPlaylist(currentPlayId, audioLists, audioInfo) {
  return function(dispatch) {
        dispatch({type: PLAYER_SYNC_PLAYLIST, payload: audioLists})
    }
}

const prepareAudioList = (event, source, cover, singer, album) => {
    let audioList = null;
    const actualCover = cover ? cover : event.thumbnail;
    if (source === 'youtube'){
        const musicSrc = event.musicSrc ? event.musicSrc : '/youtube/stream?videoId=' + event.videoId;
        const key = md5(musicSrc);
        const actualSinger = singer ? singer : event.artist;
        audioList =
          {
            key: key,
            name: event.title,
            musicSrc: streamingURL + musicSrc,
            source: "youtube",
            cover: actualCover,
            singer: actualSinger,
            album: album,
            duration: event.duration
         }
    } else {
        const musicSrc = event.musicSrc ? event.musicSrc : '/bandcamp/stream?url=' + event.url;
        const key = md5(musicSrc);
        const actualSinger = singer ? singer : event.artist;
        audioList =
          {
            key: key,
            name: event.title,
            musicSrc: streamingURL + musicSrc,
            source: "bandcamp",
            cover: actualCover,
            singer: actualSinger,
            album: album,
            duration: event.duration
         }
    }
    return audioList;
}
