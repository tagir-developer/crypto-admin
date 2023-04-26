import { Button, Table } from 'antd';
import {
  ANT_TABLE_TEXT,
  DEFAULT_TABLE_ROWS_COUNT,
  TABLE_ROWS_HEIGHT,
} from 'common/constants';
import { convertSelectBlockChains } from 'common/helpers';
import { ButtonTypes } from 'common/interfaces';
import MainLayout from 'layouts/MainLayout';
import {
  getConvertedWalletItems,
  getWalletsTableColumns,
} from 'pages/Wallets/Wallets.helpers';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { walletsApi } from 'store/api/wallets.api';
import { setBlockChainSelect } from 'store/reducers/common.slice';

import CreateWalletModal from './CreateWalletModal';
import DeleteWalletModal from './DeleteWalletModal';
import EditWalletModal from './EditWalletModal';
import { IWallet } from './Wallets.interfaces';
import styles from './Wallets.module.scss';

const Wallets: FC = () => {
  const dispatch = useDispatch();

  const [isOpenCreateWalletModal, setIsOpenCreateWalletModal] = useState(false);
  const [isOpenEditWalletModal, setIsOpenEditWalletModal] = useState(false);
  const [isOpenDeleteWalletModal, setIsOpenDeleteWalletModal] = useState(false);
  const [activeWallet, setActiveWallet] = useState<IWallet | null>(null);

  const { data: walletsData, isFetching: walletsLoading } =
    walletsApi.useGetWalletsQuery('', {
      refetchOnMountOrArgChange: true,
    });

  const { data: blockChains } = walletsApi.useGetBlockchainsQuery('', {
    refetchOnMountOrArgChange: true,
  });

  const handleOpenCreateWallet = (): void => {
    setIsOpenCreateWalletModal(true);
  };

  const handleOpenEditWallet = (wallet: IWallet): void => {
    setActiveWallet(wallet);
    setIsOpenEditWalletModal(true);
  };

  const handleOpenDeleteWalletModal = (wallet: IWallet): void => {
    setActiveWallet(wallet);
    setIsOpenDeleteWalletModal(true);
  };

  const handleCancelModal = (
    setClose: React.Dispatch<React.SetStateAction<boolean>>,
  ): void => {
    setClose(false);
  };

  const handleSuccessfulAction = (): void => {
    setIsOpenCreateWalletModal(false);
    setIsOpenEditWalletModal(false);
    setIsOpenDeleteWalletModal(false);
    setActiveWallet(null);
  };

  const handleCancelDeleteWallet = (): void => {
    setIsOpenDeleteWalletModal(false);
    setActiveWallet(null);
  };

  const wallets = walletsData ? getConvertedWalletItems(walletsData) : [];

  useEffect(() => {
    if (blockChains) {
      dispatch(setBlockChainSelect(convertSelectBlockChains(blockChains)));
    }
  }, [blockChains, dispatch]);

  const tableScrollConfig =
    wallets.length > DEFAULT_TABLE_ROWS_COUNT
      ? { y: DEFAULT_TABLE_ROWS_COUNT * TABLE_ROWS_HEIGHT }
      : undefined;

  return (
    <MainLayout title="Кошельки">
      <div className={styles.wrapper}>
        <div className={styles['buttons-container']}>
          <Button
            className={styles['create-button']}
            size="large"
            type={ButtonTypes.PRIMARY}
            htmlType="button"
            onClick={handleOpenCreateWallet}
          >
            Создать кошелек
          </Button>
        </div>

        <Table
          rowKey={'id'}
          className={styles.table}
          columns={getWalletsTableColumns(
            handleOpenEditWallet,
            handleOpenDeleteWalletModal,
          )}
          dataSource={wallets}
          loading={walletsLoading}
          locale={ANT_TABLE_TEXT}
          scroll={tableScrollConfig}
          pagination={false}
        />
      </div>

      <CreateWalletModal
        open={isOpenCreateWalletModal}
        handleSuccessfulAction={handleSuccessfulAction}
        handleCancel={() => handleCancelModal(setIsOpenCreateWalletModal)}
      />

      <EditWalletModal
        open={!!activeWallet && isOpenEditWalletModal}
        activeWallet={activeWallet as IWallet}
        handleCancel={() => handleCancelModal(setIsOpenEditWalletModal)}
        handleSuccessfulAction={handleSuccessfulAction}
      />

      <DeleteWalletModal
        open={!!activeWallet && isOpenDeleteWalletModal}
        activeWallet={activeWallet as IWallet}
        handleCancel={handleCancelDeleteWallet}
      />
    </MainLayout>
  );
};

export default Wallets;
