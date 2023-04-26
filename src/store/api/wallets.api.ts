import { BlockChains } from 'common/interfaces';
import {
  ICreateWalletDto,
  IEditWalletDto,
  IWallet,
} from 'pages/Wallets/Wallets.interfaces';

import { api } from './api';

export const WALLET_API_URL = '/wallets';
export const BLOCKCHAINS_URL = '/blockChains';

export const walletsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWallets: builder.query<IWallet[], string>({
      query: (params) => {
        return { url: WALLET_API_URL };
      },
      providesTags: ['Wallets'],
    }),

    createWallet: builder.mutation<{ message: string }, ICreateWalletDto>({
      query: (data) => ({
        url: WALLET_API_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wallets'],
    }),

    updateWallet: builder.mutation<{ message: string }, IEditWalletDto>({
      query: (data) => ({
        url: `${WALLET_API_URL}/${data.id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Wallets'],
    }),

    deleteWallet: builder.mutation<{ message: string }, string>({
      query: (walletId) => ({
        url: `${WALLET_API_URL}/${walletId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wallets'],
    }),

    getBlockchains: builder.query<BlockChains[], string>({
      query: (params) => {
        return { url: BLOCKCHAINS_URL };
      },
    }),
  }),
});
