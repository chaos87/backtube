import { HOME_NO_REFRESH, HOME_REFRESH } from '../constants/actionTypes'


export const disableHome = () => ({
  type: HOME_NO_REFRESH
})

export const enableHome = () => ({
  type: HOME_REFRESH
})
