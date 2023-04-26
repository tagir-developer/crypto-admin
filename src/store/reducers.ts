import { combineReducers } from '@reduxjs/toolkit';

import { api } from './api/api';
import { authApi } from './api/auth.api';
import commonSlice from './reducers/common.slice';

export const rootReducers = combineReducers({
  [api.reducerPath]: api.reducer,
  [authApi.reducerPath]: authApi.reducer,
  common: commonSlice,
});
