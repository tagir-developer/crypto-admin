import { Button } from 'antd';
import { AUTH_DATA_STORAGE_KEY } from 'common/constants';
import { ButtonTypes } from 'common/interfaces';
import ModalConfirm from 'components/ModalConfirm';
import { useOnClickOutsideMenu } from 'hooks/useOnClickOutside';
import { ReactComponent as LogoutIcon } from 'images/sidebar/LogoutIcon.svg';
import { ReactComponent as MobileMenuIcon } from 'images/sidebar/MobileMenuIcon.svg';
import { ReactComponent as ProjectsIcon } from 'images/sidebar/ProjectsIcon.svg';
import { ReactComponent as WalletIcon } from 'images/sidebar/WalletIcon.svg';
import AccountInfo from 'layouts/AccountInfo/AccountInfo';
import React, { FC, memo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Pages, paths } from 'routes/constants';
import { setAccessToken } from 'store/reducers/common.slice';

import styles from './Header.module.scss';

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuRef = useRef(null);
  useOnClickOutsideMenu(menuRef, () => setIsMenuOpen(false));

  const handleLogout = (e: React.MouseEvent<HTMLLIElement>): void => {
    e.preventDefault();
    setIsLogoutModalVisible(true);
  };

  const handleConfirmLogout = (): void => {
    setIsLogoutModalVisible(false);
    localStorage.removeItem(AUTH_DATA_STORAGE_KEY);
    dispatch(setAccessToken(null));
  };

  const handleOpenMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = (menuItemLink: string): void => {
    navigate(menuItemLink);
  };

  return (
    <div className={styles['wrapper']}>
      <div className={styles['left-side']}>
        <AccountInfo />
      </div>

      <Button
        className={styles['mobile-menu-btn']}
        type={ButtonTypes.LINK}
        icon={<MobileMenuIcon />}
        onClick={handleOpenMenu}
      />

      {isMenuOpen && (
        <ul className={styles['menu']} ref={menuRef}>
          <li
            className={styles['menu-item']}
            onClick={() => handleLinkClick(paths[Pages.PROJECTS])}
          >
            <ProjectsIcon />
            Проекты
          </li>

          <li
            className={styles['menu-item']}
            onClick={() => handleLinkClick(paths[Pages.WALLETS])}
          >
            <WalletIcon />
            Кошельки
          </li>

          <li className={styles['menu-item']} onClick={handleLogout}>
            <LogoutIcon />
            Выход
          </li>
        </ul>
      )}

      <ModalConfirm
        open={isLogoutModalVisible}
        setIsVisible={setIsLogoutModalVisible}
        confirmText={'Вы действительно хотите выйти?'}
        buttonSubmitText={'Выйти'}
        buttonCancelText={'Отмена'}
        handleConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default memo(Header);
