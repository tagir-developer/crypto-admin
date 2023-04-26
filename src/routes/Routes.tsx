import { useTypedSelector } from 'hooks/useTypedSelector';
import Login from 'pages/Login';
import Projects from 'pages/Projects';
import Wallets from 'pages/Wallets';
import React, { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Pages, paths } from './constants';

const AppRoutes: FC = () => {
  // TODO: брать отсюда, когда будет настроена авторизация
  // const { accessToken } = useTypedSelector((state) => state.common);

  // мок пока не настроена авторизация
  const accessToken = true;

  return (
    <BrowserRouter>
      {accessToken ? (
        <Routes>
          <Route path={paths[Pages.PROJECTS]} element={<Projects />} />

          <Route path={paths[Pages.WALLETS]} element={<Wallets />} />

          <Route path="*" element={<Navigate to={paths[Pages.PROJECTS]} />} />
        </Routes>
      ) : (
        <Routes>
          <Route path={paths[Pages.AUTH]}>
            <Route index element={<Login />} />
          </Route>

          <Route path="*" element={<Navigate to={paths[Pages.AUTH]} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default AppRoutes;
