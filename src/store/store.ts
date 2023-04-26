import { configureStore } from '@reduxjs/toolkit';

import { api } from './api/api';
import { authApi } from './api/auth.api';
import { rootReducers } from './reducers';

// if (IS_DEV) {
//   middlewares.push(logger);
// }

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([api.middleware, authApi.middleware]),
  devTools: process.env.NODE_ENV !== 'production',
});

export type TypeRootState = ReturnType<typeof store.getState>;

export default store;
