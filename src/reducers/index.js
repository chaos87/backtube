import { combineReducers } from 'redux';
import authReducer from './auth';
import registerReducer from './register';
import fetchYTreducer from './fetchYT';
import fetchBCreducer from './fetchBC';
import fetchBTreducer from './fetchBT';
import playerReducer from './player';
import searchReducer from './search';
import profileReducer from './profile';
import playlistReducer from './playlist';
import resetReducer from './reset';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: ['error', 'isFetching']
};

const registerPersistConfig = {
  key: 'register',
  storage: storage,
  blacklist: ['error', 'isConfirmed', 'isRegistered', 'isResent', 'isFetching', 'isResendFetching', 'isConfirmFetching']
};

const profilePersistConfig = {
  key: 'profile',
  storage: storage,
  blacklist: ['error', 'isFetching', 'isUpdated']
};

const playerPersistConfig = {
  key: 'player',
  storage: storage,
  blacklist: ['itemAddedId', 'addLoading']
};

export default combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  register: persistReducer(registerPersistConfig, registerReducer),
  search: searchReducer,
  fetchYT: fetchYTreducer,
  fetchBC: fetchBCreducer,
  fetchBT: fetchBTreducer,
  player: persistReducer(playerPersistConfig, playerReducer),
  profile: persistReducer(profilePersistConfig, profileReducer),
  playlist: playlistReducer,
  reset: resetReducer,
})
