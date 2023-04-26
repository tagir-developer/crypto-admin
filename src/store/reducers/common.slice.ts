import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ISelectOption } from 'common/interfaces';

interface IInitialState {
  authLoading: boolean;
  accessToken: string | null;
  isSidebarCollapsed: boolean;
  blockChainSelect: ISelectOption[];
}

const initialState: IInitialState = {
  authLoading: true,
  accessToken: null,
  isSidebarCollapsed: false,
  blockChainSelect: [],
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },

    setBlockChainSelect: (state, action: PayloadAction<ISelectOption[]>) => {
      state.blockChainSelect = action.payload;
    },
  },
});

export const {
  setAuthLoading,
  setAccessToken,
  setIsSidebarCollapsed,
  setBlockChainSelect,
} = commonSlice.actions;

export default commonSlice.reducer;
