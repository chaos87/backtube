import {
  FETCH_BT_SONGS_STARTED,
  FETCH_BT_SONGS_FAILED,
  FETCH_BT_SONGS_SUCCESS,
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export default function fetchBTreducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_BT_SONGS_STARTED:
      return {
        ...state,
        data: [],
        loading: true
      };
    case FETCH_BT_SONGS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload
      };
    case FETCH_BT_SONGS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    default:
      return state;
  }
}
