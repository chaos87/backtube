import {
  FETCH_BC_SONGS_STARTED,
  FETCH_BC_SONGS_FAILED,
  FETCH_BC_SONGS_SUCCESS,
} from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
  error: null
};

export default function fetchBCreducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_BC_SONGS_STARTED:
      return {
        ...state,
        data: [],
        loading: true
      };
    case FETCH_BC_SONGS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload
      };
    case FETCH_BC_SONGS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    default:
      return state;
  }
}
