import {
    PLAYER_ADD_SINGLE_SONG_BEFORE,
    PLAYER_ADD_SONG,
    PLAYER_ADD_SINGLE_SONG_AFTER,
    PLAYER_ADD_MULTI_SONG_BEFORE,
    PLAYER_ADD_MULTI_SONG_AFTER,
    PLAYER_SYNC_PLAYLIST,
    PLAYER_SYNC_CURRENT_SONG,
    PLAYER_CLEAR_SONGS,
    PLAYER_QUEUE_SONG,
} from '../constants/actionTypes';
import { delay } from '../services/utils';
import { streamingURL } from '../config/urls';
import { sources } from '../config/sources';
import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';


export function queueSong(event, source, cover, singer, album, index) {
  return async function(dispatch) {
      // before
      await dispatch({type: PLAYER_ADD_SINGLE_SONG_BEFORE, index: index});
      // doing
      await delay(1000).then(res => {
          const audioList = prepareAudioList(event, source, cover, singer, album, null);
          dispatch({type: PLAYER_QUEUE_SONG, payload: audioList})
      });
      // after
      return dispatch({type: PLAYER_ADD_SINGLE_SONG_AFTER})
  }
}

export function addMultipleSong(event, source, cover, singer, clear) {
    return function(dispatch) {
        if (clear) {
            dispatch({ type: PLAYER_CLEAR_SONGS });
        }
        // before
        dispatch({type: PLAYER_ADD_MULTI_SONG_BEFORE, source: source, payload: event});
        // doing
        const audioLists = event.tracks.map(el =>
            prepareAudioList(
                el,
                sources.indexOf(source) > -1 ? source : el.source,
                cover,
                singer,
                el.album ? el.album : event.title,
                event._id
            )
        )
        dispatch({type: PLAYER_ADD_SONG, payload: audioLists})
        // after
        dispatch({type: PLAYER_ADD_MULTI_SONG_AFTER})
    }
}

export function syncPlaylist(currentPlayId, audioLists, audioInfo) {
  return function(dispatch) {
        dispatch({type: PLAYER_SYNC_PLAYLIST, payload: audioLists})
    }
}

export const prepareAudioList = (event, source, cover, singer, album, playlistId) => {
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
        playlistId: playlistId,
     }
    return audioList;
}

export function syncCurrentTrack(audioInfo) {
  return function(dispatch) {
        dispatch({type: PLAYER_SYNC_CURRENT_SONG, payload: audioInfo})
    }
}
