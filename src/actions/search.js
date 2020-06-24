import { SEARCH_START, SEARCH_END } from '../constants/actionTypes'

export const startSearch = () => ({
  type: SEARCH_START
})

export const endSearch = () => ({
  type: SEARCH_END
})
