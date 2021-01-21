import { NAV_SET_TAB, NAV_SET_SUBTAB, NAV_RESET_TABS } from '../constants/actionTypes'


export const setTab = (value) => ({
  type: NAV_SET_TAB, payload: value
})

export const setSubTab = (value) => ({
  type: NAV_SET_SUBTAB, payload: value
})

export const resetTabs = () => ({
  type: NAV_RESET_TABS
})
