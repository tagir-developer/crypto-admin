import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { IAccount, ILoginDto } from 'common/interfaces';

import { API_URL } from './api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<IAccount, ILoginDto>({
      query: (data) => ({
        url: `login`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});
