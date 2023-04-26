import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import classNames from 'classnames';
import { AUTH_DATA_STORAGE_KEY } from 'common/constants';
import ModalConfirm from 'components/ModalConfirm';
import { useTypedSelector } from 'hooks/useTypedSelector';
import { ReactComponent as LogoutIcon } from 'images/sidebar/LogoutIcon.svg';
import AccountInfo from 'layouts/AccountInfo/AccountInfo';
import React, { FC, memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  setAccessToken,
  setIsSidebarCollapsed,
} from 'store/reducers/common.slice';

import { getDefaultSelectedKey, getMenuItems } from './Sidebar.helpers';
import styles from './Sidebar.module.scss';

const { Sider } = Layout;

const SIDER_WIDTH = 300;

const Sidebar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { isSidebarCollapsed: collapsed } = useTypedSelector(
    (state) => state.common,
  );

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLinkClick = (menuItemLink: string): void => {
    setSelectedKeys([menuItemLink]);
    navigate(menuItemLink);
  };

  const handleLogout = (): void => {
    setIsLogoutModalVisible(true);
  };

  const handleConfirmLogout = (): void => {
    setIsLogoutModalVisible(false);
    localStorage.removeItem(AUTH_DATA_STORAGE_KEY);
    dispatch(setAccessToken(null));
  };

  const handleCollapseSidebar = (value: boolean): void => {
    dispatch(setIsSidebarCollapsed(value));
  };

  const menuItems = getMenuItems(handleLinkClick);

  useEffect(() => {
    setSelectedKeys(getDefaultSelectedKey(location.pathname));
  }, [location.pathname]);

  return (
    <nav className={styles['navbar']}>
      <Sider
        width={SIDER_WIDTH}
        className={styles['sidebar-desktop']}
        collapsible={true}
        collapsed={collapsed}
        onCollapse={handleCollapseSidebar}
        collapsedWidth={130}
      >
        <div className={styles.header}>
          {!collapsed && <AccountInfo />}

          <Button
            type="link"
            className={classNames(styles['logout-btn'], {
              [styles['collapsed']]: collapsed,
            })}
            icon={<LogoutIcon />}
            size="large"
            onClick={handleLogout}
          />
        </div>

        <Menu
          defaultSelectedKeys={getDefaultSelectedKey(location.pathname)}
          mode="inline"
          selectedKeys={selectedKeys}
          inlineIndent={30}
          items={menuItems}
        />

        <Button
          type="link"
          className={styles['collapse-btn']}
          icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          size="large"
          onClick={() => handleCollapseSidebar(!collapsed)}
        />
      </Sider>

      <ModalConfirm
        open={isLogoutModalVisible}
        setIsVisible={setIsLogoutModalVisible}
        confirmText={'Вы действительно хотите выйти?'}
        buttonSubmitText={'Выйти'}
        buttonCancelText={'Отмена'}
        handleConfirm={handleConfirmLogout}
      />
    </nav>
  );
};

export default memo(Sidebar);
