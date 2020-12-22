import {
    PLAYER_ADD_SINGLE_SONG_BEFORE,
    PLAYER_ADD_SONG,
    PLAYER_ADD_SINGLE_SONG_AFTER,
    PLAYER_ADD_MULTI_SONG_BEFORE,
    PLAYER_ADD_MULTI_SONG_AFTER,
    PLAYER_SYNC_PLAYLIST,
} from '../constants/actionTypes';
import { delay } from '../services/utils';
import { streamingURL } from '../config/urls';
import { sources } from '../config/sources';
import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';
import { MixPanel } from '../components/MixPanel';


export function addSingleSong(event, source, cover, singer, album, index) {
  return async function(dispatch) {
      // before
      await dispatch({type: PLAYER_ADD_SINGLE_SONG_BEFORE, index: index});
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
        if (source === 'backtube') {
            MixPanel.track('Queue Playlist', {
                'Playlist ID': event._id,
                'Playlist Title': event.title,
                'Playlist Creator ID': event.creator._id,
                'Playlist Tracks': event.tracks,
            })
        }
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
    const actualSinger = singer ? singer : event.artist;
    let key = uuidv4();
    const musicSrc = (source === 'youtube' && 'videoId' in event)? '/youtube/stream?videoId=' + event.videoId + '&key=' + key
                   : (source === 'bandcamp' && 'url' in event)? '/bandcamp/stream?url=' + event.url + '&key=' + key
                   : event.musicSrc + '&key=' + key;
    const id = md5(musicSrc.split('&')[0]);
    audioList =
      {
        _id: id,
        name: event.title,
        musicSrc: streamingURL + musicSrc,
        source: source,
        cover: actualCover,
        singer: actualSinger,
        album: album,
        duration: event.duration,
     }
    return audioList;
}
