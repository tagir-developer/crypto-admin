import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/dist/query/react';
import { Mutex } from 'async-mutex';
import { AUTH_DATA_STORAGE_KEY } from 'common/constants';
import { IAccount } from 'common/interfaces';
import { setAccessToken, setAuthLoading } from 'store/reducers/common.slice';
import { TypeRootState } from 'store/store';

export const API_URL = process.env.REACT_APP_API_URL;

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as TypeRootState).common.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          { url: '/refresh-token', method: 'GET' },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          const typedResult = refreshResult.data as IAccount;
          const accessToken = typedResult.jwtToken;

          await api.dispatch(setAccessToken(accessToken));
          await localStorage.setItem(
            AUTH_DATA_STORAGE_KEY,
            JSON.stringify(typedResult),
          );

          result = await baseQuery(args, api, extraOptions);
        } else {
          const logoutResult = await baseQuery(
            { url: '/logout', method: 'GET' },
            api,
            extraOptions,
          );

          if (logoutResult.data) {
            await localStorage.removeItem(AUTH_DATA_STORAGE_KEY);
            await api.dispatch(setAccessToken(null));
            await api.dispatch(setAuthLoading(true));
          }
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();

      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Projects', 'Wallets'],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({}),
});
