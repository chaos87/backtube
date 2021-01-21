import { LIBRARY_NO_REFRESH, LIBRARY_REFRESH } from '../constants/actionTypes'


export const disableLibrary = () => ({
  type: LIBRARY_NO_REFRESH
})

export const enableLibrary = () => ({
  type: LIBRARY_REFRESH
})
