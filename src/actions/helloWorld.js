import { helloWorld } from '../api/helloWorld';
import { checkAuth, refreshAuthTokenStarted } from './auth';

export function hitApi(token) {
  return function(dispatch) {
    dispatch(refreshAuthTokenStarted());
    dispatch(checkAuth());
    return helloWorld(token)
      .then(data => {
          // dispatch(fetchYTsongsSuccess(data));
      })
      .catch(err => {
          console.log(err.message)
      });
  }
}
