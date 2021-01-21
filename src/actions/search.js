import { SEARCH_START, SEARCH_END, SEARCH_NO_REFRESH, SEARCH_REFRESH } from '../constants/actionTypes'

export const startSearch = () => ({
  type: SEARCH_START
})

export const endSearch = () => ({
  type: SEARCH_END
})

export const disableSearch = () => ({
  type: SEARCH_NO_REFRESH
})

export const enableSearch = () => ({
  type: SEARCH_REFRESH
})
