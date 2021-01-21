import { LIBRARY_NO_REFRESH, LIBRARY_REFRESH } from '../constants/actionTypes'

const initialState = {
  refreshLibrary: true,
}

const libraryReducer = (state = initialState, action) => {
  switch (action.type) {
    case LIBRARY_NO_REFRESH:
      return { ...state, refreshLibrary: false }

    case LIBRARY_REFRESH:
      return { ...state, refreshLibrary: true }

    default:
      return state
  }
}

export default libraryReducer
