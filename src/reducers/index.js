import { combineReducers } from 'redux';
import authReducer from './auth';
import registerReducer from './register';
import fetchYTreducer from './fetchYT';
import fetchBCreducer from './fetchBC';
import fetchBTreducer from './fetchBT';
import playerReducer from './player';
import searchReducer from './search';
import homeReducer from './home';
import profileReducer from './profile';
import playlistReducer from './playlist';
import resetReducer from './reset';
import navReducer from './nav';
import libraryReducer from './library';
import themeReducer from './theme';
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
  blacklist: ['itemAddedId', 'addLoading', 'currentTrack', 'audio'],
};

export default combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  register: persistReducer(registerPersistConfig, registerReducer),
  search: searchReducer,
  home: homeReducer,
  fetchYT: fetchYTreducer,
  fetchBC: fetchBCreducer,
  fetchBT: fetchBTreducer,
  player: persistReducer(playerPersistConfig, playerReducer),
  profile: persistReducer(profilePersistConfig, profileReducer),
  playlist: playlistReducer,
  reset: resetReducer,
  nav: navReducer,
  library: libraryReducer,
  theme: themeReducer,
})
