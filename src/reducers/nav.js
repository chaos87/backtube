import { NAV_SET_TAB, NAV_SET_SUBTAB, NAV_RESET_TABS } from '../constants/actionTypes'

const initialState = {
  tab: 0,
  subTab: 0
}

const navReducer = (state = initialState, action) => {
  switch (action.type) {
    case NAV_SET_TAB:
      return { ...state, tab: action.payload, subTab: 0 }

    case NAV_SET_SUBTAB:
      return { ...state, subTab: action.payload }

    case NAV_RESET_TABS:
      return { ...state, tab: 0, subTab: 0 }

    default:
      return state
  }
}

export default navReducer
