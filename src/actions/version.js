import { VERSION_SAVE_VERSION } from '../constants/actionTypes'


export function checkVersion(localCacheVersion, siteVersion) {
    return function (dispatch) {
        if (localCacheVersion !== siteVersion){
            console.log('local storage build id =', localCacheVersion)
            console.log('site build id =', siteVersion)
            console.log('Clearing local storage...')
            window.localStorage.clear();
            return dispatch(doSaveVersion(siteVersion))
        }

    }
}

const doSaveVersion = (siteVersion) => ({
    type: VERSION_SAVE_VERSION, payload: siteVersion
})
