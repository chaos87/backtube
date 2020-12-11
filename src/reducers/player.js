import {
    PLAYER_ADD_SINGLE_SONG_BEFORE,
    PLAYER_ADD_SONG,
    PLAYER_ADD_SINGLE_SONG_AFTER,
    PLAYER_ADD_MULTI_SONG_BEFORE,
    PLAYER_ADD_MULTI_SONG_AFTER,
    PLAYER_SYNC_PLAYLIST,
} from '../constants/actionTypes';

const initialState = {
  addLoading: false,
  itemAddedId: "",
  audioLists: [],
  clearPriorAudioLists: true,
};

export default function playerReducer(state = initialState, action) {
  switch (action.type) {
    case PLAYER_ADD_SINGLE_SONG_BEFORE:
        return {
            ...state,
            addLoading: true,
            itemAddedId: action.index,
            clearPriorAudioLists: false
        };
    case PLAYER_ADD_SONG:
        return {
            ...state,
            audioLists: [...state.audioLists, action.payload]
        };
    case PLAYER_ADD_SINGLE_SONG_AFTER:
        return {
            ...state,
            addLoading: false,
            clearPriorAudioLists: true,
        };
    case PLAYER_ADD_MULTI_SONG_BEFORE:
        return {
            ...state,
            addLoading: true,
            itemAddedId: action.payload._id,
            clearPriorAudioLists: false
        };
    case PLAYER_ADD_MULTI_SONG_AFTER:
        return {
            ...state,
            addLoading: false,
            clearPriorAudioLists: true
        };
    case PLAYER_SYNC_PLAYLIST:
        return {
            ...state,
            audioLists: action.payload,
        };
    default:
      return state;
  }
}
