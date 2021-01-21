import { SEARCH_START, SEARCH_END, SEARCH_NO_REFRESH, SEARCH_REFRESH } from '../constants/actionTypes'

const initialState = {
  isSearching: false,
  refreshSearch: true,
}

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_START:
      return { ...state, isSearching: true }

    case SEARCH_END:
      return { ...state, isSearching: false }

    case SEARCH_NO_REFRESH:
      return { ...state, refreshSearch: false }

    case SEARCH_REFRESH:
      return { ...state, refreshSearch: true }

    default:
      return state
  }
}

export default searchReducer
