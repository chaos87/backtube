import { SEARCH_START, SEARCH_END } from '../constants/actionTypes'

const initialState = {
  isSearching: false
}

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_START:
      return { ...state, isSearching: true }

    case SEARCH_END:
      return { ...state, isSearching: false }

    default:
      return state
  }
}

export default searchReducer
