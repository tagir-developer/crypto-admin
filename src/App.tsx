import 'antd/dist/antd.compact.min.css';
import { AUTH_DATA_STORAGE_KEY } from 'common/constants';
import Loader from 'components/Loader/Loader';
import { useTypedSelector } from 'hooks/useTypedSelector';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAccessToken, setAuthLoading } from 'store/reducers/common.slice';

import AppRoutes from './routes/Routes';

import 'styles/_variables.scss';
import 'styles/global.scss';

const App: FC = () => {
  const dispatch = useDispatch();

  const { authLoading } = useTypedSelector((state) => state.common);

  useEffect(() => {
    if (authLoading) {
      const accountData = localStorage.getItem(AUTH_DATA_STORAGE_KEY);

      if (accountData) {
        const parsedAccountData = JSON.parse(accountData);

        dispatch(setAccessToken(parsedAccountData.jwtToken));
      }

      dispatch(setAuthLoading(false));
    }
  }, [dispatch, authLoading]);

  if (authLoading) {
    return <Loader />;
  }

  return <AppRoutes />;
};

export default App;
