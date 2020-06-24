import { CHECK_AUTH_TOKEN, REFRESH_AUTH_TOKEN_STARTED, REFRESH_AUTH_TOKEN_FAILED} from '../constants/actionTypes';
import { clearSession, refreshAuthToken } from '../actions/auth';
import { clearPlaylists } from '../actions/playlist';
import moment from 'moment';

export function jwtMiddleware({ dispatch, getState }) {
 return (next) => (action) => {
   switch (action.type) {
     case CHECK_AUTH_TOKEN :
       if (getState().auth && getState().auth.session) {
         const tokenExpiration = getState().auth.session.accessToken.payload.exp;
         const tokenExpirationTimeInSeconds = (tokenExpiration - moment(Math.floor(Date.now() / 1000)));
         if (tokenExpiration && tokenExpirationTimeInSeconds < 20) {
           console.log("Clearing Session...")
           dispatch(clearPlaylists());
           return dispatch(clearSession());
         }
       }
     break;
     case REFRESH_AUTH_TOKEN_STARTED :
       if (getState().auth && getState().auth.session) {
         const tokenExpiration = getState().auth.session.accessToken.payload.exp;
         const tokenExpirationTimeInSeconds = (tokenExpiration - moment(Math.floor(Date.now() / 1000)));
         if (tokenExpiration && tokenExpirationTimeInSeconds < 300 && tokenExpirationTimeInSeconds > 20) {
           if (!getState().auth.fetching) {
             console.log("Refreshing Session...")
             const refreshToken = getState().auth.session.refreshToken.token;
             const username = getState().auth.session.accessToken.payload.username;
             return dispatch(refreshAuthToken(username, refreshToken));
           }
         }
       }
     break;
     case REFRESH_AUTH_TOKEN_FAILED :
       if (getState().auth && getState().auth.session) {
         dispatch(clearPlaylists());
         return dispatch(clearSession());
       }
     break;

     default:
     break
     }
   return next(action);
 }
}
