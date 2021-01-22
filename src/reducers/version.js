import { VERSION_SAVE_VERSION } from '../constants/actionTypes'

const initialState = {
  version: null,
}

const versionReducer = (state = initialState, action) => {
  switch (action.type) {
    case VERSION_SAVE_VERSION:
      return { ...state, version: action.payload }

    default:
      return state
  }
}

export default versionReducer
