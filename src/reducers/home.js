import { HOME_NO_REFRESH, HOME_REFRESH } from '../constants/actionTypes'

const initialState = {
  refreshHome: true,
}

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case HOME_NO_REFRESH:
      return { ...state, refreshHome: false }

    case HOME_REFRESH:
      return { ...state, refreshHome: true }

    default:
      return state
  }
}

export default homeReducer
